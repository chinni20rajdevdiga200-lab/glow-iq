import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import type { Scan } from "@prisma/client";

export interface FaceAnalysisResult {
  skinTone: string;
  undertone: string;
  skinType: string;
  hexColor: string;
  rgb: { r: number; g: number; b: number };
  beautyScore: number;
  skinHealthScore: number;
  concerns: Array<{
    type: string;
    severity: "none" | "mild" | "moderate" | "severe";
    score: number;
    description: string;
    tips: string[];
  }>;
  foundationShades: Array<{ brand: string; shade: string; hex: string; matchScore: number }>;
  recommendations: string[];
}

export interface IngredientAnalysisResult {
  ingredients: Array<{
    name: string;
    inci: string;
    function: string;
    riskLevel: "safe" | "moderate" | "high";
    description: string;
    concerns: string[];
    isHarmful: boolean;
  }>;
  safetyScore: number;
  pregnancySafetyScore: number;
  sensitiveSkinScore: number;
  summary: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: OpenAI;

  constructor(private config: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.config.get<string>("OPENAI_API_KEY"),
    });
  }

  async analyzeFace(imageBase64: string): Promise<FaceAnalysisResult> {
    this.logger.log("Starting face analysis with GPT-4V");

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content: `You are an expert AI dermatologist and beauty analyst. Analyze the provided face image and return a detailed JSON analysis. Be precise, professional, and compassionate. Always return valid JSON matching the exact structure requested.`,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageBase64, detail: "high" },
            },
            {
              type: "text",
              text: `Analyze this face image and return ONLY valid JSON with this exact structure:
{
  "skinTone": "fair|light|medium|olive|tan|deep",
  "undertone": "cool|warm|neutral",
  "skinType": "dry|oily|combination|normal|sensitive",
  "hexColor": "#XXXXXX",
  "rgb": { "r": 0-255, "g": 0-255, "b": 0-255 },
  "beautyScore": 0-100,
  "skinHealthScore": 0-100,
  "concerns": [
    {
      "type": "acne|dark_spots|pigmentation|wrinkles|eye_bags|pores|dryness|oiliness|redness|uneven_texture",
      "severity": "none|mild|moderate|severe",
      "score": 0-100,
      "description": "brief description",
      "tips": ["tip1", "tip2"]
    }
  ],
  "foundationShades": [
    { "brand": "brand name", "shade": "shade code", "hex": "#XXXXXX", "matchScore": 0-100 }
  ],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}

Include ALL 10 concern types. Foundation shades: provide 5 matching shades from MAC, Fenty, NARS, Maybelline, L'Oreal.`,
            },
          ],
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch?.[0] ?? "{}") as FaceAnalysisResult;
  }

  async analyzeIngredients(ingredientText: string): Promise<IngredientAnalysisResult> {
    const harmfulIngredients = [
      "paraben", "methylparaben", "propylparaben", "butylparaben",
      "sulfate", "sodium lauryl sulfate", "sls", "sodium laureth sulfate", "sles",
      "phthalate", "dibutyl phthalate", "diethyl phthalate",
      "formaldehyde", "formalin", "quaternium-15", "dmdm hydantoin",
      "hydroquinone", "mercury", "thimerosal", "triclosan",
      "polyethylene glycol", "peg-", "synthetic fragrance", "parfum",
      "oxybenzone", "octinoxate", "petrolatum", "mineral oil",
      "bha", "bht", "coal tar", "lead acetate", "aluminum",
    ];

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 3000,
      messages: [
        {
          role: "system",
          content: `You are an expert cosmetic chemist and ingredient safety analyst. Analyze cosmetic ingredients for safety, function, and potential concerns. Cross-reference with EWG Skin Deep database knowledge. Known harmful ingredients to flag: ${harmfulIngredients.join(", ")}. Return valid JSON only.`,
        },
        {
          role: "user",
          content: `Analyze these cosmetic ingredients and return ONLY valid JSON:

INGREDIENTS: ${ingredientText}

Return this exact JSON structure:
{
  "ingredients": [
    {
      "name": "ingredient name",
      "inci": "INCI name",
      "function": "function in product",
      "riskLevel": "safe|moderate|high",
      "description": "what it does and why this risk level",
      "concerns": ["concern1", "concern2"],
      "isHarmful": false
    }
  ],
  "safetyScore": 0-100,
  "pregnancySafetyScore": 0-100,
  "sensitiveSkinScore": 0-100,
  "summary": "brief overall safety summary"
}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch?.[0] ?? "{}") as IngredientAnalysisResult;
  }

  async extractIngredientsFromImage(imageBase64: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: imageBase64, detail: "high" } },
            {
              type: "text",
              text: "Extract ALL ingredients from this product label or ingredients list image. Return ONLY the ingredient text, comma-separated, exactly as they appear. Include ALL ingredients visible.",
            },
          ],
        },
      ],
    });
    return response.choices[0]?.message?.content ?? "";
  }

  async generateRoutine(skinProfile: {
    skinTone: string;
    skinType: string;
    concerns: string[];
  }): Promise<{ morning: unknown[]; night: unknown[] }> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content: "You are an expert esthetician creating personalized skincare routines. Return valid JSON only.",
        },
        {
          role: "user",
          content: `Create a personalized skincare routine for:
- Skin tone: ${skinProfile.skinTone}
- Skin type: ${skinProfile.skinType}
- Main concerns: ${skinProfile.concerns.join(", ")}

Return JSON:
{
  "morning": [
    { "order": 1, "category": "cleanser", "productName": "...", "instruction": "...", "duration": "30 sec", "tip": "..." }
  ],
  "night": [...]
}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch?.[0] ?? '{"morning":[],"night":[]}');
  }

  async *streamChat(
    message: string,
    context: { skinTone?: string; skinType?: string; concerns?: string[] },
    history: Array<{ role: "user" | "assistant"; content: string }>
  ) {
    const systemPrompt = `You are BeautyIQ, an expert AI beauty and skincare assistant.
You provide evidence-based advice on skincare, beauty, cosmetic ingredients, and product recommendations.
Be warm, professional, and helpful. Always recommend consulting a dermatologist for medical concerns.

User's skin profile:
- Skin tone: ${context.skinTone ?? "unknown"}
- Skin type: ${context.skinType ?? "unknown"}
- Concerns: ${context.concerns?.join(", ") ?? "none specified"}

Keep responses concise, practical, and personalized to their skin profile.`;

    const stream = await this.openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 500,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-10),
        { role: "user", content: message },
      ],
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
  }

  async generateProductRecommendations(params: {
    skinTone: string;
    skinType: string;
    concerns: string[];
    budget: string;
    categories: string[];
  }): Promise<Array<{ name: string; brand: string; category: string; reason: string; matchScore: number }>> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content: "You are a beauty product expert. Recommend real, available products. Return valid JSON only.",
        },
        {
          role: "user",
          content: `Recommend products for:
- Skin: ${params.skinType} ${params.skinTone} tone
- Concerns: ${params.concerns.join(", ")}
- Budget: ${params.budget}
- Categories needed: ${params.categories.join(", ")}

Return JSON array:
[
  { "name": "...", "brand": "...", "category": "...", "reason": "why this suits them", "matchScore": 0-100 }
]

Recommend 2 products per category. Prioritize clean, safe ingredients.`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "[]";
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    return JSON.parse(jsonMatch?.[0] ?? "[]");
  }
}
