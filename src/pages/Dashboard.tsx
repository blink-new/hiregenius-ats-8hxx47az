import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  Briefcase, 
  Building2, 
  TrendingUp, 
  Calendar, 
  Clock,
  Target,
  Zap,
  ArrowUpRight,
  Plus
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const monthlyData = [
  { month: 'Jan', hires: 12, applications: 145 },
  { month: 'Feb', hires: 19, applications: 178 },
  { month: 'Mar', hires: 15, applications: 203 },
  { month: 'Apr', hires: 22, applications: 189 },
  { month: 'May', hires: 28, applications: 234 },
  { month: 'Jun', hires: 31, applications: 267 }
]

const pipelineData = [
  { name: 'New', value: 45, color: '#3B82F6' },
  { name: 'Screening', value: 32, color: '#F59E0B' },
  { name: 'Interview', value: 18, color: '#10B981' },
  { name: 'Offer', value: 8, color: '#8B5CF6' },
  { name: 'Hired', value: 12, color: '#06B6D4' }
]

const recentCandidates = [
  {
    id: '1',
    name: 'Sarah Johnson',
    position: 'Senior Frontend Developer',
    score: 92,
    status: 'interview',
    appliedDate: '2 hours ago'
  },
  {
    id: '2',
    name: 'Michael Chen',
    position: 'Product Manager',
    score: 88,
    status: 'screening',
    appliedDate: '5 hours ago'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    position: 'UX Designer',
    score: 95,
    status: 'offer',
    appliedDate: '1 day ago'
  },
  {
    id: '4',
    name: 'David Kim',
    position: 'Backend Engineer',
    score: 85,
    status: 'new',
    appliedDate: '2 days ago'
  }
]

const upcomingInterviews = [
  {
    id: '1',
    candidate: 'Sarah Johnson',
    position: 'Senior Frontend Developer',
    time: '10:00 AM',
    type: 'Technical Interview'
  },
  {
    id: '2',
    candidate: 'Alex Thompson',
    position: 'Data Scientist',
    time: '2:30 PM',
    type: 'Final Interview'
  },
  {
    id: '3',
    candidate: 'Maria Garcia',
    position: 'Product Designer',
    time: '4:00 PM',
    type: 'Portfolio Review'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new': return 'bg-blue-100 text-blue-800'
    case 'screening': return 'bg-yellow-100 text-yellow-800'
    case 'interview': return 'bg-green-100 text-green-800'
    case 'offer': return 'bg-purple-100 text-purple-800'
    case 'hired': return 'bg-emerald-100 text-emerald-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export function Dashboard() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base">Welcome back! Here's what's happening with your recruitment.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Interview
          </Button>
          <Button size="sm" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* AI Insights Banner */}
      <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-white/20 rounded-lg flex-shrink-0">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold">AI Insights</h3>
                <p className="text-blue-100 text-sm sm:text-base">Your hiring efficiency increased by 23% this month</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="w-full sm:w-auto">
              View Details
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">3</span> new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Clients</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> new clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Monthly Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Monthly Performance</CardTitle>
            <CardDescription className="text-sm">Hires and applications over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="hires" fill="#3B82F6" name="Hires" />
                <Bar dataKey="applications" fill="#10B981" name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pipeline Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Candidate Pipeline</CardTitle>
            <CardDescription className="text-sm">Current distribution of candidates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {pipelineData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs sm:text-sm text-gray-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Candidates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Recent Candidates</CardTitle>
            <CardDescription className="text-sm">Latest candidate applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {recentCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{candidate.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{candidate.position}</p>
                    <p className="text-xs text-gray-500">{candidate.appliedDate}</p>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-medium text-gray-900">AI Score</div>
                      <div className="text-sm sm:text-lg font-bold text-blue-600">{candidate.score}</div>
                    </div>
                    <Badge className={`${getStatusColor(candidate.status)} text-xs`}>
                      {candidate.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Interviews */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Today's Interviews</CardTitle>
            <CardDescription className="text-sm">Scheduled interviews for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {upcomingInterviews.map((interview) => (
                <div key={interview.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{interview.candidate}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{interview.position}</p>
                      <p className="text-xs text-gray-500">{interview.type}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">{interview.time}</div>
                    <Button size="sm" variant="outline" className="mt-1 text-xs">
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}