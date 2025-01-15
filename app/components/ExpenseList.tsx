// import { Expense } from "./types"


// interface ExpenseListProps {
//   expenses: Expense[]
// }

// export default function ExpenseList({ expenses }: ExpenseListProps) {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Expense List</h2>
//       <ul>
//         {expenses.map((expense) => (
//           <li key={expense.id} className="mb-2">
//             {expense.description} - ${expense.amount.toFixed(2)} ({expense.category})
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }


import { Expense } from '../types/expense'
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ShoppingBag, Home, Car, Utensils, Zap, Heart, Film, MoreHorizontal } from 'lucide-react'

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
            <div className="space-y-2">
              {categoryExpenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-700">{expense.description}</span>
                  <span className="font-semibold">${expense.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

