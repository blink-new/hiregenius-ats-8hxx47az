import React, { useState, useEffect, useCallback } from 'react'
import { blink } from '../blink/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Progress } from '../components/ui/progress'
import { Separator } from '../components/ui/separator'
import { 
  Plus, 
  Send, 
  Users, 
  Mail, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Reply,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Copy,
  Trash2,
  Bot,
  Sparkles,
  Target,
  Calendar,
  BarChart3
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu'
import type { Campaign, Candidate } from '../types'

export function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [aiGenerating, setAiGenerating] = useState(false)

  // Form state for creating campaigns
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'outreach',
    targetAudience: 'all',
    scheduledDate: '',
    aiPersonalization: true
  })

  const loadCampaigns = useCallback(async () => {
    try {
      const campaignsData = await blink.db.campaigns.list({
        orderBy: { createdDate: 'desc' }
      })
      // Map database fields to component interface
      const mappedCampaigns = campaignsData.map(campaign => ({
        ...campaign,
        createdAt: campaign.createdDate || campaign.createdAt,
        replyRate: campaign.replyRate || campaign.responseRate || 0,
        aiPersonalization: Number(campaign.aiPersonalization) > 0
      }))
      setCampaigns(mappedCampaigns)
    } catch (error) {
      console.error('Error loading campaigns:', error)
    }
  }, [])

  const loadCandidates = useCallback(async () => {
    try {
      const candidatesData = await blink.db.candidates.list({
        where: { status: 'active' },
        limit: 100
      })
      setCandidates(candidatesData)
    } catch (error) {
      console.error('Error loading candidates:', error)
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([loadCampaigns(), loadCandidates()])
      setLoading(false)
    }
    loadData()
  }, [loadCampaigns, loadCandidates])

  const generateAIContent = async () => {
    if (!formData.subject || !formData.type) return

    setAiGenerating(true)
    try {
      const prompt = `Generate a professional email template for a recruitment ${formData.type} campaign with the subject "${formData.subject}". The email should be personalized, engaging, and appropriate for reaching out to potential candidates. Include placeholders for personalization like {{candidate_name}}, {{position}}, and {{company}}.`
      
      const { text } = await blink.ai.generateText({
        prompt,
        maxTokens: 500
      })
      
      setFormData(prev => ({ ...prev, content: text }))
    } catch (error) {
      console.error('Error generating AI content:', error)
    } finally {
      setAiGenerating(false)
    }
  }

  const handleCreateCampaign = async () => {
    try {
      const user = await blink.auth.me()
      const newCampaign = await blink.db.campaigns.create({
        id: `campaign_${Date.now()}`,
        name: formData.name,
        subject: formData.subject,
        content: formData.content,
        type: formData.type,
        status: formData.scheduledDate ? 'scheduled' : 'draft',
        targetAudience: formData.targetAudience,
        scheduledDate: formData.scheduledDate || null,
        aiPersonalization: formData.aiPersonalization ? 1 : 0,
        userId: user.id,
        createdDate: new Date().toISOString(),
        sentCount: 0,
        openRate: 0,
        clickRate: 0,
        replyRate: 0
      })

      // Map the created campaign to match component interface
      const mappedCampaign = {
        ...newCampaign,
        createdAt: newCampaign.createdDate,
        aiPersonalization: Number(newCampaign.aiPersonalization) > 0
      }

      setCampaigns(prev => [mappedCampaign, ...prev])
      setIsCreateDialogOpen(false)
      setFormData({
        name: '',
        subject: '',
        content: '',
        type: 'outreach',
        targetAudience: 'all',
        scheduledDate: '',
        aiPersonalization: true
      })
    } catch (error) {
      console.error('Error creating campaign:', error)
    }
  }

  const handleStatusChange = async (campaignId: string, newStatus: string) => {
    try {
      await blink.db.campaigns.update(campaignId, { status: newStatus })
      setCampaigns(prev => 
        prev.map(campaign => 
          campaign.id === campaignId 
            ? { ...campaign, status: newStatus }
            : campaign
        )
      )
    } catch (error) {
      console.error('Error updating campaign status:', error)
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'outreach': return <Target className="h-4 w-4" />
      case 'follow-up': return <Reply className="h-4 w-4" />
      case 'nurture': return <Users className="h-4 w-4" />
      default: return <Mail className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Email Campaigns</h1>
          <p className="text-gray-600 mt-1">AI-powered candidate outreach and engagement</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Email Campaign</DialogTitle>
              <DialogDescription>
                Create an AI-powered email campaign to engage with candidates
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="targeting">Targeting</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Campaign Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Senior Developer Outreach"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Campaign Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="outreach">Initial Outreach</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="nurture">Nurture Campaign</SelectItem>
                        <SelectItem value="interview">Interview Invitation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="e.g., Exciting Senior Developer Opportunity at TechCorp"
                  />
                </div>
                <div>
                  <Label htmlFor="scheduledDate">Schedule Date (Optional)</Label>
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Email Content</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateAIContent}
                    disabled={aiGenerating || !formData.subject}
                  >
                    {aiGenerating ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your email content here... Use {{candidate_name}}, {{position}}, {{company}} for personalization"
                  rows={12}
                />
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">Available personalization variables:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{'{{candidate_name}}'}</Badge>
                    <Badge variant="outline">{'{{position}}'}</Badge>
                    <Badge variant="outline">{'{{company}}'}</Badge>
                    <Badge variant="outline">{'{{skills}}'}</Badge>
                    <Badge variant="outline">{'{{experience}}'}</Badge>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="targeting" className="space-y-4">
                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Select value={formData.targetAudience} onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Active Candidates</SelectItem>
                      <SelectItem value="new">New Candidates</SelectItem>
                      <SelectItem value="qualified">Qualified Candidates</SelectItem>
                      <SelectItem value="interviewed">Previously Interviewed</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="aiPersonalization"
                    checked={formData.aiPersonalization}
                    onChange={(e) => setFormData(prev => ({ ...prev, aiPersonalization: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="aiPersonalization" className="text-sm">
                    Enable AI personalization for each recipient
                  </Label>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Bot className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-900">AI Personalization</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    When enabled, AI will customize each email based on the candidate's profile, 
                    skills, and experience to increase engagement rates.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCampaign}
                disabled={!formData.name || !formData.subject || !formData.content}
              >
                Create Campaign
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Send className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Open Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.length > 0 
                    ? Math.round(campaigns.reduce((acc, c) => acc + c.openRate, 0) / campaigns.length)
                    : 0}%
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Reply Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.length > 0 
                    ? Math.round(campaigns.reduce((acc, c) => acc + c.replyRate, 0) / campaigns.length)
                    : 0}%
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Reply className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search campaigns..."
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
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first email campaign to start engaging with candidates'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(campaign.type)}
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {campaign.name}
                        </h3>
                      </div>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      {campaign.aiPersonalization && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          <Bot className="h-3 w-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{campaign.subject}</p>
                    
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Sent</p>
                        <p className="text-sm font-medium">{campaign.sentCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Open Rate</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{campaign.openRate}%</p>
                          <Progress value={campaign.openRate} className="h-1 flex-1" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Click Rate</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{campaign.clickRate}%</p>
                          <Progress value={campaign.clickRate} className="h-1 flex-1" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Reply Rate</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{campaign.replyRate}%</p>
                          <Progress value={campaign.replyRate} className="h-1 flex-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {campaign.status === 'draft' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusChange(campaign.id, 'active')}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Launch
                      </Button>
                    )}
                    {campaign.status === 'active' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusChange(campaign.id, 'paused')}
                      >
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                    )}
                    {campaign.status === 'paused' && (
                      <Button 
                        size="sm"
                        onClick={() => handleStatusChange(campaign.id, 'active')}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Resume
                      </Button>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </DropdownMenuItem>
                        <Separator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}