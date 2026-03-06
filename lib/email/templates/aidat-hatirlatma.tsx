/**
 * Aidat Hatirlatma Email Template
 * Veliye aidat odeme hatirlatmasi gonderir.
 */

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Preview,
} from '@react-email/components'
import * as React from 'react'

export interface AidatHatirlatmaProps {
  /** Veli adi */
  veliAd: string
  /** Sporcu adi */
  sporcuAd: string
  /** Tesis adi */
  tesisAdi: string
  /** Aidat tutari (ornek: "700 TL") */
  aidatTutari: string
  /** Son odeme tarihi (ornek: "15 Mart 2026") */
  sonOdemeTarihi: string
  /** Ay / donem (ornek: "Mart 2026") */
  donem: string
}

export function AidatHatirlatma({
  veliAd = 'Sayin Veli',
  sporcuAd = 'Sporcu',
  tesisAdi = 'YiSA-S Tesis',
  aidatTutari = '',
  sonOdemeTarihi = '',
  donem = '',
}: AidatHatirlatmaProps) {
  return (
    <Html lang="tr">
      <Head />
      <Preview>Aidat Hatirlatmasi - {donem}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>Aidat Odeme Hatirlatmasi</Heading>
          <Hr style={hrStyle} />
          <Text style={textStyle}>Merhaba {veliAd},</Text>
          <Text style={textStyle}>
            <strong>{sporcuAd}</strong> icin <strong>{tesisAdi}</strong>{' '}
            bunyesindeki aidat odemeniz hakkinda hatirlatma:
          </Text>
          <Section style={infoBoxStyle}>
            <Text style={infoTextStyle}>
              <strong>Donem:</strong> {donem}
            </Text>
            <Text style={infoTextStyle}>
              <strong>Tutar:</strong> {aidatTutari}
            </Text>
            <Text style={infoTextStyle}>
              <strong>Son Odeme Tarihi:</strong> {sonOdemeTarihi}
            </Text>
          </Section>
          <Text style={textStyle}>
            Odemenizi zamaninda gerceklestirmenizi rica ederiz. Sorulariniz icin
            tesis yonetimiyle iletisime gecebilirsiniz.
          </Text>
          <Hr style={hrStyle} />
          <Text style={footerStyle}>
            Bu email {tesisAdi} tarafindan YiSA-S platformu uzerinden
            gonderilmistir.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// ─── Styles ────────────────────────────────────────────────────────────────

const bodyStyle: React.CSSProperties = {
  backgroundColor: '#f4f4f7',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: 0,
}

const containerStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  margin: '40px auto',
  maxWidth: '560px',
  padding: '32px 40px',
}

const headingStyle: React.CSSProperties = {
  color: '#1a1a2e',
  fontSize: '24px',
  fontWeight: 700,
  margin: '0 0 16px',
  textAlign: 'center' as const,
}

const hrStyle: React.CSSProperties = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
}

const textStyle: React.CSSProperties = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
}

const infoBoxStyle: React.CSSProperties = {
  backgroundColor: '#fefce8',
  borderLeft: '4px solid #eab308',
  borderRadius: '4px',
  margin: '16px 0',
  padding: '12px 16px',
}

const infoTextStyle: React.CSSProperties = {
  color: '#713f12',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '4px 0',
}

const footerStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '18px',
  textAlign: 'center' as const,
}

export default AidatHatirlatma
