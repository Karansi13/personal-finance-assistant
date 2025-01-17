'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import MonthSelector from '../components/MonthSelector'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { DollarSign } from 'lucide-react'
import { Expense } from '../types/expense'

export default function ExpensesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [expenses, setExpenses] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchExpenses()
    }
  }, [status, selectedMonth, selectedYear, router])

  const fetchExpenses = async () => {
    const res = await fetch(`/api/expenses?month=${selectedMonth}&year=${selectedYear}`)
    console.log(res)
    const data = await res.json()
    console.log("daata",data)
    setExpenses(data)
  }

  const addExpense = async (expense: Expense) => {
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    })
    if (res.ok) {
      fetchExpenses()
    }
  }

  if (status === 'loading') {
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
            <DollarSign className="mr-2" />
            Expense Tracker
          </CardTitle>
          <CardDescription>
            Track your daily expenses and categorize them automatically. This helps you understand your spending habits and stick to your budget.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseForm onAddExpense={addExpense} />
          <MonthSelector 
            selectedMonth={selectedMonth} 
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
        </CardContent>
      </Card>
      <ExpenseList expenses={expenses} />
    </div>
  )
}

