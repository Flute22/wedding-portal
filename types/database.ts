// Auto-generate the full version with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID
// This is a hand-written minimal version for development

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type UserRole = 'admin' | 'client'
export type FileType = 'photo' | 'video'
export type AppointmentType = 'consultation' | 'review_session' | 'other'
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface Profile {
  id: string
  full_name: string
  email: string
  role: UserRole
  avatar_url: string | null
  created_at: string
}

export interface Client {
  id: string
  user_id: string
  wedding_date: string | null
  package_type: string | null
  notes: string | null
  created_by: string | null
  created_at: string
  // joined fields
  profile?: Profile
}

export interface MediaFile {
  id: string
  client_id: string
  file_name: string
  file_type: FileType
  storage_path: string
  size_bytes: number | null
  thumbnail_url: string | null
  is_favorite: boolean
  uploaded_by: string | null
  created_at: string
  // computed — not in DB
  url?: string | null
}

export interface MediaReaction {
  id: string
  media_file_id: string
  client_id: string
  reaction: string
  created_at: string
}

export interface Appointment {
  id: string
  client_id: string | null
  appointment_type: AppointmentType
  start_time: string
  end_time: string
  status: AppointmentStatus
  notes: string | null
  booked_by_name: string | null
  booked_by_email: string | null
  created_at: string
  // joined fields
  client?: Client
}

export interface AvailabilityBlock {
  id: string
  start_time: string
  end_time: string
  reason: string | null
  created_at: string
}

export interface TimeSlot {
  start: string
  end: string
  available: boolean
}
