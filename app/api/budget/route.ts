import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import dbConnect from '@/app/lib/mongoose'
import Budget from '@/app/models/Budget'
import { Types } from 'mongoose'

export async function GET(request: Request) {
  const session: { user: { id: string } } | null = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  await dbConnect()

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const budget = await Budget.find({
    userId: new Types.ObjectId(session?.user?.id),
    month: currentMonth,
    year: currentYear,
  })

  const budgetObject = budget.reduce((acc, item) => {
    acc[item.category] = item.amount
    return acc
  }, {})

  return NextResponse.json(budgetObject)
}

export async function POST(request: Request) {
  const session: { user: { id: string } } | null = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  await dbConnect()

  const body = await request.json()
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  try {
    // Delete existing budget entries for the current month and year
    await Budget.deleteMany({
      userId: new Types.ObjectId(session?.user?.id),
      month: currentMonth,
      year: currentYear,
    })

    // Create new budget entries
    const budgetEntries = Object.entries(body).map(([category, amount]) => ({
      userId: new Types.ObjectId(session?.user?.id),
      category,
      amount: amount as number,
      month: currentMonth,
      year: currentYear,
    }))

    await Budget.insertMany(budgetEntries)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating budget:', error)
    return NextResponse.json({ error: 'Error updating budget' }, { status: 500 })
  }
}

