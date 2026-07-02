export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Template {
  id: string
  name: string
  senderEmail: string
  subject: string
  body: string
  createdAt: string
  updatedAt: string
  disabled: boolean
}

export interface Application {
  id: string
  company: string
  email: string
  position: string
  location: string
  website?: string
  source: JobSource
  templateId: string
  templateName: string
  appliedDate: string
  status: ApplicationStatus
}

export type JobSource = 'LinkedIn' | 'Naukri' | 'Indeed' | 'Cutshort' | 'Company Website' | 'Internshala' | 'Other'
export type ApplicationStatus = 'Applied' | 'Viewed' | 'Interview' | 'Offer' | 'Rejected' | 'Pending'

export interface AnalyticsData {
  totalApplications: number
  totalTemplates: number
  emailsSent: number
  successRate: number
  thisWeekApplies: number
  applicationsByMonth: { month: string; count: number }[]
  sourceDistribution: { source: string; count: number }[]
  emailSentTrend: { date: string; count: number }[]
  recentActivity: { action: string; detail: string; time: string }[]
  stats: {
    applications: number
    responses: number
    interviews: number
    offers: number
    pending: number
  }
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}
