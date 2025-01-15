import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GENERATIVE_AI_API_KEY || '')

// Get the generative model
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

async function generateAIResponse(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid AI response')
    }
    
    return text
  } catch (error) {
    console.error('Error generating AI response:', error)
    throw new Error('Failed to process request with AI')
  }
}

export async function categorizeExpense(description: string): Promise<string> {
  const prompt = `You are a financial expense categorizer. Categorize the following expense into one of these categories: Housing, Transportation, Food, Utilities, Healthcare, Entertainment, Shopping, or Other. Only respond with the category name.
  Expense: "${description}"`
  
  return generateAIResponse(prompt)
}

export async function getBudgetSuggestions(): Promise<Record<string, number>> {
  const prompt = `Create a suggested monthly budget distribution across these categories: Housing, Transportation, Food, Utilities, Healthcare, Entertainment, Shopping, and Other. Respond only with a JSON object where keys are categories and values are suggested percentage allocations. The percentages should sum to 100. Format your response EXACTLY as a valid JSON object without any markdown formatting.
  Example format: {"Housing": 30, "Transportation": 15, "Food": 15, "Utilities": 10, "Healthcare": 10, "Entertainment": 10, "Shopping": 5, "Other": 5}`
  
  try {
    const response = await generateAIResponse(prompt)
    // Remove any potential markdown formatting
    const jsonStr = response.replace(/^\`\`\`json\s*|\s*\`\`\`$/gm, '').trim()
    
    let budget: Record<string, number>
    
    try {
      budget = JSON.parse(jsonStr)
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError)
      throw new Error('Invalid budget format')
    }
    
    // Validate that we received an object with numeric values
    if (typeof budget !== 'object' || Object.values(budget).some(value => typeof value !== 'number')) {
      throw new Error('Invalid budget format')
    }
    
    // Ensure all required categories are present
    const requiredCategories = ['Housing', 'Transportation', 'Food', 'Utilities', 'Healthcare', 'Entertainment', 'Shopping', 'Other']
    for (const category of requiredCategories) {
      if (!(category in budget)) {
        throw new Error(`Missing required category: ${category}`)
      }
    }
    
    return budget
  } catch (error) {
    console.error('Error getting budget suggestions:', error)
    // Provide a default budget if AI fails
    return {
      Housing: 30,
      Transportation: 15,
      Food: 15,
      Utilities: 10,
      Healthcare: 10,
      Entertainment: 10,
      Shopping: 5,
      Other: 5
    }
  }
}

export async function getInvestmentSuggestions(): Promise<string[]> {
  const prompt = `Generate 5 beginner-friendly investment suggestions. 
  Format your response EXACTLY as a valid JSON array of strings.
  Example format: ["suggestion 1", "suggestion 2", "suggestion 3"]
  Each suggestion should be clear and actionable.`
  
  try {
    const response = await generateAIResponse(prompt)
    // Clean the response to ensure it only contains the JSON array
    const jsonStr = response.trim().replace(/^\`\`\`json\s*|\s*\`\`\`$/g, '').trim()
    const suggestions = JSON.parse(jsonStr)
    
    // Validate that we received an array of strings
    if (!Array.isArray(suggestions) || suggestions.some(item => typeof item !== 'string')) {
      throw new Error('Invalid response format')
    }
    
    return suggestions.slice(0, 5)
  } catch (error) {
    console.error('Error parsing investment suggestions:', error)
    // Provide default suggestions if AI fails
    return [
      "Start with a low-cost index fund that tracks the S&P 500",
      "Open and max out a tax-advantaged retirement account (401k/IRA)",
      "Build an emergency fund in a high-yield savings account",
      "Consider low-cost ETFs for diversification",
      "Begin with small, regular investments using dollar-cost averaging"
    ]
  }
}

export async function detectUnusualSpending(expenses: any[]): Promise<string | null> {
  const expensesJson = JSON.stringify(expenses)
  const prompt = `Analyze these expenses for unusual patterns: ${expensesJson}. If you find unusual patterns, describe them briefly. If not, respond exactly with "No unusual patterns detected."`
  
  try {
    const response = await generateAIResponse(prompt)
    return response === "No unusual patterns detected." ? null : response
  } catch (error) {
    console.error('Error detecting unusual spending:', error)
    return null
  }
}

