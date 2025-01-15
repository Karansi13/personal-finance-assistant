'use client'

import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface BudgetChartProps {
  budget: Record<string, number>
}

export default function BudgetChart({ budget }: BudgetChartProps) {
  const data = {
    labels: Object.keys(budget),
    datasets: [
      {
        data: Object.values(budget),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Pie data={data} />
    </div>
  )
}

