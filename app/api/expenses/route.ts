// app/api/expenses/route.ts
import { NextResponse } from 'next/server'
import { categorizeExpense } from '@/utils/ai'

export async function POST(request: Request) {
  const data = await request.json()
  const category = await categorizeExpense(data.description)
  
  // TODO: Store in database here
  
  return NextResponse.json({ category })
}