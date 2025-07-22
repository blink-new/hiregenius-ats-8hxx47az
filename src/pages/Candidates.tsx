import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Star, 
  MapPin, 
  Calendar,
  Mail,
  Phone,
  ExternalLink,
  Download,
  Zap
} from 'lucide-react'

const candidates = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Frontend Developer',
    experience: 5,
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    education: 'BS Computer Science - Stanford',
    status: 'interview',
    aiScore: 92,
    matchScore: 88,
    source: 'LinkedIn',
    appliedDate: '2024-01-20',
    avatar: null,
    resumeUrl: '#',
    linkedinUrl: '#'
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
    location: 'New York, NY',
    title: 'Product Manager',
    experience: 7,
    skills: ['Product Strategy', 'Analytics', 'Agile', 'SQL'],
    education: 'MBA - Harvard Business School',
    status: 'screening',
    aiScore: 88,
    matchScore: 91,
    source: 'Indeed',
    appliedDate: '2024-01-19',
    avatar: null,
    resumeUrl: '#',
    linkedinUrl: '#'
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1 (555) 345-6789',
    location: 'Austin, TX',
    title: 'UX Designer',
    experience: 4,
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    education: 'BFA Design - RISD',
    status: 'offer',
    aiScore: 95,
    matchScore: 94,
    source: 'Referral',
    appliedDate: '2024-01-18',
    avatar: null,
    resumeUrl: '#',
    linkedinUrl: '#'
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim@email.com',
    phone: '+1 (555) 456-7890',
    location: 'Seattle, WA',
    title: 'Backend Engineer',
    experience: 6,
    skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
    education: 'MS Computer Science - MIT',
    status: 'new',
    aiScore: 85,
    matchScore: 82,
    source: 'Company Website',
    appliedDate: '2024-01-17',
    avatar: null,
    resumeUrl: '#',
    linkedinUrl: '#'
  },
  {
    id: '5',
    firstName: 'Lisa',
    lastName: 'Wang',
    email: 'lisa.wang@email.com',
    phone: '+1 (555) 567-8901',
    location: 'Los Angeles, CA',
    title: 'Data Scientist',
    experience: 3,
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'R'],
    education: 'PhD Statistics - UC Berkeley',
    status: 'hired',
    aiScore: 90,
    matchScore: 89,
    source: 'LinkedIn',
    appliedDate: '2024-01-15',
    avatar: null,
    resumeUrl: '#',
    linkedinUrl: '#'
  },
  {
    id: '6',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@email.com',
    phone: '+1 (555) 678-9012',
    location: 'Chicago, IL',
    title: 'DevOps Engineer',
    experience: 8,
    skills: ['Kubernetes', 'Docker', 'Terraform', 'Jenkins'],
    education: 'BS Engineering - Northwestern',
    status: 'rejected',
    aiScore: 78,
    matchScore: 75,
    source: 'Indeed',
    appliedDate: '2024-01-14',
    avatar: null,
    resumeUrl: '#',
    linkedinUrl: '#'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new': return 'bg-blue-100 text-blue-800'
    case 'screening': return 'bg-yellow-100 text-yellow-800'
    case 'interview': return 'bg-green-100 text-green-800'
    case 'offer': return 'bg-purple-100 text-purple-800'
    case 'hired': return 'bg-emerald-100 text-emerald-800'
    case 'rejected': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 80) return 'text-blue-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

export function Candidates() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-600">Manage and track all your candidates in one place</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">AI Recommendation</h3>
                <p className="text-sm text-gray-600">3 high-scoring candidates match your active positions</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              View Matches
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search candidates by name, title, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="score">AI Score</SelectItem>
                <SelectItem value="match">Match Score</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={candidate.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {candidate.firstName[0]}{candidate.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {candidate.firstName} {candidate.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{candidate.title}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Send Email</DropdownMenuItem>
                    <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                    <DropdownMenuItem>Download Resume</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="mr-2 h-4 w-4" />
                  {candidate.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="mr-2 h-4 w-4" />
                  {candidate.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="mr-2 h-4 w-4" />
                  {candidate.location}
                </div>
              </div>

              {/* AI Scores */}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-gray-600">AI Score</div>
                  <div className={`text-xl font-bold ${getScoreColor(candidate.aiScore)}`}>
                    {candidate.aiScore}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Match</div>
                  <div className={`text-xl font-bold ${getScoreColor(candidate.matchScore || 0)}`}>
                    {candidate.matchScore}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Experience</div>
                  <div className="text-xl font-bold text-gray-900">
                    {candidate.experience}y
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">Skills</div>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{candidate.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between pt-2">
                <Badge className={getStatusColor(candidate.status)}>
                  {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                </Badge>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Applied Date */}
              <div className="flex items-center text-xs text-gray-500 pt-2 border-t">
                <Calendar className="mr-1 h-3 w-3" />
                Applied {new Date(candidate.appliedDate).toLocaleDateString()}
                <span className="mx-2">•</span>
                Source: {candidate.source}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {filteredCandidates.length > 0 && (
        <div className="text-center">
          <Button variant="outline">
            Load More Candidates
          </Button>
        </div>
      )}
    </div>
  )
}