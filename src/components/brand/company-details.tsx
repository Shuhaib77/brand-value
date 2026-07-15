import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, DollarSign, Building2, Trophy, Award, Shield, Target, ExternalLink, Star, Briefcase } from "lucide-react"

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
  ceoName: string | null
  ownerName?: string | null
  ownerBackground?: string | null
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

interface Props {
  details: CompanyDetails
  wikiVerified?: {
    founderName: boolean
    foundedYear: boolean
    employeeCount: boolean
    headquarters: boolean
    industry: boolean
    ceoName: boolean
  }
}

function Field({ label, children, verified }: { label: string; children: React.ReactNode; verified?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <span className="text-sm font-medium text-gray-400 w-28 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
        {children}
        {verified && <Badge variant="success" size="sm">Wiki</Badge>}
      </span>
    </div>
  )
}

function ChipList({ items, label }: { items: string[] | undefined; label: string }) {
  if (!items || items.length === 0) return null
  return (
    <div className="mb-3">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map((item, i) => (
          <Badge key={i} variant="default" size="md">{item}</Badge>
        ))}
      </div>
    </div>
  )
}

export default function CompanyDetailsCard({ details, wikiVerified }: Props) {
  const hasLeadership = details.leadershipTeam && details.leadershipTeam.length > 0
  const hasInvestors = details.investors && details.investors.length > 0
  const hasAwards = details.awards && details.awards.length > 0
  const hasCerts = details.certifications && details.certifications.length > 0
  const hasPartnerships = details.partnerships && details.partnerships.length > 0
  const hasAnyInfo =
    details.founderName || details.ownerName || details.ceoName ||
    hasLeadership || details.employeeCount || details.foundedYear ||
    details.fundingStage || details.estimatedRevenue || hasInvestors ||
    hasAwards || hasCerts || hasPartnerships || details.companyCulture

  if (!hasAnyInfo) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 text-sm">Insufficient data to extract company details.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Leadership */}
      <Card>
        <CardHeader gradient>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            <h3 className="font-semibold text-gray-900 text-sm">Leadership</h3>
          </div>
        </CardHeader>
        <CardContent>
          {details.founderName && (
            <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">{details.founderName}</span>
                {wikiVerified?.founderName && <Badge variant="success" size="sm">Wiki</Badge>}
                {details.ceoName === details.founderName && <Badge variant="accent" size="sm">Founder & CEO</Badge>}
              </div>
              {details.founderBackground && (
                <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">{details.founderBackground}</p>
              )}
            </div>
          )}

          {details.ownerName && details.ownerName !== details.founderName && (
            <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/30">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">{details.ownerName}</span>
                <Badge variant="secondary" size="sm">Owner</Badge>
              </div>
              {details.ownerBackground && (
                <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">{details.ownerBackground}</p>
              )}
            </div>
          )}

          <Field label="CEO" verified={wikiVerified?.ceoName}>
            {details.ceoName !== details.founderName ? details.ceoName : null}
          </Field>

          {hasLeadership && (
            <div className="mt-3">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Leadership Team</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {details.leadershipTeam.map((member, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.title}</p>
                      {member.bio && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{member.bio}</p>}
                      {member.linkedInUrl && (
                        <a href={member.linkedInUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline mt-1">
                          <ExternalLink className="w-3 h-3" /> LinkedIn
                        </a>
                      )}
                      {member.yearsAtCompany && (
                        <p className="text-[10px] text-gray-400 mt-0.5">{member.yearsAtCompany} at company</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workforce & Timeline */}
      <Card>
        <CardHeader gradient>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            <h3 className="font-semibold text-gray-900 text-sm">Workforce & Timeline</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {details.foundedYear && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center relative">
                <div className="text-2xl font-bold text-blue-600">{details.foundedYear}</div>
                <div className="text-xs text-blue-500 mt-1">Founded</div>
                {wikiVerified?.foundedYear && (
                  <div className="absolute top-1 right-1"><Badge variant="success" size="sm">Wiki</Badge></div>
                )}
              </div>
            )}
            {details.employeeCount && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-center relative">
                <div className="text-2xl font-bold text-emerald-600">{details.employeeCount}</div>
                <div className="text-xs text-emerald-500 mt-1">Employees</div>
                {wikiVerified?.employeeCount && (
                  <div className="absolute top-1 right-1"><Badge variant="success" size="sm">Wiki</Badge></div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      {(hasAwards || hasCerts || hasPartnerships) && (
        <Card>
          <CardHeader gradient>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900 text-sm">Achievements & Recognition</h3>
            </div>
          </CardHeader>
          <CardContent>
            <ChipList items={details.awards} label="Awards" />
            <ChipList items={details.certifications} label="Certifications" />
            <ChipList items={details.partnerships} label="Partnerships" />
          </CardContent>
        </Card>
      )}

      {/* Company Culture */}
      {details.companyCulture && (
        <Card>
          <CardHeader gradient>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900 text-sm">Company Culture</h3>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{details.companyCulture}</p>
          </CardContent>
        </Card>
      )}

      {/* Funding & Financials */}
      <Card>
        <CardHeader gradient>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-purple-600" />
            <h3 className="font-semibold text-gray-900 text-sm">Funding & Financials</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {details.fundingStage && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <Briefcase className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{details.fundingStage}</p>
                  <p className="text-xs text-gray-400">Funding Stage</p>
                </div>
              </div>
            )}
            <Field label="Est. Revenue">{details.estimatedRevenue}</Field>
            {hasInvestors && (
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Investors</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {details.investors.map((investor, i) => (
                    <Badge key={i} variant="slate" size="md">{investor}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-[10px] text-gray-400 text-center">
        Data sourced from website scraping + Wikipedia API + web search
      </div>
    </div>
  )
}
