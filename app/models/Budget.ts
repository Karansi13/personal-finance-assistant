import mongoose from 'mongoose'

const BudgetSchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

BudgetSchema.index({ userId: 1, month: 1, year: 1, category: 1 }, { unique: true })

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema)

