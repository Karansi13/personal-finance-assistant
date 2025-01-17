'use client'

import { useState, Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"


interface MonthSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: Dispatch<SetStateAction<number>>;
  onYearChange: Dispatch<SetStateAction<number>>;
}

export default function MonthSelector({ 
  selectedMonth, 
  selectedYear, 
  onMonthChange, 
  onYearChange 
}: MonthSelectorProps) {
  const router = useRouter()
  const [month, setMonth] = useState(selectedMonth.toString())
  const [year, setYear] = useState(selectedYear.toString())

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  const handleMonthChange = (value: string) => {
    setMonth(value)
    router.push(`/expenses?month=${parseInt(value) + 1}&year=${selectedYear}`)
  }

  const handleYearChange = (value: string) => {
    setYear(value)
    router.push(`/expenses?month=${parseInt(month) + 1}&year=${value}`)
  }

  return (
    <div className="flex space-x-4 mt-4">
      <Select value={month} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month, index) => (
            <SelectItem key={index} value={index.toString()}>{month}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={year} onValueChange={handleYearChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

