'use client'

import { useState } from 'react'
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { getBudgetSuggestions } from '../../utils/ai'

interface BudgetFormProps {
  initialBudget: Record<string, number>
  onUpdateBudget: (budget: Record<string, number>) => void
}

export default function BudgetForm({ initialBudget, onUpdateBudget }: BudgetFormProps) {
  console.log(initialBudget)
  const [budget, setBudget] = useState(initialBudget)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (category: string, value: string) => {
    setBudget(prev => ({ ...prev, [category]: parseFloat(value) || 0 }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await onUpdateBudget(budget)
    setIsLoading(false)
  }

  const handleGetSuggestions = async () => {
    setIsLoading(true)
    try {
      const suggestions = await getBudgetSuggestions()
      setBudget(suggestions)
    } catch (error) {
      console.error('Error getting budget suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.entries(budget).map(([category, amount]) => (
        <div key={category} className="flex items-center space-x-2">
          <label className="w-1/3">{category}</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => handleInputChange(category, e.target.value)}
            className="w-1/3"
            min="0"
            step="0.01"
          />
        </div>
      ))}
      <div className="flex space-x-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Budget'}
        </Button>
        <Button type="button" onClick={handleGetSuggestions} disabled={isLoading}>
          Get AI Suggestions
        </Button>
      </div>
    </form>
  )
}

