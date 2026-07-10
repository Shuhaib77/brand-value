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

function WikiBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded-full ml-1.5">
      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
      Verified
    </span>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3 bg-gradient-to-r from-purple-50 to-cyan-50 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Field({ label, value, verified }: { label: string; value: string | null | undefined; verified?: boolean }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2">
      <span className="text-sm font-medium text-gray-400 w-32 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-800 flex items-center gap-1">
        {value}
        {verified && <WikiBadge />}
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
          <span key={i} className="px-3 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-full border border-purple-100">
            {item}
          </span>
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
    details.founderName ||
    details.ownerName ||
    details.ceoName ||
    hasLeadership ||
    details.employeeCount ||
    details.foundedYear ||
    details.fundingStage ||
    details.estimatedRevenue ||
    hasInvestors ||
    hasAwards ||
    hasCerts ||
    hasPartnerships ||
    details.companyCulture

  if (!hasAnyInfo) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="text-4xl mb-3">🏢</div>
        <p className="text-gray-500 text-sm">
          Insufficient data to extract company details. Try a company with a more established online presence.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Section title="Leadership">
        {details.founderName && (
          <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">👤</span>
              <span className="font-semibold text-gray-900">{details.founderName}</span>
              {wikiVerified?.founderName && <WikiBadge />}
              {details.ceoName === details.founderName && (
                <span className="px-2 py-0.5 text-xs font-medium bg-purple-200 text-purple-700 rounded-full ml-1">
                  Founder & CEO
                </span>
              )}
            </div>
            {details.founderBackground && (
              <p className="text-sm text-gray-600 ml-8">{details.founderBackground}</p>
            )}
          </div>
        )}

        {details.ownerName && details.ownerName !== details.founderName && (
          <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">👤</span>
              <span className="font-semibold text-gray-900">{details.ownerName}</span>
              <span className="px-2 py-0.5 text-xs font-medium bg-purple-200 text-purple-700 rounded-full ml-1">Owner</span>
            </div>
            {details.ownerBackground && (
              <p className="text-sm text-gray-600 ml-8">{details.ownerBackground}</p>
            )}
          </div>
        )}

        <Field label="CEO" value={details.ceoName !== details.founderName ? details.ceoName : null} verified={wikiVerified?.ceoName} />

        {hasLeadership && (
          <div className="space-y-2 mt-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Leadership Team</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {details.leadershipTeam.map((member, i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-400">{member.title}</p>
                    {member.bio && (
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{member.bio}</p>
                    )}
                    {member.linkedInUrl && (
                      <a href={member.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline mt-1 inline-block">
                        LinkedIn ↗
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
      </Section>

      <Section title="Workforce & Timeline">
        <div className="grid grid-cols-2 gap-4">
          {details.foundedYear && (
            <div className="p-3 bg-blue-50 rounded-lg text-center relative">
              <div className="text-2xl font-bold text-blue-600">{details.foundedYear}</div>
              <div className="text-xs text-blue-500 mt-1">Founded</div>
              {wikiVerified?.foundedYear && (
                <div className="absolute top-1 right-1"><WikiBadge /></div>
              )}
            </div>
          )}
          {details.employeeCount && (
            <div className="p-3 bg-green-50 rounded-lg text-center relative">
              <div className="text-2xl font-bold text-green-600">{details.employeeCount}</div>
              <div className="text-xs text-green-500 mt-1">Employees</div>
              {wikiVerified?.employeeCount && (
                <div className="absolute top-1 right-1"><WikiBadge /></div>
              )}
            </div>
          )}
        </div>
      </Section>

      {(hasAwards || hasCerts || hasPartnerships) && (
        <Section title="Achievements & Recognition">
          <ChipList items={details.awards} label="Awards" />
          <ChipList items={details.certifications} label="Certifications" />
          <ChipList items={details.partnerships} label="Partnerships" />
        </Section>
      )}

      {details.companyCulture && (
        <Section title="Company Culture">
          <p className="text-sm text-gray-700 leading-relaxed">{details.companyCulture}</p>
        </Section>
      )}

      <Section title="Funding & Financials">
        <div className="space-y-2">
          {details.fundingStage && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
              <span className="text-xl">💰</span>
              <div>
                <p className="text-sm font-medium text-gray-900">{details.fundingStage}</p>
                <p className="text-xs text-gray-400">Funding Stage</p>
              </div>
            </div>
          )}
          <Field label="Est. Revenue" value={details.estimatedRevenue} />
          {hasInvestors && (
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Investors</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {details.investors.map((investor, i) => (
                  <span key={i} className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    {investor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      <div className="text-[10px] text-gray-400 text-center">
        Data sourced from website scraping + Wikipedia API + web search
      </div>
    </div>
  )
}
