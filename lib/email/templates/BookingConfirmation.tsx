import {
  Html, Head, Preview, Body, Container, Heading, Text, Hr, Section, Row, Column,
} from '@react-email/components'
import { format } from 'date-fns'

interface Props {
  name: string
  start_time: string
  appointment_type: string
  isClient: boolean
  notes?: string
}

const typeLabels: Record<string, string> = {
  consultation:    'Initial Consultation',
  review_session:  'Video Review Session',
  other:           'Session',
}

export function BookingConfirmation({ name, start_time, appointment_type, isClient, notes }: Props) {
  const label     = typeLabels[appointment_type] ?? 'Session'
  const formatted = format(new Date(start_time), "EEEE, MMMM d, yyyy 'at' h:mm a")

  return (
    <Html>
      <Head />
      <Preview>{isClient ? `Your ${label} is confirmed` : `New booking: ${name}`}</Preview>
      <Body style={{ backgroundColor: '#FAFAF8', fontFamily: 'Georgia, serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 560, margin: '40px auto', backgroundColor: '#ffffff', borderRadius: 16, overflow: 'hidden' }}>

          {/* Header */}
          <Section style={{ backgroundColor: '#2C2A27', padding: '32px 40px' }}>
            <Heading style={{ color: '#C9A96E', fontSize: 22, fontFamily: 'Georgia, serif', margin: 0, letterSpacing: '0.04em' }}>
              {isClient ? 'Your session is confirmed' : 'New booking received'}
            </Heading>
          </Section>

          {/* Body */}
          <Section style={{ padding: '32px 40px' }}>
            <Text style={{ color: '#2C2A27', fontSize: 16, lineHeight: 1.6, marginTop: 0 }}>
              {isClient ? `Hi ${name},` : `A new booking has been made by ${name}.`}
            </Text>

            {isClient && (
              <Text style={{ color: '#5C524C', fontSize: 15, lineHeight: 1.6 }}>
                Your <strong>{label}</strong> has been confirmed. Here are the details:
              </Text>
            )}

            {/* Details card */}
            <Section style={{ backgroundColor: '#FAF0EB', borderRadius: 12, padding: '20px 24px', margin: '24px 0' }}>
              <Row>
                <Column>
                  <Text style={{ color: '#9A8F87', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px' }}>Session type</Text>
                  <Text style={{ color: '#2C2A27', fontSize: 15, fontWeight: 'bold', margin: 0 }}>{label}</Text>
                </Column>
              </Row>
              <Hr style={{ borderColor: '#E5D4B0', margin: '16px 0' }} />
              <Row>
                <Column>
                  <Text style={{ color: '#9A8F87', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px' }}>Date & time</Text>
                  <Text style={{ color: '#2C2A27', fontSize: 15, fontWeight: 'bold', margin: 0 }}>{formatted}</Text>
                </Column>
              </Row>
              {notes && (
                <>
                  <Hr style={{ borderColor: '#E5D4B0', margin: '16px 0' }} />
                  <Row>
                    <Column>
                      <Text style={{ color: '#9A8F87', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 4px' }}>Notes</Text>
                      <Text style={{ color: '#2C2A27', fontSize: 15, margin: 0 }}>{notes}</Text>
                    </Column>
                  </Row>
                </>
              )}
            </Section>

            {isClient && (
              <Text style={{ color: '#5C524C', fontSize: 14, lineHeight: 1.6 }}>
                You&rsquo;ll receive a reminder closer to the date. If you need to reschedule, please reply to this email.
              </Text>
            )}
          </Section>

          {/* Footer */}
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
