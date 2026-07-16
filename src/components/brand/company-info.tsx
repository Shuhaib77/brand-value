import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Star, Building2, MapPin, Target, Eye, Heart, Users, Lightbulb, Globe, Award, TrendingUp } from "lucide-react"
import type { CompanyInfo } from "@/types/brand"

interface Props {
  info: CompanyInfo
}

const fieldConfig: { label: string; icon: typeof Star; key: keyof CompanyInfo | string }[] = [
  { label: "Company", icon: Building2, key: "companyName" },
  { label: "Industry", icon: Globe, key: "industry" },
  { label: "Headquarters", icon: MapPin, key: "headquarters" },
  { label: "Target Audience", icon: Users, key: "targetAudience" },
  { label: "Mission", icon: Target, key: "brandMission" },
  { label: "Vision", icon: Eye, key: "brandVision" },
  { label: "USP", icon: Award, key: "usp" },
  { label: "Brand Personality", icon: Heart, key: "brandPersonality" },
  { label: "Primary CTA", icon: TrendingUp, key: "primaryCallToAction" },
]

export default function CompanyInfo({ info }: Props) {
  function getValue(key: string) {
    if (key === "companyName") return info.companyName as string | null
    if (key === "industry") return info.industry
    if (key === "headquarters") return info.headquarters
    if (key === "targetAudience") return info.targetAudience
    if (key === "brandMission") return info.brandMission
    if (key === "brandVision") return info.brandVision
    if (key === "usp") return info.usp
    if (key === "brandPersonality") return info.brandPersonality
    if (key === "primaryCallToAction") return info.primaryCallToAction
    return null
  }

  function isVerified(key: string) {
    if (key === "industry") return info.wikipediaVerified?.industry
    if (key === "headquarters") return info.wikipediaVerified?.headquarters
    return false
  }

  return (
    <Card>
      <CardHeader gradient>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Company Profile</h3>
          <Badge variant="slate" size="sm">Data from website + Wikipedia</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {fieldConfig.map((f) => {
            const value = getValue(f.key)
            const verified = isVerified(f.key)
            if (!value) return null
            const Icon = f.icon
            return (
              <div key={f.key} className="px-6 py-3 flex items-start gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-400 w-28 flex-shrink-0">{f.label}</span>
                <span className="text-sm text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  {value}
                  {verified && <Badge variant="success" size="sm">Wiki</Badge>}
                </span>
              </div>
            )
          })}

          {/* Founder / Owner / CEO */}
          {info.companyDetails?.founderName && (
            <div className="px-6 py-3 flex items-start gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
              <Star className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-400 w-28 flex-shrink-0">Founder</span>
              <span className="text-sm text-gray-800 dark:text-gray-200">
                {info.companyDetails.founderName}
                {info.wikipediaVerified?.founderName && <Badge variant="success" size="sm" className="ml-1.5">Wiki</Badge>}
              </span>
            </div>
          )}
          {info.companyDetails?.ownerName && (
            <div className="px-6 py-3 flex items-start gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
              <Star className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-400 w-28 flex-shrink-0">Owner</span>
              <span className="text-sm text-gray-800 dark:text-gray-200">{info.companyDetails.ownerName}</span>
            </div>
          )}
          {info.companyDetails?.ceoName && (
            <div className="px-6 py-3 flex items-start gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
              <Star className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-400 w-28 flex-shrink-0">CEO</span>
              <span className="text-sm text-gray-800 dark:text-gray-200">
                {info.companyDetails.ceoName}
                {info.wikipediaVerified?.ceoName && <Badge variant="success" size="sm" className="ml-1.5">Wiki</Badge>}
              </span>
            </div>
          )}

          {/* Core Values */}
          {(info.coreValues ?? []).length > 0 && (
            <div className="px-6 py-3 flex items-start gap-4">
              <Heart className="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-400 w-28 flex-shrink-0">Core Values</span>
              <div className="flex flex-wrap gap-1.5">
                {info.coreValues.map((v, i) => (
                  <Badge key={i} variant="default" size="sm">{v}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Competitors */}
          {(info.mainCompetitors ?? []).length > 0 && (
            <div className="px-6 py-3 flex items-start gap-4">
              <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-400 w-28 flex-shrink-0">Competitors</span>
              <span className="text-sm text-gray-800 dark:text-gray-200">{info.mainCompetitors.join(", ")}</span>
            </div>
          )}

          {/* Products */}
          {(info.productsOrServices ?? []).length > 0 && (
            <div className="px-6 py-3 flex items-start gap-4">
              <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-400 w-28 flex-shrink-0">Products</span>
              <span className="text-sm text-gray-800 dark:text-gray-200">{info.productsOrServices.join(", ")}</span>
            </div>
          )}
        </div>

        {(info.websiteQuality || info.overallProfessionalism) && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
            {info.websiteQuality && (
              <div className="mb-2">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Website Quality</span>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{info.websiteQuality}</p>
              </div>
            )}
            {info.overallProfessionalism && (
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Professionalism</span>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{info.overallProfessionalism}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
