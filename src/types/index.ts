export interface User {
  id: string
  email: string
  displayName: string
  role: 'admin' | 'recruiter' | 'hr_manager'
  avatar?: string
  createdAt: string
}

export interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  title: string
  experience: number
  skills: string[]
  education: string
  resumeUrl?: string
  linkedinUrl?: string
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'
  aiScore: number
  matchScore?: number
  notes: string
  source: string
  appliedDate: string
  userId: string
  jobId?: string
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'remote'
  salaryMin: number
  salaryMax: number
  salaryCurrency: string
  salaryRange: string
  description: string
  requirements: string
  skills: string[]
  status: 'draft' | 'active' | 'paused' | 'closed'
  priority: 'low' | 'medium' | 'high'
  postedDate: string
  applications: number
  applicationsCount: number
  views: number
  clientId?: string
  userId: string
  createdAt: string
}

export interface Client {
  id: string
  name: string
  industry: string
  location: string
  contactPerson: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'prospect' | 'paused'
  priority: 'low' | 'medium' | 'high'
  activeJobs: number
  totalPlacements: number
  lastContact: string
  userId: string
  createdAt: string
}

export interface Campaign {
  id: string
  name: string
  type: 'email' | 'linkedin' | 'sms'
  status: 'draft' | 'active' | 'paused' | 'completed'
  targetAudience: string
  subject: string
  content: string
  sentCount: number
  openRate: number
  clickRate: number
  responseRate: number
  createdDate: string
  userId: string
}

export interface Analytics {
  totalCandidates: number
  activeCandidates: number
  totalJobs: number
  activeJobs: number
  totalClients: number
  avgTimeToFill: number
  conversionRate: number
  monthlyHires: number
}