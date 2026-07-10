interface CompanyInfo {
  companyName: string | null
  industry: string | null
  productsOrServices: string[]
  businessDescription: string | null
  targetAudience: string | null
  brandMission: string | null
  brandVision: string | null
  coreValues: string[]
  usp: string | null
  headquarters: string | null
  yearsInBusiness: string | null
  brandPersonality: string | null
  mainCompetitors: string[]
  primaryCallToAction: string | null
  websiteQuality: string | null
  overallProfessionalism: string | null
  wikipediaVerified?: {
    founderName: boolean
    foundedYear: boolean
    employeeCount: boolean
    revenue: boolean
    headquarters: boolean
    industry: boolean
    ceoName: boolean
  }
  companyDetails?: {
    founderName: string | null
    founderBackground: string | null
    ceoName: string | null
    ownerName?: string | null
    ownerBackground?: string | null
  }
}

interface Props {
  info: CompanyInfo
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded ml-1.5">
      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
      Wiki
    </span>
  )
}

export default function CompanyInfo({ info }: Props) {
  const fields: { label: string; value: string | string[] | null; verified?: boolean }[] = [
    { label: "Company", value: info.companyName },
    { label: "Industry", value: info.industry, verified: info.wikipediaVerified?.industry },
    { label: "Founder", value: info.companyDetails?.founderName || null, verified: info.wikipediaVerified?.founderName },
    { label: "Owner", value: info.companyDetails?.ownerName || null },
    { label: "CEO", value: info.companyDetails?.ceoName || null, verified: info.wikipediaVerified?.ceoName },
    { label: "Description", value: info.businessDescription },
    { label: "Target Audience", value: info.targetAudience },
    { label: "Mission", value: info.brandMission },
    { label: "Vision", value: info.brandVision },
    { label: "Core Values", value: info.coreValues },
    { label: "USP", value: info.usp },
    { label: "Headquarters", value: info.headquarters, verified: info.wikipediaVerified?.headquarters },
    { label: "Years in Business", value: info.yearsInBusiness, verified: info.wikipediaVerified?.foundedYear },
    { label: "Brand Personality", value: info.brandPersonality },
    { label: "Main Competitors", value: info.mainCompetitors },
    { label: "Primary CTA", value: info.primaryCallToAction },
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-cyan-50">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Company Profile</h3>
          <span className="text-[10px] text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200">
            Data from website + Wikipedia
          </span>
        </div>
      </div>
      <div className="divide-y divide-gray-50">
        {fields.map((f) => {
          if (!f.value || (Array.isArray(f.value) && f.value.length === 0)) return null
          const display = Array.isArray(f.value) ? f.value.join(", ") : f.value
          return (
            <div key={f.label} className="px-6 py-3 flex items-start gap-4">
              <span className="text-sm font-medium text-gray-400 w-36 flex-shrink-0">{f.label}</span>
              <span className="text-sm text-gray-800 flex items-center gap-1">
                {display}
                {f.verified && <VerifiedBadge />}
              </span>
            </div>
          )
        })}
      </div>
      {(info.websiteQuality || info.overallProfessionalism) && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          {info.websiteQuality && (
            <div className="mb-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Website Quality</span>
              <p className="text-sm text-gray-700 mt-1">{info.websiteQuality}</p>
            </div>
          )}
          {info.overallProfessionalism && (
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Professionalism</span>
              <p className="text-sm text-gray-700 mt-1">{info.overallProfessionalism}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
