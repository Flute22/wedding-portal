import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import archiver from 'archiver'
import { PassThrough } from 'node:stream'

export const dynamic = 'force-dynamic'
// Note: for large files this can take a while — consider increasing timeout in vercel.json
// or streaming the zip incrementally (which this implementation does)

export async function GET() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // RLS ensures only this client's files are returned
  const { data: files, error } = await supabase
    .from('media_files')
    .select('file_name, storage_path')
    .order('file_type', { ascending: true })

  if (error || !files || files.length === 0) {
    return NextResponse.json({ error: 'No files found' }, { status: 404 })
  }

  const passthrough = new PassThrough()
  const archive     = archiver('zip', { zlib: { level: 1 } }) // level 1 = fast

  archive.pipe(passthrough)

  const adminSupabase = createAdminClient()

  // Download and stream each file into the archive
  for (const file of files) {
    const { data: blob, error: dlError } = await adminSupabase.storage
      .from('client-media')
      .download(file.storage_path)

    if (dlError || !blob) {
      console.error(`Failed to download ${file.file_name}:`, dlError)
      continue
    }

    const buffer = Buffer.from(await blob.arrayBuffer())
    archive.append(buffer, { name: file.file_name })
  }

  archive.finalize()

  // Convert Node stream to Web stream for Next.js
  const webStream = new ReadableStream({
    start(controller) {
      passthrough.on('data', chunk => controller.enqueue(chunk))
      passthrough.on('end', () => controller.close())
      passthrough.on('error', err => controller.error(err))
    },
  })

  return new NextResponse(webStream, {
    headers: {
      'Content-Type':        'application/zip',
      'Content-Disposition': 'attachment; filename="your-wedding-media.zip"',
      'Cache-Control':       'no-store',
    },
  })
}
