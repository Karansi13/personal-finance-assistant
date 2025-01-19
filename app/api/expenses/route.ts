import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import dbConnect from '@/app/lib/mongoose'
import Expense from '@/app/models/Expense'
import { Types } from 'mongoose'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  await dbConnect()

  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month')
  const year = searchParams.get('year')
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const filterMonth = searchParams.get('filterMonth')

  let query: any = { userId: new Types.ObjectId(session.user.id) }

  if (filterMonth) {
    query.date = {
      $gte: new Date(parseInt(year!), parseInt(filterMonth!) - 1, 1),
      $lt: new Date(parseInt(year!), parseInt(filterMonth!), 1)
    }
  } else if (month && year) {
    query.date = {
      $gte: new Date(parseInt(year), parseInt(month) - 1, 1),
      $lt: new Date(parseInt(year), parseInt(month), 1)
    }
  } else if (year) {
    query.date = {
      $gte: new Date(parseInt(year), 0, 1),
      $lt: new Date(parseInt(year) + 1, 0, 1)
    }
  }

  if (search) {
    query.description = { $regex: search, $options: 'i' }
  }

  if (category && category.toLowerCase() !== 'all') {
    query.category = { $regex: new RegExp(category, 'i') }
  }

  const expenses = await Expense.find(query).sort({ date: -1 })

  return NextResponse.json(expenses)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  await dbConnect()

  const body = await request.json()
  const { description, amount, category, date } = body

  try {
    const expense = await Expense.create({
      description,
      amount,
      category,
      date: new Date(date),
      userId: new Types.ObjectId(session.user.id),
    })

    return NextResponse.json(expense)
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json({ error: 'Error creating expense' }, { status: 500 })
  }
}

