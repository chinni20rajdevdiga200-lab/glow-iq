import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.OPENAI_API_KEY ?? "";
const BASE_URL = process.env.OPENAI_BASE_URL ?? "https://openrouter.ai/api/v1";

async function callAI(messages: object[], maxTokens = 2000) {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({ model: "openai/gpt-4o", messages, max_tokens: maxTokens }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) return NextResponse.json({ error: "No image" }, { status: 400 });
    if (!API_KEY) return NextResponse.json({ error: "API key not configured" }, { status: 500 });

    const raw = await callAI([
      {
        role: "system",
        content: "You are an expert AI dermatologist. Analyze the face image and return ONLY valid JSON. Be accurate and kind.",
      },
      {
        role: "user",
        content: [
          { type: "image_url", image_url: { url: imageBase64, detail: "high" } },
          {
            type: "text",
            text: `Analyze this face and return ONLY this JSON:
{
  "skinTone": "fair|light|medium|olive|tan|deep",
  "undertone": "cool|warm|neutral",
  "skinType": "dry|oily|combination|normal|sensitive",
  "hexColor": "#XXXXXX",
  "overallScore": 70-95,
  "metrics": {
    "hydration": 0-100,
    "oiliness": 0-100,
    "texture": 0-100,
    "sensitivity": 0-100,
    "sunDamage": 0-100
  },
  "concerns": ["concern1", "concern2"],
  "tips": ["tip1", "tip2", "tip3"],
  "routineSuggestion": "one sentence routine suggestion"
}`,
          },
        ],
      },
    ], 1000);

    const match = raw.match(/\{[\s\S]*\}/);
    const result = JSON.parse(match?.[0] ?? "{}");

    return NextResponse.json({ scanId: `face_${Date.now()}`, ...result });
  } catch (err) {
    console.error("Face scan error:", err);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
