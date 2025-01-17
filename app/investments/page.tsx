'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getInvestmentSuggestions } from '../../utils/ai'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { TrendingUp, Loader } from 'lucide-react'

export default function InvestmentsPage() {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchInvestmentSuggestions = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const investmentSuggestions = await getInvestmentSuggestions()
        setSuggestions(investmentSuggestions)
      } catch (error) {
        setError('Failed to load investment suggestions. Please try again later.')
        console.error('Error fetching suggestions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvestmentSuggestions()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <TrendingUp className="mr-2" />
            Investment Recommendations
          </CardTitle>
          <CardDescription>
            Explore AI-generated investment suggestions tailored for beginners. Remember to do your own research and consider consulting with a financial advisor before making investment decisions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Loader className="animate-spin h-8 w-8 text-blue-500" />
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          {!isLoading && !error && (
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className="bg-white p-4 rounded-lg shadow border border-gray-200"
                >
                  <div className="flex items-start">
                    <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-4 flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-gray-700">{suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <button
        onClick={() => router.push('/')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Back to Home
      </button>
    </div>
  )
}

