'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import BudgetChart from '../components/BudgetChart'
import BudgetForm from '../components/BudgetForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { PieChart } from 'lucide-react'
import { Expense } from '../types/expense'

export default function BudgetPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [budget, setBudget] = useState<Record<string, number>>({})
  const [expenses, setExpenses] = useState<Record<string, number>>({})
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
    console.log(budgetData)
    const expensesData = await expensesRes.json()
    
    setBudget(budgetData)
    setExpenses(expensesData.reduce((acc: Record<string, number>, expense: Expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {}))
    setIsLoading(false)
  }

  const updateBudget = async (newBudget: Record<string, number>) => {
    const res = await fetch('/api/budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBudget),
    })
    if (res.ok) {
      setBudget(newBudget)
    }
    console.log(budget)
  }

  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    return null // The useEffect will redirect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <PieChart className="mr-2" />
            Budget Planner
          </CardTitle>
          <CardDescription>
            Set your monthly budget and track your spending against it. Use the AI-generated suggestions as a starting point.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetForm initialBudget={budget} onUpdateBudget={updateBudget} />
          <BudgetChart budget={budget} expenses={expenses} />
        </CardContent>
      </Card>
    </div>
  )
}

