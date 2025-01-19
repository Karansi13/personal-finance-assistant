'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { IndianRupee, TrendingUp, PieChart } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export default function AnalysisPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [expenses, setExpenses] = useState([])
  const [budgets, setBudgets] = useState<any[]>([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchData()
    }
  }, [status, selectedYear, router])

  const fetchData = async () => {
    setIsLoading(true)
    const [expensesRes, budgetsRes] = await Promise.all([
      fetch(`/api/expenses?year=${selectedYear}`),
      fetch(`/api/budget?year=${selectedYear}`)
    ])
    const expensesData = await expensesRes.json()
    const budgetsData = await budgetsRes.json()
    setExpenses(expensesData)
    setBudgets(Array.isArray(budgetsData) ? budgetsData : [])
    setIsLoading(false)
  }

  if (status === 'loading' || isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return null // The useEffect will redirect
  }

  const monthlyTotals = Array(12).fill(0)
  const monthlyBudgets = Array(12).fill(0)
  const categoryTotals: Record<string, number> = {}

  expenses.forEach((expense: any) => {
    const month = new Date(expense.date).getMonth()
    monthlyTotals[month] += expense.amount
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
  })

  budgets.forEach((budget: any) => {
    if (budget && budget.month && budget.overallBudget) {
      monthlyBudgets[budget.month - 1] = budget.overallBudget
    }
  })

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      style: 'currency',
      currency: 'INR'
    })
  }

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyTotals,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      },
      {
        label: 'Monthly Budgets',
        data: monthlyBudgets,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
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
    scales: {
      y: {
        ticks: {
          callback: function (tickValue: string | number) {
            return formatCurrency(Number(tickValue));
          },
        },
      },
    },
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <TrendingUp className="mr-2" />
            Spending Analysis
          </CardTitle>
          <CardDescription>
            Analyze your spending patterns and trends
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="mb-6">
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-[180px]">
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
            <Card className="shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Monthly Expenses vs Budgets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Line data={monthlyData} options={chartOptions} />
              </CardContent>
            </Card>
            <Card className="shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Expenses by Category
                </CardTitle>
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

