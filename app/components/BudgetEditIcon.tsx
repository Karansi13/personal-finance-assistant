'use client'

import { useState } from 'react'
import { Edit2 } from 'lucide-react'
import { Button } from "../components/ui/button"
import OverallBudgetPopup from './OverallBudgetPopup'

export default function BudgetEditIcon() {
  const [showPopup, setShowPopup] = useState(false)
  const [currentBudget, setCurrentBudget] = useState(0)

  const handleSaveBudget = async (amount: number) => {
    const res = await fetch('/api/budget/overall', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ overallBudget: amount }),
    })
    if (res.ok) {
      setShowPopup(false)
      console.log(res)
      // You might want to add some state update or notification here
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowPopup(true)}
        className="fixed top-20 right-4 z-50 bg-white shadow-md"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      {showPopup && (
        <OverallBudgetPopup
          currentBudget={currentBudget} // You might want to fetch the current budget here
          onSave={handleSaveBudget}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  )
}

