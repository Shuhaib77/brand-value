"use client"

import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Star, ExternalLink, Briefcase, Crown, Coins } from "lucide-react"

interface LeadershipMember {
  name: string
  title: string
  bio?: string | null
  linkedInUrl?: string | null
  yearsAtCompany?: string | null
}

interface CompanyDetails {
  founderName: string | null
  founderBackground: string | null
  founderLinkedInUrl?: string | null
  ceoName: string | null
  ceoLinkedInUrl?: string | null
  ownerName?: string | null
  ownerBackground?: string | null
  ownerLinkedInUrl?: string | null
  leadershipTeam: LeadershipMember[]
  employeeCount: string | null
  foundedYear: string | null
  fundingStage: string | null
  investors: string[]
  estimatedRevenue: string | null
  awards?: string[]
  certifications?: string[]
  partnerships?: string[]
  companyCulture?: string | null
}

interface FounderOwnersProps {
  details?: CompanyDetails
  wikiVerified?: {
    founderName: boolean
    foundedYear: boolean
    employeeCount: boolean
    headquarters: boolean
    industry: boolean
    ceoName: boolean
  } | null
}

function LinkIcon({ url }: { url: string | null | undefined }) {
  if (!url) return <span className="text-gray-400 text-sm italic">No link available</span>
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline text-sm truncate max-w-full transition-colors"
    >
      <ExternalLink className="w-4 h-4 flex-shrink-0" />
      <span className="truncate">{url.replace(/^https?:\/\//, "")}</span>
    </a>
  )
}

export default function FounderOwners({ details, wikiVerified }: FounderOwnersProps) {
  if (!details) return null

  const founders = (details.leadershipTeam || []).filter(
    (m) => m.title === "Founder"
  )
  const coFounders = (details.leadershipTeam || []).filter(
    (m) => m.title?.toLowerCase().includes("co-founder")
  )

  const hasOwner = details.ownerName && details.ownerName !== details.founderName
  const hasCeo = details.ceoName && !founders.some(f => f.name === details.ceoName) && !coFounders.some(cf => cf.name === details.ceoName)

  return (
    <div className="space-y-6">
      {founders.length > 0 && (
        <Card>
          <CardHeader gradient>
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900 text-sm">Founder{founders.length > 1 ? "s" : ""}</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {founders.map((f, i) => (
                <div key={i} className="flex items-start gap-3 pb-4 last:pb-0 last:border-0 border-b border-gray-100 dark:border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                    {f.name?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{f.name}</h3>
                      {i === 0 && wikiVerified?.founderName && <Badge variant="success">Wiki Verified</Badge>}
                      <Badge>Founder</Badge>
                      {f.name === details.ceoName && <Badge variant="accent">CEO</Badge>}
                      {f.name === details.ownerName && <Badge variant="secondary">Owner</Badge>}
                    </div>
                    {i === 0 && details.founderBackground && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">{details.founderBackground}</p>
                    )}
                    <LinkIcon url={i === 0 ? details.founderLinkedInUrl : f.linkedInUrl} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {coFounders.length > 0 && (
        <Card>
          <CardHeader gradient>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900 text-sm">Co-Founder{coFounders.length > 1 ? "s" : ""}</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {coFounders.map((cf, i) => (
                <div key={i} className="flex items-start gap-3 pb-4 last:pb-0 last:border-0 border-b border-gray-100 dark:border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                    {cf.name?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{cf.name}</div>
                    <div className="text-sm text-gray-500 mb-1">{cf.title}</div>
                    {cf.bio && <p className="text-sm text-gray-600 dark:text-gray-400 mb-1.5">{cf.bio}</p>}
                    {cf.yearsAtCompany && (
                      <p className="text-xs text-gray-400 mb-1.5">Years at company: {cf.yearsAtCompany}</p>
                    )}
                    <LinkIcon url={cf.linkedInUrl} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {hasOwner && (
        <Card>
          <CardHeader gradient>
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-600" />
              <h3 className="font-semibold text-gray-900 text-sm">Owner</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-sm">
                {details.ownerName!.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{details.ownerName}</h3>
                  <Badge variant="secondary">Owner</Badge>
                </div>
                {details.ownerBackground && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">{details.ownerBackground}</p>
                )}
                <LinkIcon url={details.ownerLinkedInUrl} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {hasCeo && (
        <Card>
          <CardHeader gradient>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900 text-sm">CEO</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-sm">
                {details.ceoName!.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{details.ceoName}</h3>
                  {wikiVerified?.ceoName && <Badge variant="success">Wiki Verified</Badge>}
                  <Badge variant="accent">CEO</Badge>
                </div>
                <LinkIcon url={details.ceoLinkedInUrl} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(details.leadershipTeam && details.leadershipTeam.length > 0) && (
        <Card>
          <CardHeader gradient>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900 text-sm">Leadership Snapshot</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{details.leadershipTeam.length}</div>
                <div className="text-xs text-gray-500 mt-1">Total Members</div>
              </div>
              <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">{founders.length}</div>
                <div className="text-xs text-gray-500 mt-1">Founders</div>
              </div>
              <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{coFounders.length}</div>
                <div className="text-xs text-gray-500 mt-1">Co-Founders</div>
              </div>
              <div className="text-center p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                <div className="text-2xl font-bold text-pink-700 dark:text-pink-300">{details.ceoName ? 1 : 0}</div>
                <div className="text-xs text-gray-500 mt-1">CEOs</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {founders.length === 0 && coFounders.length === 0 && (
        <Card>
          <CardContent>
            <div className="text-center py-6 text-gray-400">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">No founder, owner, or co-founder details found for this brand.</p>
              <p className="text-xs mt-1">Try re-evaluating with a different source URL or check the Company Info tab.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
