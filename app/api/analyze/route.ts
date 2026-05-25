import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
  }

  try {
    const [jobs, expenses] = await Promise.all([
      prisma.job.findMany({ where: { userId: session.user.id, isActive: true } }),
      prisma.expense.findMany({ 
        where: { 
          userId: session.user.id,
          date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        } 
      })
    ]);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Ты — профессиональный финансовый консультант. Проанализируй финансовое состояние пользователя и дай рекомендации на русском языке.
      
      Доходы (активные источники):
      ${jobs.map(j => `- ${j.title}: ${j.monthlySalary} сум`).join("\n")}
      
      Расходы за текущий месяц:
      ${expenses.map(e => `- ${e.category} (${e.description || "без описания"}): ${e.amount} сум`).join("\n")}
      
      Общий доход: ${jobs.reduce((sum, j) => sum + j.monthlySalary, 0)} сум
      Общий расход: ${expenses.reduce((sum, e) => sum + e.amount, 0)} сум
      
      Пожалуйста, предоставь:
      1. Краткий анализ текущей ситуации.
      2. 3 конкретных совета по экономии или увеличению дохода.
      3. Прогноз на следующий месяц.
      
      Ответ должен быть в формате JSON: { "analysis": "текст", "tips": ["совет 1", "совет 2", "совет 3"], "forecast": "текст" }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Attempt to parse JSON from the response
    try {
      const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
      const analysisData = JSON.parse(jsonStr);
      return NextResponse.json(analysisData);
    } catch (e) {
      return NextResponse.json({ analysis: text, tips: [], forecast: "" });
    }

  } catch (error) {
    console.error("Gemini analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze finances" }, { status: 500 });
  }
}
