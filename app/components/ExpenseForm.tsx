'use client'

import { useState } from 'react'
import { Expense } from '../types/expense'
import { categorizeExpense } from '../../utils/ai'
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Loader } from 'lucide-react'

interface ExpenseFormProps {
  onAddExpense: (expense: Expense) => void
}

export default function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (description && amount) {
      setIsLoading(true)
      setError(null)
      try {
        const category = await categorizeExpense(description)
        const newExpense = {
          id: Date.now(),
          description,
          amount: parseFloat(amount),
          category,
          date: new Date().toISOString(),
        }
        await onAddExpense(newExpense)
        setDescription('')
        setAmount('')
      } catch (error) {
        setError('Failed to add expense. Please try again.')
        console.error('Error adding expense:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Expense description"
            className="flex-1"
            required
            disabled={isLoading}
          />
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full sm:w-32"
            required
            disabled={isLoading}
            min="0"
            step="0.01"
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            'Add Expense'
          )}
        </Button>
      </form>
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}

