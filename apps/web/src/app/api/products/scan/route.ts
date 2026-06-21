import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.OPENAI_API_KEY ?? "";
const BASE_URL = process.env.OPENAI_BASE_URL ?? "https://openrouter.ai/api/v1";

async function callAI(messages: object[], maxTokens = 2000) {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ model: "openai/gpt-4o", messages, max_tokens: maxTokens }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, skinTone, skinType } = await req.json();
    if (!imageBase64) return NextResponse.json({ error: "No image" }, { status: 400 });
    if (!API_KEY) return NextResponse.json({ error: "API key not set" }, { status: 500 });

    // Step 1: OCR ingredients from image
    const ingredientText = await callAI([
      {
        role: "user",
        content: [
          { type: "image_url", image_url: { url: imageBase64, detail: "high" } },
          { type: "text", text: "Extract ALL ingredients from this beauty product label. Return ONLY a comma-separated ingredient list. If no ingredients visible, reply: NOT_FOUND" },
        ],
      },
    ], 600);

    if (!ingredientText || ingredientText.includes("NOT_FOUND") || ingredientText.length < 5) {
      return NextResponse.json({
        scanId: `scan_${Date.now()}`,
        ingredients: [], safetyScore: 0, pregnancySafetyScore: 0,
        sensitiveSkinScore: 0, harmfulChemicals: [], skinToneMatch: null,
        summary: "No ingredient list found. Please point the camera clearly at the ingredient label on the product.",
      });
    }

    // Step 2: Analyze ingredients
    const skinCtx = [skinTone, skinType].filter(Boolean).join(", ");
    const raw = await callAI([
      {
        role: "system",
        content: "You are a cosmetic chemist. Analyze ingredients for safety. Flag parabens, sulfates, formaldehyde, synthetic fragrance, phthalates, phenoxyethanol, hydroquinone, oxybenzone as harmful. Return ONLY valid JSON.",
      },
      {
        role: "user",
        content: `Analyze these cosmetic ingredients${skinCtx ? ` for ${skinCtx} skin` : ""}:\n\n${ingredientText}\n\nReturn:\n{\n  "ingredients": [{"name":"...","function":"...","riskLevel":"safe|moderate|high","description":"...","concerns":[],"isHarmful":false,"ewg":1}],\n  "safetyScore":0-100,\n  "pregnancySafetyScore":0-100,\n  "sensitiveSkinScore":0-100,\n  "summary":"..."\n}`,
      },
    ], 3000);

    const match = raw.match(/\{[\s\S]*\}/);
    const analysis = JSON.parse(match?.[0] ?? "{}");

    const harmful = (analysis.ingredients ?? [])
      .filter((i: { isHarmful?: boolean; riskLevel?: string }) => i.isHarmful || i.riskLevel === "high")
      .map((i: { name: string; riskLevel: string; concerns: string[]; description: string }) => ({
        name: i.name, riskLevel: i.riskLevel, concerns: i.concerns ?? [], description: i.description,
      }));

    let skinToneMatch = null;
    if (skinCtx) {
      const score = harmful.length > 0
        ? Math.max((analysis.safetyScore ?? 70) - 12, 0)
        : (analysis.safetyScore ?? 70);
      skinToneMatch = {
        score,
        message: score >= 80 ? `Great match for your ${skinCtx} skin`
          : score >= 60 ? `Use with caution for your ${skinCtx} skin`
          : `Not recommended for your ${skinCtx} skin`,
      };
    }

    return NextResponse.json({
      scanId: `scan_${Date.now()}`,
      ingredientText,
      ingredients: analysis.ingredients ?? [],
      safetyScore: analysis.safetyScore ?? 0,
      pregnancySafetyScore: analysis.pregnancySafetyScore ?? 0,
      sensitiveSkinScore: analysis.sensitiveSkinScore ?? 0,
      harmfulChemicals: harmful,
      skinToneMatch,
      summary: analysis.summary ?? "",
    });
  } catch (err) {
    console.error("Scan error:", err);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
