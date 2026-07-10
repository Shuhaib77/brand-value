"use client"

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
      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 underline text-sm truncate max-w-full"
    >
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
      <span className="truncate">{url.replace(/^https?:\/\//, "")}</span>
    </a>
  )
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "accent" | "secondary" }) {
  const styles = {
    default: "bg-purple-100 text-purple-700",
    success: "bg-green-100 text-green-700",
    accent: "bg-cyan-100 text-cyan-700",
    secondary: "bg-amber-100 text-amber-700",
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  )
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {title && (
        <div className="px-5 py-3 bg-gradient-to-r from-purple-50 to-cyan-50 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  )
}

export default function FounderOwners({ details, wikiVerified }: FounderOwnersProps) {
  if (!details) return null

  const coFounders = (details.leadershipTeam || []).filter(
    (m) => m.title?.toLowerCase().includes("co-founder")
  )

  const hasOwner = details.ownerName && details.ownerName !== details.founderName
  const hasCeo = details.ceoName && details.ceoName !== details.founderName

  return (
    <div className="space-y-6">
      {details.founderName && (
        <Card title="Founder">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {details.founderName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <h3 className="font-semibold text-lg text-gray-900">{details.founderName}</h3>
                {wikiVerified?.founderName && <Badge variant="success">✓ Wikipedia Verified</Badge>}
                <Badge>Founder</Badge>
                {details.founderName === details.ceoName && <Badge variant="accent">CEO</Badge>}
                {details.founderName === details.ownerName && <Badge variant="secondary">Owner</Badge>}
              </div>
              {details.founderBackground && (
                <p className="text-sm text-gray-600 mb-2 leading-relaxed">{details.founderBackground}</p>
              )}
              <LinkIcon url={details.founderLinkedInUrl} />
            </div>
          </div>
        </Card>
      )}

      {coFounders.length > 0 && (
        <Card title={`Co-Founder${coFounders.length > 1 ? "s" : ""}`}>
          <div className="space-y-4">
            {coFounders.map((cf, i) => (
              <div key={i} className="flex items-start gap-3 pb-4 last:pb-0 last:border-0 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {cf.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{cf.name}</div>
                  <div className="text-sm text-gray-500 mb-1">{cf.title}</div>
                  {cf.bio && <p className="text-sm text-gray-600 mb-1.5">{cf.bio}</p>}
                  {cf.yearsAtCompany && (
                    <p className="text-xs text-gray-400 mb-1.5">Years at company: {cf.yearsAtCompany}</p>
                  )}
                  <LinkIcon url={cf.linkedInUrl} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {hasOwner && (
        <Card title="Owner">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {details.ownerName!.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <h3 className="font-semibold text-lg text-gray-900">{details.ownerName}</h3>
                <Badge variant="secondary">Owner</Badge>
              </div>
              {details.ownerBackground && (
                <p className="text-sm text-gray-600 mb-2 leading-relaxed">{details.ownerBackground}</p>
              )}
              <LinkIcon url={details.ownerLinkedInUrl} />
            </div>
          </div>
        </Card>
      )}

      {hasCeo && (
        <Card title="CEO">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {details.ceoName!.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <h3 className="font-semibold text-lg text-gray-900">{details.ceoName}</h3>
                {wikiVerified?.ceoName && <Badge variant="success">✓ Wikipedia Verified</Badge>}
                <Badge variant="accent">CEO</Badge>
              </div>
              <LinkIcon url={details.ceoLinkedInUrl} />
            </div>
          </div>
        </Card>
      )}

      {(details.leadershipTeam && details.leadershipTeam.length > 0) && (
        <Card title="Leadership Snapshot">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{details.leadershipTeam.length}</div>
              <div className="text-xs text-gray-500 mt-1">Total Members</div>
            </div>
            <div className="text-center p-3 bg-cyan-50 rounded-lg">
              <div className="text-2xl font-bold text-cyan-700">{details.founderName ? 1 : 0}</div>
              <div className="text-xs text-gray-500 mt-1">Founders</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-700">{coFounders.length}</div>
              <div className="text-xs text-gray-500 mt-1">Co-Founders</div>
            </div>
            <div className="text-center p-3 bg-pink-50 rounded-lg">
              <div className="text-2xl font-bold text-pink-700">{details.ceoName ? 1 : 0}</div>
              <div className="text-xs text-gray-500 mt-1">CEOs</div>
            </div>
          </div>
        </Card>
      )}

      {!details.founderName && coFounders.length === 0 && (
        <Card>
          <div className="text-center py-6 text-gray-400">
            <p className="text-sm">No founder, owner, or co-founder details found for this brand.</p>
            <p className="text-xs mt-1">Try re-evaluating with a different source URL or check the Company Info tab.</p>
          </div>
        </Card>
      )}
    </div>
  )
}
