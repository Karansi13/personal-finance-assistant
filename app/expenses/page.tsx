'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import MonthSelector from '../components/MonthSelector'
import ExpenseFilter from '../components/ExpenseFilter' // Import the new component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { IndianRupee } from 'lucide-react'
import { Expense } from '../types/expense'
import BudgetEditIcon from '../components/BudgetEditIcon'

export default function ExpensesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [expenses, setExpenses] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()) // Update 1
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filterMonth, setFilterMonth] = useState<number | null>(null) // Update 2

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchExpenses()
    }
  }, [status, selectedMonth, selectedYear, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchExpenses()
    }
  }, [status, selectedMonth, selectedYear, searchTerm, selectedCategory, filterMonth])


  const fetchExpenses = async () => {
    const res = await fetch(`/api/expenses?month=${selectedMonth + 1}&year=${selectedYear}&search=${searchTerm}&category=${selectedCategory}&filterMonth=${filterMonth !== null ? filterMonth + 1 : ''}`) // Update 3
    const data = await res.json()
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

  if (status === 'loading' ) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return null // The useEffect will redirect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BudgetEditIcon />
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <IndianRupee className="mr-2" />
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
      <ExpenseFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filterMonth={filterMonth}
        setFilterMonth={setFilterMonth} // Update 4
      />
      <ExpenseList expenses={expenses} />
    </div>
  )
}

