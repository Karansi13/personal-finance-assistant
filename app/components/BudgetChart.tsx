'use client'

import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface BudgetChartProps {
  budget: Record<string, number>
  expenses: Record<string, number>
  aiSuggestions: Record<string, number>
}

export default function BudgetChart({ budget, expenses, aiSuggestions }: BudgetChartProps) {
  const categories = [...new Set([...Object.keys(budget), ...Object.keys(aiSuggestions)])]

  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Budget',
        data: categories.map(category => budget[category] || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: categories.map(category => expenses[category] || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'AI Suggestions',
        data: categories.map(category => aiSuggestions[category] || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Budget vs Expenses vs AI Suggestions',
      },
    },
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Pie data={data} options={options} />
    </div>
  )
}

