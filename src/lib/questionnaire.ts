export interface Question {
  id: string
  question: string
  placeholder: string
  required: boolean
  category: string
}

export const defaultQuestions: Question[] = [
  {
    id: "mission",
    question: "What is your company's mission and vision?",
    placeholder: "Describe your mission and long-term vision...",
    required: false,
    category: "Brand Identity",
  },
  {
    id: "audience",
    question: "Who is your primary target audience?",
    placeholder: "Describe your ideal customers...",
    required: false,
    category: "Brand Identity",
  },
  {
    id: "usp",
    question: "What makes your product or service unique from competitors?",
    placeholder: "Describe your unique selling proposition...",
    required: false,
    category: "Competitive Position",
  },
  {
    id: "personality",
    question: "How would you describe your brand's personality?",
    placeholder: "e.g. professional, innovative, friendly, luxury...",
    required: false,
    category: "Brand Identity",
  },
  {
    id: "values",
    question: "What are your brand's core values?",
    placeholder: "List the values that guide your company...",
    required: false,
    category: "Brand Identity",
  },
  {
    id: "marketing",
    question: "Which marketing channels do you currently use?",
    placeholder: "e.g. social media, email, SEO, paid ads, content marketing...",
    required: false,
    category: "Marketing Maturity",
  },
  {
    id: "differentiation",
    question: "How do you position yourself against competitors?",
    placeholder: "What makes customers choose you over alternatives?",
    required: false,
    category: "Competitive Position",
  },
  {
    id: "feedback",
    question: "How do you collect and act on customer feedback?",
    placeholder: "Describe your feedback process...",
    required: false,
    category: "Customer Experience",
  },
  {
    id: "challenges",
    question: "What is your biggest branding or growth challenge right now?",
    placeholder: "Describe your top challenge...",
    required: false,
    category: "Growth Potential",
  },
  {
    id: "goals",
    question: "What are your primary business goals for the next 12 months?",
    placeholder: "Describe your key objectives...",
    required: false,
    category: "Growth Potential",
  },
  {
    id: "consistency",
    question: "How consistent is your branding across different platforms (website, social media, email, etc.)?",
    placeholder: "Describe your brand consistency approach...",
    required: false,
    category: "Brand Consistency",
  },
  {
    id: "innovation",
    question: "What recent innovations or improvements has your company made?",
    placeholder: "Describe recent product, service, or process innovations...",
    required: false,
    category: "Innovation",
  },
]
