import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="font-semibold text-sm text-gray-900">BrandScore</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              AI-powered brand value evaluation. Score your brand across 9 weighted categories with evidence-based analysis.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-xs text-gray-500 hover:text-purple-600 transition-colors">Home</Link></li>
              <li><Link href="/questionnaire" className="text-xs text-gray-500 hover:text-purple-600 transition-colors">Questionnaire</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><span className="text-xs text-gray-400">Privacy Policy</span></li>
              <li><span className="text-xs text-gray-400">Terms of Service</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} BrandScore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
