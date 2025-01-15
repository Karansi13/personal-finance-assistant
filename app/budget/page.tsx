'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BudgetChart from '../components/BudgetChart'
import { getBudgetSuggestions } from '../../utils/ai'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { PieChart } from 'lucide-react'
import { Button } from '../components/ui/button'

export default function BudgetPage() {
  const [budget, setBudget] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchBudgetSuggestions = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const suggestions = await getBudgetSuggestions()
        setBudget(suggestions)
      } catch (error) {
        setError('Failed to load budget suggestions. Please try again later.')
        console.error('Error fetching budget suggestions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBudgetSuggestions()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <PieChart className="mr-2" />
            Budget Planner
          </CardTitle>
          <CardDescription>
            View AI-generated budget suggestions based on common financial guidelines. Use this as a starting point to create your personalized budget.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          {!isLoading && !error && Object.keys(budget).length > 0 && (
            <div>
              <BudgetChart budget={budget} />
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(budget).map(([category, percentage]) => (
                  <div key={category} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <h3 className="font-semibold text-lg">{category}</h3>
                    <p className="text-2xl font-bold text-blue-600">{percentage}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Button
        onClick={() => router.push('/')}
        className="mt-4 px-4 py-2 "
      >
        Back to Home
      </Button>
    </div>
  )
}

