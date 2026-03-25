import {
  Html, Head, Preview, Body, Container, Heading, Text, Button, Section, Hr,
} from '@react-email/components'

interface Props {
  clientName: string
  fileCount: number
  portalUrl: string
}

export function MediaDelivered({ clientName, fileCount, portalUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your wedding {fileCount === 1 ? 'file is' : 'files are'} ready to view</Preview>
      <Body style={{ backgroundColor: '#FAFAF8', fontFamily: 'Georgia, serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 560, margin: '40px auto', backgroundColor: '#ffffff', borderRadius: 16, overflow: 'hidden' }}>

          <Section style={{ backgroundColor: '#2C2A27', padding: '32px 40px' }}>
            <Heading style={{ color: '#C9A96E', fontSize: 22, fontFamily: 'Georgia, serif', margin: 0, letterSpacing: '0.04em' }}>
              Your memories are ready ✨
            </Heading>
          </Section>

          <Section style={{ padding: '32px 40px' }}>
            <Text style={{ color: '#2C2A27', fontSize: 16, lineHeight: 1.6, marginTop: 0 }}>
              Hi {clientName},
            </Text>
            <Text style={{ color: '#5C524C', fontSize: 15, lineHeight: 1.7 }}>
              Your wedding {fileCount === 1 ? 'file has' : `${fileCount} files have`} just been delivered to your private portal.
              You can view, download, and save your favourites at any time — they&rsquo;re yours to keep forever.
            </Text>

            <Hr style={{ borderColor: '#E5D4B0', margin: '28px 0' }} />

            <Section style={{ textAlign: 'center' }}>
              <Button
                href={portalUrl}
                style={{
                  backgroundColor: '#C9A96E',
                  color: '#ffffff',
                  padding: '14px 32px',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                View Your Gallery
              </Button>
            </Section>

            <Text style={{ color: '#9A8F87', fontSize: 13, lineHeight: 1.6, marginTop: 28 }}>
              If you have any questions or would like to request changes, simply reply to this email.
            </Text>
          </Section>

          <Section style={{ backgroundColor: '#F0EDE8', padding: '20px 40px' }}>
            <Text style={{ color: '#9A8F87', fontSize: 12, margin: 0, textAlign: 'center' }}>
              With love &amp; care &nbsp;·&nbsp; Your Wedding Films
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
