import Link from 'next/link'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route"
import { LoginButton } from './components/LoginButton'
import { LogoutButton } from './components/LogoutButton'
import { Button } from './components/ui/button'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">FinanceWise</h1>
          {session ? (
            <LogoutButton />
          ) : (
            <LoginButton />
          )}
        </div>
      </header>

      <main className="flex-grow">
        <section className="bg-blue-50 py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Take Control of Your Finances</h2>
            <p className="text-xl mb-8">FinanceWise helps you track expenses, plan budgets, and make smarter financial decisions.</p>
            {!session && (
              <Link href="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
            )}
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-center">Our Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold mb-2">Expense Tracking</h4>
                <p>Easily log and categorize your expenses to understand your spending habits.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold mb-2">Budget Planning</h4>
                <p>Set budgets for different categories and get AI-powered suggestions.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold mb-2">Spending Analysis</h4>
                <p>Visualize your spending patterns with interactive charts and graphs.</p>
              </div>
            </div>
          </div>
        </section>

        {session && (
          <section className="bg-blue-50 py-20">
            <div className="container mx-auto text-center">
              <h3 className="text-3xl font-bold mb-8">Ready to manage your finances?</h3>
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

      <footer className="bg-gray-100 text-center p-4">
        <p>&copy; 2023 FinanceWise. All rights reserved.</p>
      </footer>
    </div>
  )
}

