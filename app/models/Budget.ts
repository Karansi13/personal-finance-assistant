import mongoose from 'mongoose'

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  overallBudget: {
    type: Number,
    required: true,
  },
  categories: {
    type: Map,
    of: Number,
    default: {},
  },
})

BudgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true })

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema)

