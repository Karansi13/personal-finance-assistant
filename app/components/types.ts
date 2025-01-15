// types/index.ts
export interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
}

export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
}

export interface User {
  id: string
  name: string
  email: string
  expenses: Expense[]
  budgets: Budget[]
}