import Groq from "groq-sdk";
import { NextRequest } from "next/server";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are a senior market research analyst. You provide detailed, data-driven responses to questions about financial markets, economics, and investing.

Your responses should:
- Be thorough and well-structured with clear sections
- Include relevant data points, historical context, and statistical evidence
- Present multiple perspectives and potential scenarios
- Use markdown formatting: headers (##), bullet points, bold for key terms, tables where useful
- Include a "Key Takeaways" section at the end
- Cite specific metrics, ratios, or indicators when relevant
- Note any caveats or limitations in the analysis

Cover all major asset classes: equities, fixed income, crypto, commodities, FX, and prediction markets.`;

export async function POST(req: NextRequest) {
  const { question } = await req.json();

  if (!question || typeof question !== "string" || question.trim().length === 0) {
    return Response.json({ error: "Question is required" }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return Response.json(
      { error: "GROQ_API_KEY not set. Add it to .env.local" },
      { status: 500 }
    );
  }

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: question.trim() },
    ],
    max_tokens: 4096,
    temperature: 0.3,
  });

  const text = completion.choices[0]?.message?.content || "No response generated.";

  return Response.json({ answer: text });
}
