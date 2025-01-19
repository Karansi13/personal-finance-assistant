import { categorizeExpense } from "@/utils/ai"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ShoppingBag, Home, Car, Utensils, Zap, Heart, Film, MoreHorizontal } from 'lucide-react'

interface Expense {
  id: number
  description: string
  amount: number
  category: string
  date: string
}

interface ExpenseListProps {
  expenses: Expense[]
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  Shopping: <ShoppingBag className="w-6 h-6" />,
  Housing: <Home className="w-6 h-6" />,
  Transportation: <Car className="w-6 h-6" />,
  Food: <Utensils className="w-6 h-6" />,
  Utilities: <Zap className="w-6 h-6" />,
  Healthcare: <Heart className="w-6 h-6" />,
  Entertainment: <Film className="w-6 h-6" />,
  Other: <MoreHorizontal className="w-6 h-6" />,
}

export default function ExpenseList({ expenses }: ExpenseListProps) {
  const groupedExpenses = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = []
    }
    acc[expense.category].push(expense)
    return acc
  }, {} as Record<string, Expense[]>)

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      style: 'currency',
      currency: 'INR'
    })
  }

  console.log(groupedExpenses)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense List</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(groupedExpenses).map(([category, categoryExpenses]) => (
      <div key={category} className="mb-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          {categoryIcons[category] || categoryIcons['Other']}
          <span className="ml-2">{category}</span>
        </h3>
          {categoryExpenses.map((expense) => (
        <div className="space-y-2" key={expense.id}>
            <div
              key={expense.id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
            >
              <div>
                <span className="text-gray-700">{expense.description}</span>
                <div className="text-sm text-gray-500">
                  {new Date(expense.date).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              <span className="font-semibold">{formatCurrency(expense.amount)}</span>
            </div>
        </div>
          ))}
      </div>
    ))}
      </CardContent>
    </Card>
  )
}

