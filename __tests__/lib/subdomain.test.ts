import { describe, it, expect } from 'vitest'
import {
  getPanelFromHost,
  getFranchiseSlugFromHost,
  FRANCHISE_SUBDOMAINS_DEFAULT,
  PANEL_DEFAULT_PATH,
  PANEL_LOGIN_PATH,
  PANEL_PWA_NAME,
} from '@/lib/subdomain'

describe('getPanelFromHost', () => {
  it('null host www donmeli', () => {
    expect(getPanelFromHost(null)).toBe('www')
  })

  it('app.yisa-s.com patron donmeli', () => {
    expect(getPanelFromHost('app.yisa-s.com')).toBe('patron')
  })

  it('app.yisa-s.com:3000 (port ile) patron donmeli', () => {
    expect(getPanelFromHost('app.yisa-s.com:3000')).toBe('patron')
  })

  it('franchise.yisa-s.com franchise donmeli', () => {
    expect(getPanelFromHost('franchise.yisa-s.com')).toBe('franchise')
  })

  it('veli.yisa-s.com veli donmeli', () => {
    expect(getPanelFromHost('veli.yisa-s.com')).toBe('veli')
  })

  it('www.yisa-s.com www donmeli', () => {
    expect(getPanelFromHost('www.yisa-s.com')).toBe('www')
  })

  it('yisa-s.com (bare domain) www donmeli', () => {
    expect(getPanelFromHost('yisa-s.com')).toBe('www')
  })

  it('bjktuzlacimnastik.yisa-s.com franchise_site donmeli', () => {
    expect(getPanelFromHost('bjktuzlacimnastik.yisa-s.com')).toBe('franchise_site')
  })

  it('fenerbahceatasehir.yisa-s.com franchise_site donmeli', () => {
    expect(getPanelFromHost('fenerbahceatasehir.yisa-s.com')).toBe('franchise_site')
  })

  it('bilinmeyen.yisa-s.com franchise_site donmeli', () => {
    expect(getPanelFromHost('bilinmeyen.yisa-s.com')).toBe('franchise_site')
  })

  it('custom subdomains listesiyle franchise_site tespit etmeli', () => {
    expect(getPanelFromHost('ozelokul.yisa-s.com', ['ozelokul'])).toBe('franchise_site')
  })

  it('bos string www donmeli', () => {
    expect(getPanelFromHost('')).toBe('www')
  })
})

describe('getFranchiseSlugFromHost', () => {
  it('null host null donmeli', () => {
    expect(getFranchiseSlugFromHost(null)).toBeNull()
  })

  it('app.yisa-s.com null donmeli (sistem subdomain)', () => {
    expect(getFranchiseSlugFromHost('app.yisa-s.com')).toBeNull()
  })

  it('www.yisa-s.com null donmeli', () => {
    expect(getFranchiseSlugFromHost('www.yisa-s.com')).toBeNull()
  })

  it('veli.yisa-s.com null donmeli', () => {
    expect(getFranchiseSlugFromHost('veli.yisa-s.com')).toBeNull()
  })

  it('franchise.yisa-s.com null donmeli', () => {
    expect(getFranchiseSlugFromHost('franchise.yisa-s.com')).toBeNull()
  })

  it('bjktuzlacimnastik.yisa-s.com slug donmeli', () => {
    expect(getFranchiseSlugFromHost('bjktuzlacimnastik.yisa-s.com')).toBe('bjktuzlacimnastik')
  })

  it('herhangiokul.yisa-s.com slug donmeli', () => {
    expect(getFranchiseSlugFromHost('herhangiokul.yisa-s.com')).toBe('herhangiokul')
  })

  it('port numarasi slug i etkilememeli', () => {
    expect(getFranchiseSlugFromHost('bjktuzlacimnastik.yisa-s.com:3000')).toBe('bjktuzlacimnastik')
  })

  it('buyuk harf normalize edilmeli', () => {
    expect(getFranchiseSlugFromHost('BJKTuzla.yisa-s.com')).toBe('bjktuzla')
  })
})

describe('Sabit tanimlar', () => {
  it('FRANCHISE_SUBDOMAINS_DEFAULT varsayilan subdomain icermeli', () => {
    expect(FRANCHISE_SUBDOMAINS_DEFAULT.length).toBeGreaterThanOrEqual(3)
    expect(FRANCHISE_SUBDOMAINS_DEFAULT).toContain('bjktuzlacimnastik')
    expect(FRANCHISE_SUBDOMAINS_DEFAULT).toContain('fenerbahceatasehir')
    expect(FRANCHISE_SUBDOMAINS_DEFAULT).toContain('kartalcimnastik')
  })

  it('PANEL_DEFAULT_PATH tum panel tipleri icin tanimli olmali', () => {
    const panelTypes = ['patron', 'franchise', 'franchise_site', 'veli', 'www'] as const
    panelTypes.forEach((pt) => {
      expect(PANEL_DEFAULT_PATH[pt]).toBeDefined()
      expect(typeof PANEL_DEFAULT_PATH[pt]).toBe('string')
    })
  })

  it('PANEL_LOGIN_PATH tum panel tipleri icin tanimli olmali', () => {
    const panelTypes = ['patron', 'franchise', 'franchise_site', 'veli', 'www'] as const
    panelTypes.forEach((pt) => {
      expect(PANEL_LOGIN_PATH[pt]).toBeDefined()
    })
  })

  it('PANEL_PWA_NAME tum panel tipleri icin tanimli olmali', () => {
    const panelTypes = ['patron', 'franchise', 'franchise_site', 'veli', 'www'] as const
    panelTypes.forEach((pt) => {
      expect(PANEL_PWA_NAME[pt]).toBeDefined()
      expect(PANEL_PWA_NAME[pt].length).toBeGreaterThan(0)
    })
  })
})
