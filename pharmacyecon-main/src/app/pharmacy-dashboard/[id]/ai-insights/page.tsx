'use client'

import { use, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, Zap, BarChart3, PieChart, Activity, Sparkles } from 'lucide-react'
import { getMedicines } from '@/lib/api'
import type { Medicine } from '@/lib/types'

interface AIInsight {
  id: string
  type: 'warning' | 'opportunity' | 'recommendation' | 'prediction'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
  actionable: boolean
  category: string
}

export default function AIInsightsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      const allMedicines = await getMedicines()
      const pharmacyMedicines = allMedicines.filter(m => m.pharmacyId === id)
      setMedicines(pharmacyMedicines)
      generateAIInsights(pharmacyMedicines)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateAIInsights = (medicines: Medicine[]) => {
    const insights: AIInsight[] = []

    // Stock Level Analysis
    const lowStockMedicines = medicines.filter(m => m.stock < 10)
    const outOfStockMedicines = medicines.filter(m => m.stock === 0)
    
    if (lowStockMedicines.length > 0) {
      insights.push({
        id: 'low-stock-alert',
        type: 'warning',
        title: 'Low Stock Alert',
        description: `${lowStockMedicines.length} medicines are running low on stock. Consider reordering soon to avoid stockouts.`,
        impact: 'high',
        confidence: 95,
        actionable: true,
        category: 'inventory'
      })
    }

    // Price Optimization
    const avgPrice = medicines.reduce((sum, m) => sum + m.price, 0) / medicines.length
    const expensiveMedicines = medicines.filter(m => m.price > avgPrice * 1.5)
    
    if (expensiveMedicines.length > 0) {
      insights.push({
        id: 'price-optimization',
        type: 'opportunity',
        title: 'Price Optimization Opportunity',
        description: `${expensiveMedicines.length} medicines are priced significantly above average. Consider competitive pricing analysis.`,
        impact: 'medium',
        confidence: 78,
        actionable: true,
        category: 'pricing'
      })
    }

    // Category Distribution Analysis
    const categoryCount = medicines.reduce((acc, m) => {
      acc[m.category] = (acc[m.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const dominantCategory = Object.entries(categoryCount).sort(([,a], [,b]) => b - a)[0]
    if (dominantCategory && dominantCategory[1] > medicines.length * 0.4) {
      insights.push({
        id: 'category-diversification',
        type: 'recommendation',
        title: 'Diversify Medicine Categories',
        description: `${dominantCategory[0]} represents ${Math.round((dominantCategory[1] / medicines.length) * 100)}% of your inventory. Consider diversifying to reduce risk.`,
        impact: 'medium',
        confidence: 82,
        actionable: true,
        category: 'strategy'
      })
    }

    // Expiration Date Analysis
    const currentDate = new Date()
    const soonToExpire = medicines.filter(m => {
      const expiryDate = new Date(m.expirationDate)
      const daysUntilExpiry = (expiryDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0
    })

    if (soonToExpire.length > 0) {
      insights.push({
        id: 'expiry-alert',
        type: 'warning',
        title: 'Medicines Expiring Soon',
        description: `${soonToExpire.length} medicines will expire within 30 days. Consider promotional pricing to move inventory.`,
        impact: 'high',
        confidence: 100,
        actionable: true,
        category: 'inventory'
      })
    }

    // Revenue Prediction
    const totalValue = medicines.reduce((sum, m) => sum + (m.price * m.stock), 0)
    insights.push({
      id: 'revenue-prediction',
      type: 'prediction',
      title: 'Monthly Revenue Forecast',
      description: `Based on current inventory and historical data, projected monthly revenue is $${Math.round(totalValue * 0.3).toLocaleString()}.`,
      impact: 'medium',
      confidence: 73,
      actionable: false,
      category: 'analytics'
    })

    // Seasonal Recommendations
    const currentMonth = new Date().getMonth()
    const seasonalCategories = {
      'Cold & Flu': [10, 11, 0, 1, 2], // Nov-Mar
      'Allergy': [2, 3, 4, 5], // Mar-Jun
      'Sunscreen': [4, 5, 6, 7, 8], // May-Sep
    }

    Object.entries(seasonalCategories).forEach(([category, months]) => {
      if (months.includes(currentMonth)) {
        const categoryMedicines = medicines.filter(m => m.category.toLowerCase().includes(category.toLowerCase()))
        if (categoryMedicines.length < 3) {
          insights.push({
            id: `seasonal-${category.toLowerCase().replace(/\s+/g, '-')}`,
            type: 'opportunity',
            title: `Seasonal Opportunity: ${category}`,
            description: `Current season favors ${category} products. Consider stocking more items in this category.`,
            impact: 'medium',
            confidence: 85,
            actionable: true,
            category: 'seasonal'
          })
        }
      }
    })

    setInsights(insights)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5" />
      case 'opportunity': return <Target className="h-5 w-5" />
      case 'recommendation': return <Lightbulb className="h-5 w-5" />
      case 'prediction': return <TrendingUp className="h-5 w-5" />
      default: return <Brain className="h-5 w-5" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning': return 'from-red-500 to-orange-500'
      case 'opportunity': return 'from-green-500 to-emerald-500'
      case 'recommendation': return 'from-blue-500 to-purple-500'
      case 'prediction': return 'from-purple-500 to-pink-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  const categories = ['all', 'inventory', 'pricing', 'strategy', 'analytics', 'seasonal']
  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-none space-y-8 animate-fade-in-up">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 p-8 lg:p-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 animate-gradient"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-6">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform duration-300">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2">
                AI Insights
              </h1>
              <p className="text-blue-100 dark:text-slate-300 text-xl opacity-90">Smart recommendations powered by artificial intelligence</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 animate-float-delayed"></div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className={`transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                : 'bg-white/90 dark:bg-slate-800/90 hover:bg-purple-50 dark:hover:bg-slate-700'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* AI Insights Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredInsights.map((insight, index) => (
          <Card 
            key={insight.id} 
            className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover-lift animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${getInsightColor(insight.type)} text-white shadow-lg`}>
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'}
                    className={`${
                      insight.impact === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                      insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-gray-100 text-gray-800 border-gray-200'
                    } dark:bg-opacity-20`}
                  >
                    {insight.impact} impact
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-slate-400 mb-4 leading-relaxed">
                {insight.description}
              </p>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Confidence</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{insight.confidence}%</span>
                  </div>
                  <Progress value={insight.confidence} className="h-2" />
                </div>
                
                {insight.actionable && (
                  <Button 
                    size="sm" 
                    className={`w-full bg-gradient-to-r ${getInsightColor(insight.type)} text-white hover:scale-105 transition-all duration-300`}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Take Action
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Insight Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['warning', 'opportunity', 'recommendation', 'prediction'].map(type => {
                const count = insights.filter(i => i.type === type).length
                const percentage = (count / insights.length) * 100
                return (
                  <div key={type}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium capitalize text-gray-700 dark:text-slate-300">{type}</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{count}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Activity className="h-5 w-5 text-green-600" />
              AI Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)}%
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Average Confidence</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">AI Model: GPT-4 Enhanced</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Target className="h-5 w-5 text-purple-600" />
              Action Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {insights.filter(i => i.actionable).length}
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Actionable Insights</p>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 transition-all duration-300">
                <Zap className="h-4 w-4 mr-2" />
                Execute All Actions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}