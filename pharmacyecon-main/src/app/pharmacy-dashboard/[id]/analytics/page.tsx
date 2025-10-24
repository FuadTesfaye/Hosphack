'use client'

import { use, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, DollarSign, Package, Users, Calendar, Target, Zap, Eye } from 'lucide-react'
import { getMedicines } from '@/lib/api'
import type { Medicine } from '@/lib/types'

interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    growth: number
  }
  orders: {
    current: number
    previous: number
    growth: number
  }
  customers: {
    current: number
    previous: number
    growth: number
  }
  topMedicines: {
    name: string
    sales: number
    revenue: number
    growth: number
  }[]
  categoryPerformance: {
    category: string
    revenue: number
    percentage: number
    growth: number
  }[]
  monthlyTrends: {
    month: string
    revenue: number
    orders: number
  }[]
}

export default function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [goals, setGoals] = useState({ revenue: 50000, orders: 200, customers: 100 })
  const [showGoalDialog, setShowGoalDialog] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [optimizations, setOptimizations] = useState<string[]>([])

  useEffect(() => {
    // Load saved goals
    const savedGoals = localStorage.getItem(`pharmacy-goals-${id}`)
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }
    
    loadData()
    const interval = setInterval(loadData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [id, selectedPeriod])

  const loadData = async () => {
    try {
      const allMedicines = await getMedicines()
      const pharmacyMedicines = allMedicines.filter(m => m.pharmacyId === id)
      setMedicines(pharmacyMedicines)
      generateAnalytics(pharmacyMedicines)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateAnalytics = (medicines: Medicine[]) => {
    const totalValue = medicines.reduce((sum, m) => sum + (m.price * m.stock), 0)
    const currentTime = new Date()
    const randomVariation = () => Math.random() * 0.1 - 0.05 // ±5% variation
    
    const baseRevenue = Math.round(totalValue * (0.3 + randomVariation()))
    const baseOrders = Math.round(156 + (Math.random() * 20 - 10))
    const baseCustomers = Math.round(89 + (Math.random() * 10 - 5))
    
    const analytics: AnalyticsData = {
      revenue: {
        current: baseRevenue,
        previous: Math.round(baseRevenue * 0.85),
        growth: Math.round(((baseRevenue / (baseRevenue * 0.85)) - 1) * 100)
      },
      orders: {
        current: baseOrders,
        previous: Math.round(baseOrders * 0.88),
        growth: Math.round(((baseOrders / (baseOrders * 0.88)) - 1) * 100)
      },
      customers: {
        current: baseCustomers,
        previous: Math.round(baseCustomers * 0.9),
        growth: Math.round(((baseCustomers / (baseCustomers * 0.9)) - 1) * 100)
      },
      topMedicines: medicines.slice(0, 5).map((medicine, index) => ({
        name: medicine.name,
        sales: Math.floor(Math.random() * 50) + 10,
        revenue: Math.round(medicine.price * (Math.floor(Math.random() * 50) + 10)),
        growth: Math.round((Math.random() - 0.5) * 40)
      })),
      categoryPerformance: [
        { category: 'Pain Relief', revenue: 12500, percentage: 35, growth: 15 },
        { category: 'Antibiotics', revenue: 8900, percentage: 25, growth: -5 },
        { category: 'Vitamins', revenue: 6700, percentage: 19, growth: 22 },
        { category: 'Cold & Flu', revenue: 4200, percentage: 12, growth: 8 },
        { category: 'Other', revenue: 3200, percentage: 9, growth: 12 }
      ],
      monthlyTrends: Array.from({ length: 6 }, (_, i) => {
        const month = new Date(currentTime.getFullYear(), currentTime.getMonth() - 5 + i, 1)
        return {
          month: month.toLocaleDateString('en-US', { month: 'short' }),
          revenue: Math.round(28000 + (i * 2000) + (Math.random() * 5000)),
          orders: Math.round(120 + (i * 8) + (Math.random() * 20))
        }
      })
    }

    setAnalytics(analytics)
    generateOptimizations(analytics)
  }

  const generateOptimizations = (data: AnalyticsData) => {
    const opts = []
    if (data.revenue.growth < 10) opts.push('Consider promotional campaigns to boost revenue')
    if (data.orders.growth < 15) opts.push('Implement order incentives to increase sales volume')
    if (data.customers.growth < 20) opts.push('Focus on customer acquisition strategies')
    setOptimizations(opts)
  }

  const handleSetGoals = (newGoals: typeof goals) => {
    setGoals(newGoals)
    localStorage.setItem(`pharmacy-goals-${id}`, JSON.stringify(newGoals))
    setShowGoalDialog(false)
  }

  const generateDetailedReport = () => {
    if (!analytics) return ''
    return `
# Pharmacy Analytics Report
## Period: ${selectedPeriod}
## Generated: ${new Date().toLocaleString()}

### Key Metrics
- Revenue: $${analytics.revenue.current.toLocaleString()} (${analytics.revenue.growth > 0 ? '+' : ''}${analytics.revenue.growth}%)
- Orders: ${analytics.orders.current} (${analytics.orders.growth > 0 ? '+' : ''}${analytics.orders.growth}%)
- Customers: ${analytics.customers.current} (${analytics.customers.growth > 0 ? '+' : ''}${analytics.customers.growth}%)

### Top Performing Medicines
${analytics.topMedicines.map((m, i) => `${i + 1}. ${m.name} - $${m.revenue} (${m.sales} units)`).join('\n')}

### Category Performance
${analytics.categoryPerformance.map(c => `- ${c.category}: $${c.revenue} (${c.percentage}%)`).join('\n')}

### Recommendations
${optimizations.map(opt => `- ${opt}`).join('\n')}
    `.trim()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="w-full max-w-none space-y-8 animate-fade-in-up">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 p-8 lg:p-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-teal-600/20 to-blue-600/20 animate-gradient"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-6 mb-6">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-green-100 to-blue-100 bg-clip-text text-transparent mb-2">
                  Analytics
                </h1>
                <p className="text-green-100 dark:text-slate-300 text-xl opacity-90">Comprehensive business insights and performance metrics</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {['7d', '30d', '90d', '1y'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                onClick={() => setSelectedPeriod(period)}
                className={`${
                  selectedPeriod === period
                    ? 'bg-white/20 text-white border-white/30'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                } backdrop-blur-sm transition-all duration-300`}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 animate-float-delayed"></div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover-lift">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">Total Revenue</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {formatCurrency(analytics.revenue.current)}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  {analytics.revenue.growth > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    analytics.revenue.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(analytics.revenue.growth)} vs last period
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((analytics.revenue.current / goals.revenue) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Goal: {formatCurrency(goals.revenue)} ({Math.round((analytics.revenue.current / goals.revenue) * 100)}%)
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover-lift">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">Total Orders</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{analytics.orders.current}</p>
                <div className="flex items-center gap-2 mb-2">
                  {analytics.orders.growth > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    analytics.orders.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(analytics.orders.growth)} vs last period
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((analytics.orders.current / goals.orders) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Goal: {goals.orders} ({Math.round((analytics.orders.current / goals.orders) * 100)}%)
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg hover:scale-110 transition-transform duration-300">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover-lift">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">Active Customers</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{analytics.customers.current}</p>
                <div className="flex items-center gap-2 mb-2">
                  {analytics.customers.growth > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    analytics.customers.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(analytics.customers.growth)} vs last period
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((analytics.customers.current / goals.customers) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Goal: {goals.customers} ({Math.round((analytics.customers.current / goals.customers) * 100)}%)
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg hover:scale-110 transition-transform duration-300">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performing Medicines */}
        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Target className="h-5 w-5 text-blue-600" />
              Top Performing Medicines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topMedicines.map((medicine, index) => (
                <div key={medicine.name} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{medicine.name}</p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">{medicine.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(medicine.revenue)}</p>
                    <div className="flex items-center gap-1">
                      {medicine.growth > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={`text-xs font-medium ${
                        medicine.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPercentage(medicine.growth)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <PieChart className="h-5 w-5 text-green-600" />
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.categoryPerformance.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">{category.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(category.revenue)}</span>
                      <div className="flex items-center gap-1">
                        {category.growth > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <span className={`text-xs font-medium ${
                          category.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatPercentage(category.growth)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={category.percentage} className="flex-1 h-2" />
                    <span className="text-sm text-gray-600 dark:text-slate-400 w-12">{category.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Activity className="h-5 w-5 text-purple-600" />
            Monthly Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-6">
            {analytics.monthlyTrends.map((month, index) => (
              <div 
                key={month.month} 
                className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 hover:scale-105 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">{month.month}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {formatCurrency(month.revenue)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{month.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <CardContent className="p-8 text-center">
            <Eye className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-2">View Detailed Reports</h3>
            <p className="text-blue-100 mb-4">Access comprehensive analytics and custom reports</p>
            <Button 
              variant="outline" 
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              onClick={() => setShowReportDialog(true)}
            >
              View Reports
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-500 to-teal-500 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-2">Set Goals</h3>
            <p className="text-green-100 mb-4">Define targets and track your progress</p>
            <Button 
              variant="outline" 
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              onClick={() => setShowGoalDialog(true)}
            >
              Set Goals
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <CardContent className="p-8 text-center">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-2">Optimize Performance</h3>
            <p className="text-orange-100 mb-4">Get AI-powered recommendations</p>
            <div className="space-y-2">
              {optimizations.slice(0, 2).map((opt, i) => (
                <p key={i} className="text-xs text-orange-100 opacity-80">{opt}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Setting Dialog */}
      {showGoalDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Set Your Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Revenue Goal ($)</label>
                <input 
                  type="number" 
                  defaultValue={goals.revenue}
                  className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  onChange={(e) => setGoals({...goals, revenue: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Orders Goal</label>
                <input 
                  type="number" 
                  defaultValue={goals.orders}
                  className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  onChange={(e) => setGoals({...goals, orders: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Customers Goal</label>
                <input 
                  type="number" 
                  defaultValue={goals.customers}
                  className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  onChange={(e) => setGoals({...goals, customers: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleSetGoals(goals)} className="flex-1">
                  Save Goals
                </Button>
                <Button variant="outline" onClick={() => setShowGoalDialog(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Report Dialog */}
      {showReportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[80vh] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-gray-900 dark:text-white">Detailed Analytics Report</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    onClick={() => {
                      const report = generateDetailedReport()
                      const blob = new Blob([report], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `pharmacy-report-${new Date().toISOString().split('T')[0]}.txt`
                      a.click()
                    }}
                  >
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowReportDialog(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-slate-300 font-mono">
                {generateDetailedReport()}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Real-time indicator */}
      <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        Live Data
      </div>
    </div>
  )
}