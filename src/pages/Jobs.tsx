import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Filter, MoreHorizontal, Eye, Users, Calendar, MapPin, DollarSign, Building2, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { blink } from '@/blink/client'
import { Job, Client } from '@/types'
import { useToast } from '@/hooks/use-toast'

export function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time' as const,
    salaryMin: '',
    salaryMax: '',
    description: '',
    requirements: '',
    skills: '',
    clientId: ''
  })
  const { toast } = useToast()
  const sortBy = 'createdAt'

  const loadJobs = useCallback(async () => {
    try {
      const user = await blink.auth.me()
      const jobsData = await blink.db.jobs.list({
        where: { userId: user.id },
        orderBy: { [sortBy]: 'desc' },
        limit: 50
      })
      
      const formattedJobs = jobsData.map(job => ({
        ...job,
        salary: {
          min: job.salaryMin || 0,
          max: job.salaryMax || 0,
          currency: job.salaryCurrency || 'USD'
        },
        requirements: job.requirements ? JSON.parse(job.requirements) : [],
        skills: job.skills ? JSON.parse(job.skills) : [],
        postedDate: job.postedDate || job.createdAt
      }))
      
      setJobs(formattedJobs)
    } catch (error) {
      console.error('Error loading jobs:', error)
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [sortBy, toast])

  const loadClients = useCallback(async () => {
    try {
      const user = await blink.auth.me()
      const clientsData = await blink.db.clients.list({
        where: { userId: user.id }
      })
      setClients(clientsData)
    } catch (error) {
      console.error('Error loading clients:', error)
    }
  }, [])

  useEffect(() => {
    loadJobs()
    loadClients()
  }, [loadJobs, loadClients])

  const handleCreateJob = async () => {
    try {
      const user = await blink.auth.me()
      
      // Generate AI-enhanced job description if basic description provided
      let enhancedDescription = newJob.description
      if (newJob.description && newJob.title) {
        try {
          const { text } = await blink.ai.generateText({
            prompt: `Enhance this job description for a ${newJob.title} position. Make it professional, engaging, and comprehensive while keeping the original intent:

${newJob.description}

Include sections for:
- Role overview
- Key responsibilities  
- Required qualifications
- Preferred qualifications
- What we offer

Keep it concise but compelling.`,
            maxTokens: 500
          })
          enhancedDescription = text
        } catch (aiError) {
          console.log('AI enhancement failed, using original description')
        }
      }

      const jobData = {
        id: `job_${Date.now()}`,
        title: newJob.title,
        company: newJob.company,
        location: newJob.location,
        type: newJob.type,
        salaryMin: newJob.salaryMin ? parseInt(newJob.salaryMin) : null,
        salaryMax: newJob.salaryMax ? parseInt(newJob.salaryMax) : null,
        salaryCurrency: 'USD',
        description: enhancedDescription,
        requirements: newJob.requirements ? JSON.stringify(newJob.requirements.split(',').map(r => r.trim())) : '[]',
        skills: newJob.skills ? JSON.stringify(newJob.skills.split(',').map(s => s.trim())) : '[]',
        status: 'active',
        applications: 0,
        views: 0,
        clientId: newJob.clientId || null,
        userId: user.id
      }

      await blink.db.jobs.create(jobData)
      
      toast({
        title: "Success",
        description: "Job created successfully with AI-enhanced description!"
      })
      
      setShowCreateDialog(false)
      setNewJob({
        title: '',
        company: '',
        location: '',
        type: 'full-time',
        salaryMin: '',
        salaryMax: '',
        description: '',
        requirements: '',
        skills: '',
        clientId: ''
      })
      loadJobs()
    } catch (error) {
      console.error('Error creating job:', error)
      toast({
        title: "Error",
        description: "Failed to create job",
        variant: "destructive"
      })
    }
  }

  const updateJobStatus = async (jobId: string, status: string) => {
    try {
      await blink.db.jobs.update(jobId, { status })
      toast({
        title: "Success",
        description: `Job ${status === 'active' ? 'activated' : status === 'paused' ? 'paused' : 'closed'} successfully`
      })
      loadJobs()
    } catch (error) {
      console.error('Error updating job status:', error)
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive"
      })
    }
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      case 'draft': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'remote': return <MapPin className="h-4 w-4" />
      case 'contract': return <Briefcase className="h-4 w-4" />
      default: return <Building2 className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600">Manage your job postings and track performance</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={newJob.company}
                    onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                    placeholder="e.g. TechCorp Inc."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newJob.location}
                    onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Job Type</Label>
                  <Select value={newJob.type} onValueChange={(value: any) => setNewJob({...newJob, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salaryMin">Min Salary ($)</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    value={newJob.salaryMin}
                    onChange={(e) => setNewJob({...newJob, salaryMin: e.target.value})}
                    placeholder="80000"
                  />
                </div>
                <div>
                  <Label htmlFor="salaryMax">Max Salary ($)</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    value={newJob.salaryMax}
                    onChange={(e) => setNewJob({...newJob, salaryMax: e.target.value})}
                    placeholder="120000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="client">Client (Optional)</Label>
                <Select value={newJob.clientId} onValueChange={(value) => setNewJob({...newJob, clientId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  placeholder="Brief description - AI will enhance this for you..."
                  rows={4}
                />
                <p className="text-sm text-gray-500 mt-1">💡 AI will automatically enhance your description</p>
              </div>

              <div>
                <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                <Input
                  id="requirements"
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                  placeholder="Bachelor's degree, 5+ years experience, JavaScript"
                />
              </div>

              <div>
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  value={newJob.skills}
                  onChange={(e) => setNewJob({...newJob, skills: e.target.value})}
                  placeholder="React, Node.js, TypeScript, AWS"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateJob} disabled={!newJob.title || !newJob.company}>
                  Create Job
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                    {job.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Building2 className="h-4 w-4 mr-1" />
                    {job.company}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => updateJobStatus(job.id, 'active')}>
                      Activate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateJobStatus(job.id, 'paused')}>
                      Pause
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateJobStatus(job.id, 'closed')}>
                      Close
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(job.status)}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  {getTypeIcon(job.type)}
                  <span className="ml-1">{job.type}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {job.location}
                </div>
                {job.salary.min > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  {job.applications} applications
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Eye className="h-4 w-4 mr-1" />
                  {job.views} views
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Posted {new Date(job.postedDate).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Create your first job posting to get started'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Button onClick={() => setShowCreateDialog(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Job
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default Jobs