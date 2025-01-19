import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GENERATIVE_AI_API_KEY || '')

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

export async function getBudgetSuggestions(remainingBudget: number, overallBudget: number): Promise<Record<string, number>> {
  const prompt = `As a financial advisor, provide suggestions for allocating the remaining budget of ₹${remainingBudget} out of the overall monthly budget of ₹${overallBudget}. Suggest allocations for these categories: Housing, Transportation, Food, Utilities, Healthcare, Entertainment, Shopping, and Savings. Respond with a JSON object where keys are categories and values are suggested amounts in rupees. Round all amounts to the nearest whole number. Do not include any additional text or formatting in your response, only the JSON object.`

  const response = await generateAIResponse(prompt)
  try {
    // Remove any potential markdown formatting
    const cleanedResponse = response.replace(/\`\`\`json\s*|\s*\`\`\`/g, '').trim()
    const suggestions = JSON.parse(cleanedResponse)
    return suggestions
  } catch (error) {
    console.error('Error parsing AI suggestions:', error)
    console.error('Raw response:', response)
    throw new Error('Failed to parse AI suggestions')
  }
}

export async function getInvestmentSuggestions(): Promise<string[]> {
  const prompt = `Generate 5 beginner-friendly investment suggestions for the Indian market. 
  Format your response EXACTLY as a valid JSON array of strings.
  Example format: ["suggestion 1", "suggestion 2", "suggestion 3"]
  Each suggestion should be clear and actionable.`

  try {
    const response = await generateAIResponse(prompt)
    const jsonStr = response.trim().replace(/^\`\`\`json\s*|\s*\`\`\`$/g, '').trim()
    const suggestions = JSON.parse(jsonStr)
    
    if (!Array.isArray(suggestions) || suggestions.some(item => typeof item !== 'string')) {
      throw new Error('Invalid response format')
    }
    
    return suggestions.slice(0, 5)
  } catch (error) {
    console.error('Error parsing investment suggestions:', error)
    return [
      "Start with a low-cost index fund that tracks the Nifty 50",
      "Open and max out a Public Provident Fund (PPF) account",
      "Invest in government bonds through the RBI Retail Direct platform",
      "Consider low-cost ETFs for diversification in the Indian market",
      "Begin with small, regular investments in Systematic Investment Plans (SIPs)"
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

