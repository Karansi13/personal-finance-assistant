import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import dbConnect from '@/app/lib/mongoose'
import Budget from '@/app/models/Budget'
import { Types } from 'mongoose'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  await dbConnect()

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const budget = await Budget.findOne({
    userId: new Types.ObjectId(session.user.id),
    month: currentMonth,
    year: currentYear,
  })

  return NextResponse.json({ overallBudget: budget ? budget.overallBudget : null })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  await dbConnect()

  const body = await request.json()
  const { overallBudget } = body
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  try {
    const budget = await Budget.findOneAndUpdate(
      {
        userId: new Types.ObjectId(session.user.id),
        month: currentMonth,
        year: currentYear,
      },
      {
        $set: {
          overallBudget,
        },
        $setOnInsert: {
          categories: {},
        },
      },
      { upsert: true, new: true }
    )

    return NextResponse.json(budget)
  } catch (error) {
    console.error('Error updating overall budget:', error)
    return NextResponse.json({ error: 'Error updating overall budget' }, { status: 500 })
  }
}

