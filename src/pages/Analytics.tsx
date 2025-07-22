import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Users, Briefcase, Clock, Target, Calendar, Download, Filter } from 'lucide-react'

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('overview')

  // Mock data for analytics
  const metrics = {
    totalCandidates: { value: 1247, change: 12.5, trend: 'up' },
    activeJobs: { value: 34, change: -2.3, trend: 'down' },
    avgTimeToFill: { value: 18, change: -15.2, trend: 'up' },
    successRate: { value: 73.2, change: 8.1, trend: 'up' },
    clientSatisfaction: { value: 4.8, change: 0.3, trend: 'up' },
    revenue: { value: 245000, change: 22.4, trend: 'up' }
  }

  const chartData = {
    candidates: [
      { month: 'Jan', value: 120 },
      { month: 'Feb', value: 135 },
      { month: 'Mar', value: 148 },
      { month: 'Apr', value: 162 },
      { month: 'May', value: 178 },
      { month: 'Jun', value: 195 }
    ],
    placements: [
      { month: 'Jan', value: 28 },
      { month: 'Feb', value: 32 },
      { month: 'Mar', value: 35 },
      { month: 'Apr', value: 41 },
      { month: 'May', value: 38 },
      { month: 'Jun', value: 45 }
    ]
  }

  const topPerformers = [
    { name: 'Sarah Johnson', placements: 12, revenue: 48000, efficiency: 95 },
    { name: 'Mike Chen', placements: 10, revenue: 42000, efficiency: 92 },
    { name: 'Emily Davis', placements: 9, revenue: 38000, efficiency: 88 },
    { name: 'David Wilson', placements: 8, revenue: 35000, efficiency: 85 }
  ]

  const MetricCard = ({ title, value, change, trend, icon: Icon, format = 'number' }: any) => {
    const formatValue = (val: number) => {
      if (format === 'currency') return `$${val.toLocaleString()}`
      if (format === 'percentage') return `${val}%`
      if (format === 'days') return `${val} days`
      if (format === 'rating') return `${val}/5`
      return val.toLocaleString()
    }

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(change)}%
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{formatValue(value)}</p>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
    )
  }

  const SimpleChart = ({ data, title, color = 'blue' }: any) => {
    const maxValue = Math.max(...data.map((d: any) => d.value))
    
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-8">{item.month}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-${color}-500`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 w-8">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your recruitment performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* AI Insights Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold">AI Performance Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="opacity-90 mb-1">🎯 Top Recommendation</p>
            <p className="font-medium">Focus on Software Engineer roles - 40% higher success rate</p>
          </div>
          <div>
            <p className="opacity-90 mb-1">📈 Growth Opportunity</p>
            <p className="font-medium">Remote positions show 25% faster placement times</p>
          </div>
          <div>
            <p className="opacity-90 mb-1">⚡ Efficiency Tip</p>
            <p className="font-medium">Tuesday applications have 30% higher response rates</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Candidates"
          value={metrics.totalCandidates.value}
          change={metrics.totalCandidates.change}
          trend={metrics.totalCandidates.trend}
          icon={Users}
        />
        <MetricCard
          title="Active Jobs"
          value={metrics.activeJobs.value}
          change={metrics.activeJobs.change}
          trend={metrics.activeJobs.trend}
          icon={Briefcase}
        />
        <MetricCard
          title="Avg. Time to Fill"
          value={metrics.avgTimeToFill.value}
          change={metrics.avgTimeToFill.change}
          trend={metrics.avgTimeToFill.trend}
          icon={Clock}
          format="days"
        />
        <MetricCard
          title="Success Rate"
          value={metrics.successRate.value}
          change={metrics.successRate.change}
          trend={metrics.successRate.trend}
          icon={Target}
          format="percentage"
        />
        <MetricCard
          title="Client Satisfaction"
          value={metrics.clientSatisfaction.value}
          change={metrics.clientSatisfaction.change}
          trend={metrics.clientSatisfaction.trend}
          icon={Users}
          format="rating"
        />
        <MetricCard
          title="Revenue (YTD)"
          value={metrics.revenue.value}
          change={metrics.revenue.change}
          trend={metrics.revenue.trend}
          icon={TrendingUp}
          format="currency"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart
          data={chartData.candidates}
          title="Monthly Candidate Growth"
          color="blue"
        />
        <SimpleChart
          data={chartData.placements}
          title="Monthly Placements"
          color="green"
        />
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {performer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{performer.name}</p>
                    <p className="text-sm text-gray-600">{performer.placements} placements</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${performer.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{performer.efficiency}% efficiency</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New placement confirmed</p>
                <p className="text-xs text-gray-600">Senior Developer at TechCorp - $95k</p>
              </div>
              <span className="text-xs text-gray-500">2h ago</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Interview scheduled</p>
                <p className="text-xs text-gray-600">Product Manager role - 3 candidates</p>
              </div>
              <span className="text-xs text-gray-500">4h ago</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New job posted</p>
                <p className="text-xs text-gray-600">Full-stack Engineer at StartupXYZ</p>
              </div>
              <span className="text-xs text-gray-500">6h ago</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Campaign launched</p>
                <p className="text-xs text-gray-600">AI-generated outreach to 150 candidates</p>
              </div>
              <span className="text-xs text-gray-500">1d ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Predictive Analytics */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Predictive Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600 mb-1">85%</p>
            <p className="text-sm text-gray-600">Predicted success rate for Q4</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600 mb-1">14</p>
            <p className="text-sm text-gray-600">Days avg. time to fill (projected)</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600 mb-1">$320k</p>
            <p className="text-sm text-gray-600">Projected revenue (next quarter)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics