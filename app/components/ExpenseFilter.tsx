import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

interface ExpenseFilterProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  filterMonth: number | null
  setFilterMonth: (month: number | null) => void
}

const categories = [
  'All',
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Other'
]

const months = [
  'All', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function ExpenseFilter({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  filterMonth,
  setFilterMonth
}: ExpenseFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Input
        type="text"
        placeholder="Search expenses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow"
      />
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category.toLowerCase()}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filterMonth !== null ? filterMonth.toString() : ''} onValueChange={(value) => setFilterMonth(value === '' ? null : parseInt(value))}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month, index) => (
            <SelectItem key={index - 1} value={(index - 1).toString()}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

