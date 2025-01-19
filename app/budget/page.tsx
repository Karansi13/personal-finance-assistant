'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import BudgetChart from '../components/BudgetChart'
import BudgetForm from '../components/BudgetForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { PieChart, IndianRupee } from 'lucide-react'
import { getBudgetSuggestions } from '../../utils/ai'

export default function BudgetPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [budget, setBudget] = useState<{ overallBudget: number; categories: Record<string, number> }>({ overallBudget: 0, categories: {} })
  const [expenses, setExpenses] = useState<Record<string, number>>({})
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchBudgetAndExpenses()
    }
  }, [status, router])

  const fetchBudgetAndExpenses = async () => {
    setIsLoading(true)
    const [budgetRes, expensesRes] = await Promise.all([
      fetch('/api/budget'),
      fetch('/api/expenses')
    ])
    const budgetData = await budgetRes.json()
    const expensesData = await expensesRes.json()
    
    setBudget(budgetData)
    setExpenses(expensesData.reduce((acc: Record<string, number>, expense: any) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {}))
    setIsLoading(false)

    updateAISuggestions(budgetData.overallBudget, expensesData)
  }

  const updateAISuggestions = async (overallBudget: number, expensesData: any[]) => {
    const totalExpenses = expensesData.reduce((sum, expense) => sum + expense.amount, 0)
    console.log("total ",totalExpenses)
    const remainingBudget = overallBudget - totalExpenses;
    console.log(remainingBudget)
    const suggestions = await getBudgetSuggestions(remainingBudget, overallBudget)
    setAiSuggestions(suggestions)
  }

  const updateBudget = async (newBudget: { overallBudget: number; categories: Record<string, number> }) => {
    const res = await fetch('/api/budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBudget),
    })
    if (res.ok) {
      setBudget(newBudget)
      updateAISuggestions(newBudget.overallBudget, Object.values(expenses))
    }
  }

  if (status === 'loading' || isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return null // The useEffect will redirect
  }

  const totalExpenses = Object.values(expenses).reduce((sum, amount) => sum + amount, 0)
  const remainingBudget = budget.overallBudget - totalExpenses

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      style: 'currency',
      currency: 'INR'
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <PieChart className="mr-2" />
            Budget Planner
          </CardTitle>
          <CardDescription>
            Set your monthly budget and track your spending against it. Use the AI-generated suggestions for remaining budget allocation.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-6 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold flex items-center mb-2">
                  <IndianRupee className="mr-1" />
                  Overall Budget: {formatCurrency(budget.overallBudget)}
                </h3>
                <h3 className="text-lg font-semibold text-green-600 flex items-center">
                  <IndianRupee className="mr-1" />
                  Remaining Budget: {formatCurrency(remainingBudget)}
                </h3>
              </div>
              <BudgetForm initialBudget={budget} onUpdateBudget={updateBudget} />
            </div>
            <div>
              <BudgetChart budget={budget.categories} expenses={expenses} aiSuggestions={aiSuggestions} />
            </div>
          </div>
          <div className="mt-8 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">AI Suggestions for Remaining Budget:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Object.entries(aiSuggestions).map(([category, amount]) => (
                <div key={category} className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium text-blue-800">{category}</p>
                  <p className="text-blue-600 flex items-center">
                    <IndianRupee className="mr-1 h-4 w-4" />
                    {formatCurrency(amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

