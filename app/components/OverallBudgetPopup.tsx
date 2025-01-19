import { useState, useEffect } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"

interface OverallBudgetPopupProps {
  currentBudget: number
  onSave: (amount: number) => void
  onClose: () => void
}

export default function OverallBudgetPopup({ currentBudget, onSave, onClose }: OverallBudgetPopupProps) {
  console.log(currentBudget)
  const [budget, setBudget] = useState(currentBudget.toString())
  const [error, setError] = useState('')

  useEffect(() => {
    setBudget(currentBudget.toString())
  }, [currentBudget])

  const handleSave = () => {
    const amount = parseFloat(budget)
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid budget amount greater than 0.')
      return
    }
    onSave(amount)
  }

  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const currentYear = new Date().getFullYear()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set Overall Budget for {currentMonth} {currentYear}</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="number"
            value={budget}
            onChange={(e) => {
              setBudget(e.target.value)
              setError('')
            }}
            placeholder="Enter overall budget"
            min="0"
            step="0.01"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

