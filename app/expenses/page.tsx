'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import { Expense } from '../types/expense'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { DollarSign } from 'lucide-react'
import { Button } from '../components/ui/button'

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const router = useRouter()

  const addExpense = (expense: Expense) => {
    setExpenses([...expenses, expense])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <DollarSign className="mr-2" />
            Expense Tracker
          </CardTitle>
          <CardDescription>
            Track your daily expenses and categorize them automatically. This helps you understand your spending habits and stick to your budget.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseForm onAddExpense={addExpense} />
        </CardContent>
      </Card>
      <ExpenseList expenses={expenses} />
      <Button
        onClick={() => router.push('/')}
        className="mt-8 px-4 py-2"
      >
        Back to Home
      </Button>
    </div>
  )
}

