import {
  getTenantConfig,
  getDefaultTenantConfig,
} from "@/lib/tenant-template-config"
import StandardTemplate from "@/components/tenant-templates/StandardTemplate"
import MediumTemplate from "@/components/tenant-templates/MediumTemplate"
import PremiumTemplate from "@/components/tenant-templates/PremiumTemplate"
import { headers } from "next/headers"

/* ------------------------------------------------------------------ */
/*  Tenant Site — Şablon Seçici (Template Router)                      */
/*  Subdomain slug'ına göre tenant config'i okur ve uygun şablonu      */
/*  render eder: standard | medium | premium                           */
/* ------------------------------------------------------------------ */

export default async function TenantSitePage() {
  const headersList = await headers()
  const slug = headersList.get("x-franchise-slug") ?? ""
  const config = getTenantConfig(slug) ?? getDefaultTenantConfig()

  switch (config.template) {
    case "standard":
      return <StandardTemplate config={config} />
    case "medium":
      return <MediumTemplate config={config} />
    case "premium":
    default:
      return <PremiumTemplate config={config} />
  }
}
