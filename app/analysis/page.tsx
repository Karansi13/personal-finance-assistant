'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)
import { Expense } from '../types/expense'

export default function AnalysisPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [expenses, setExpenses] = useState([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchExpenses()
    }
  }, [status, selectedYear, router])

  const fetchExpenses = async () => {
    setIsLoading(true)
    const res = await fetch(`/api/expenses?year=${selectedYear}`)
    const data = await res.json()
    setExpenses(data)
    setIsLoading(false)
  }

  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    return null // The useEffect will redirect
  }

  const monthlyTotals = Array(12).fill(0)
  const categoryTotals: { [key: string]: number } = {}

  expenses.forEach((expense: Expense) => {
    const month = new Date(expense.date).getMonth()
    monthlyTotals[month] += expense.amount
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
  })

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyTotals,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      }
    ]
  }

  const categoryData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(categoryTotals),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Expense Analysis',
      },
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Spending Analysis</CardTitle>
          <CardDescription>Analyze your spending patterns and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(5)].map((_, i) => (
                  <SelectItem key={i} value={(new Date().getFullYear() - i).toString()}>
                    {new Date().getFullYear() - i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <Line data={monthlyData} options={chartOptions} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Bar data={categoryData} options={chartOptions} />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

