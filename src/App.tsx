import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Dashboard } from './pages/Dashboard'
import { Candidates } from './pages/Candidates'
import { Jobs } from './pages/Jobs'
import { Clients } from './pages/Clients'
import { blink } from '@/blink/client'
import { Toaster } from '@/components/ui/toaster'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">HG</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">HireGenius</h1>
          <p className="text-gray-600">Loading your AI-powered ATS...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-xl">HG</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">HireGenius</h1>
          <p className="text-lg text-gray-600 mb-8">AI-Powered Applicant Tracking System</p>
          <div className="space-y-4 text-left bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-semibold text-gray-900">Features:</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• AI-powered candidate scoring & matching</li>
              <li>• Automated resume parsing</li>
              <li>• Drag-and-drop pipeline management</li>
              <li>• Advanced analytics & reporting</li>
              <li>• Integrated job board</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'candidates':
        return <Candidates />
      case 'jobs':
        return <Jobs />
      case 'clients':
        return <Clients />
      case 'campaigns':
        return <div className="p-6"><h1 className="text-2xl font-bold">Campaigns - Coming Soon</h1></div>
      case 'analytics':
        return <div className="p-6"><h1 className="text-2xl font-bold">Analytics - Coming Soon</h1></div>
      case 'job-board':
        return <div className="p-6"><h1 className="text-2xl font-bold">Job Board - Coming Soon</h1></div>
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
      <Toaster />
    </div>
  )
}

export default App