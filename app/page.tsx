'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Button } from './components/ui/button'
import OverallBudgetPopup from './components/OverallBudgetPopup'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { IndianRupee, PieChart, TrendingUp } from 'lucide-react'
import Header from './components/Header'
import BudgetEditIcon from './components/BudgetEditIcon'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showBudgetPopup, setShowBudgetPopup] = useState(false)
  const [overallBudget, setOverallBudget] = useState<number | null>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      checkOverallBudget()
    }
  }, [status])

  const checkOverallBudget = async () => {
    const res = await fetch('/api/budget/overall')
    const data = await res.json()
    if (data.overallBudget === null) {
      setShowBudgetPopup(true)
    } else {
      setOverallBudget(data.overallBudget)
    }
  }

  const handleSetBudget = async (amount: number) => {
    const res = await fetch('/api/budget/overall', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ overallBudget: amount }),
    })
    if (res.ok) {
      setOverallBudget(amount)
      setShowBudgetPopup(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
{
  session &&
  <BudgetEditIcon />
}
      <Header />
      <main className="flex-grow">
        <section className="bg-blue-600 py-20 text-white">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Take Control of Your Finances</h1>
            <p className="text-xl mb-8">Expensera helps you track expenses, plan budgets, and make smarter financial decisions.</p>
            {!session && (
              <Link href="/signup">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">Get Started</Button>
              </Link>
            )}
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <IndianRupee className="mr-2" />
                    Expense Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Easily log and categorize your expenses to understand your spending habits.</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2" />
                    Budget Planning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Set budgets for different categories and get AI-powered suggestions.</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2" />
                    Spending Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Visualize your spending patterns with interactive charts and graphs.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {session && overallBudget !== null && (
          <section className="bg-blue-50 py-20">
            <div className="container mx-auto text-center">
              <h3 className="text-3xl font-bold mb-8 text-gray-800">Ready to manage your finances?</h3>
              <div className="flex justify-center space-x-4">
                <Link href="/expenses">
                  <Button>Track Expenses</Button>
                </Link>
                <Link href="/budget">
                  <Button>Plan Budget</Button>
                </Link>
                <Link href="/analysis">
                  <Button>View Analysis</Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-gray-100 text-center p-4 text-gray-600">
        <p>&copy; 2025 Expensera. All rights reserved.</p>
      </footer>

      {showBudgetPopup && (
        <OverallBudgetPopup
          currentBudget={overallBudget || 0}
          onSave={handleSetBudget}
          onClose={() => {}} // Prevent closing without setting budget
        />
      )}
    </div>
  )
}

