'use client'

import { useState, useEffect } from 'react'
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

interface BudgetFormProps {
  initialBudget: {
    overallBudget: number;
    categories: Record<string, number>;
  };
  onUpdateBudget: (budget: { overallBudget: number; categories: Record<string, number> }) => void;
}

export default function BudgetForm({ initialBudget, onUpdateBudget }: BudgetFormProps) {
  const [overallBudget, setOverallBudget] = useState(initialBudget.overallBudget)
  const [categories, setCategories] = useState<Record<string, number>>(initialBudget.categories || {})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setOverallBudget(initialBudget.overallBudget)
    setCategories(initialBudget.categories || {})
  }, [initialBudget])

  const handleOverallBudgetChange = (value: string) => {
    setOverallBudget(parseFloat(value) || 0)
  }

  const handleCategoryChange = (category: string, value: string) => {
    setCategories(prev => ({ ...prev, [category]: parseFloat(value) || 0 }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await onUpdateBudget({ overallBudget, categories })
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Your Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <label className="w-1/3">Overall Budget:</label>
            <Input
              type="number"
              value={overallBudget}
              onChange={(e) => handleOverallBudgetChange(e.target.value)}
              className="w-1/3"
              min="0"
              step="0.01"
            />
          </div>
          {Object.entries(categories).map(([category, amount]) => (
            <div key={category} className="flex items-center space-x-2">
              <label className="w-1/3">{category}:</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => handleCategoryChange(category, e.target.value)}
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
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

