import { GoogleGenAI } from "@google/genai";
import { Transaction, AiTip } from "../types";

const processEnvApiKey = process.env.API_KEY;

// Fallback mock tips in case API fails or key is missing
const MOCK_TIPS: AiTip[] = [
  {
    title: "Track Small Expenses",
    description: "Small daily purchases like coffee add up. Try making coffee at home to save ~$100/month.",
    icon: "idea"
  },
  {
    title: "Review Recurring Bills",
    description: "You have multiple entertainment charges. Check if you are using all your streaming services.",
    icon: "alert"
  },
  {
    title: "Emergency Fund",
    description: "Great job on your savings this month! Consider moving 20% to a high-yield savings account.",
    icon: "check"
  }
];

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<AiTip[]> => {
  if (!processEnvApiKey) {
    console.warn("No API Key found, returning mock data.");
    return MOCK_TIPS;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: processEnvApiKey });
    
    // Prepare data summary for the prompt
    const expenses = transactions.filter(t => t.type === 'expense');
    const recentExpenses = expenses.slice(0, 10).map(t => `${t.category}: $${t.amount}`).join(', ');
    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    
    const prompt = `
      You are a financial advisor. Analyze these recent expenses: ${recentExpenses}. Total spent: ${totalExpense}.
      Provide 3 specific, actionable, and short tips to help the user save money.
      One of the tips MUST be titled "Review Recurring Bills" if there are any recurring-looking payments.
      Return the response as a JSON array of objects with the following shape:
      [
        { "title": "Tip Title", "description": "Short description (max 20 words)", "icon": "idea" | "alert" | "check" }
      ]
      Do not wrap in markdown code blocks. Just return raw JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) return MOCK_TIPS;

    const tips = JSON.parse(text) as AiTip[];
    return tips;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return MOCK_TIPS;
  }
};