import { NextRequest } from "next/server";

const API_KEY = process.env.OPENAI_API_KEY ?? "";
const BASE_URL = process.env.OPENAI_BASE_URL ?? "https://openrouter.ai/api/v1";

export async function POST(req: NextRequest) {
  const { message, history = [], context = {} } = await req.json();
  if (!message?.trim()) return new Response("Missing message", { status: 400 });

  const systemPrompt = `You are GlowIQ, an expert AI beauty and skincare assistant. Be warm, concise, and practical.
${context.skinTone ? `User skin tone: ${context.skinTone}.` : ""}
${context.skinType ? `User skin type: ${context.skinType}.` : ""}
${context.concerns?.length ? `Concerns: ${context.concerns.join(", ")}.` : ""}
Keep responses under 120 words. Recommend a dermatologist for medical concerns.`;

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-4o",
      max_tokens: 300,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-10).map((m: { role: string; content: string }) => ({
          role: m.role, content: m.content,
        })),
        { role: "user", content: message },
      ],
    }),
  });

  if (!res.ok || !res.body) {
    return new Response("AI request failed", { status: 500 });
  }

  // Pass the SSE stream directly to the client, extracting only text tokens
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const readable = new ReadableStream({
    async start(controller) {
      const reader = res.body!.getReader();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const token = JSON.parse(data)?.choices?.[0]?.delta?.content;
            if (token) controller.enqueue(encoder.encode(token));
          } catch {}
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
