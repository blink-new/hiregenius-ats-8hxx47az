import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Building2, 
  BarChart3, 
  Mail, 
  Globe,
  Zap,
  ChevronRight,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
    badge: null
  },
  {
    id: 'candidates',
    name: 'Candidates',
    icon: Users,
    badge: '247'
  },
  {
    id: 'jobs',
    name: 'Jobs',
    icon: Briefcase,
    badge: '12'
  },
  {
    id: 'clients',
    name: 'Clients',
    icon: Building2,
    badge: null
  },
  {
    id: 'campaigns',
    name: 'Campaigns',
    icon: Mail,
    badge: '3'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: BarChart3,
    badge: null
  },
  {
    id: 'job-board',
    name: 'Job Board',
    icon: Globe,
    badge: null
  }
]

export function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end p-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 lg:p-6 pt-2 lg:pt-6">
          {/* AI Assistant */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">AI Assistant</span>
            </div>
            <p className="text-xs text-blue-700 mb-3">
              Get AI-powered insights and recommendations
            </p>
            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
              Ask AI
            </Button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-10 px-3",
                    isActive && "bg-blue-50 text-blue-700 border-blue-200"
                  )}
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <ChevronRight className="ml-2 h-4 w-4 flex-shrink-0" />
                  )}
                </Button>
              )
            })}
          </nav>

          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Jobs</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">New Candidates</span>
                <span className="font-medium text-green-600">+23</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Interviews Today</span>
                <span className="font-medium text-blue-600">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  )
}