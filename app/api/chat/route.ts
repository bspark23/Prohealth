import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json(); // Expecting messages array directly

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required and cannot be empty' }, { status: 400 });
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      console.error("OpenRouter API key is missing or empty. Please ensure OPENROUTER_API_KEY is set.");
      return NextResponse.json({ error: 'OpenRouter API key not configured.' }, { status: 500 });
    }
    console.log("OpenRouter API Key status: Present (masked)");

    // Enhanced system prompt for PropHealth AI assistant
    const systemPrompt = `You are PropHealth AI, a compassionate healthcare assistant for patients in Africa. You provide:

1. Supportive, empathetic responses to health concerns
2. General health guidance and wellness tips
3. Clear explanations of symptoms and when to seek medical care
4. Culturally sensitive advice appropriate for African healthcare contexts
5. Encouragement to consult qualified healthcare providers for serious concerns

Important guidelines:
- Always be warm, understanding, and professional
- Never diagnose or prescribe medications
- Encourage seeking professional medical care when appropriate
- Provide practical health advice suitable for resource-limited settings
- Be mindful of common health challenges in Africa
- End consultations with a brief summary of key points discussed

Remember: You're creating consultation records that will be stored securely on blockchain for future reference by healthcare providers.`;

    const messagesToSend = [{ role: "system", content: systemPrompt }, ...messages];

    const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",       // Re-added for OpenRouter metadata
        "X-Title": "PropHealth dApp",                   // Updated for PropHealth
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct", // Using the specified model
        messages: messagesToSend, // Using messages with system prompt
        temperature: 0.7, // Re-added for controlled output
        max_tokens: 1000, // Re-added for controlled output length
      }),
    });

    const rawText = await openRouterRes.text(); // Read as text first
    console.log("🔎 Raw OpenRouter response:", rawText); // Log raw response for debugging

    try {
      const parsed = JSON.parse(rawText);

      if (!openRouterRes.ok) {
        console.error("OpenRouter API returned an error (HTTP status not OK):", parsed);
        const errorMessage = parsed.message || parsed.error?.message || `OpenRouter API error: ${openRouterRes.statusText}`;
        return NextResponse.json(
          {
            error: `Failed to get AI response: ${errorMessage}`,
            details: parsed,
          },
          { status: openRouterRes.status }
        );
      }

      const aiResponseContent = parsed.choices?.[0]?.message?.content;
      if (!aiResponseContent) {
        console.error("OpenRouter response missing expected content:", parsed);
        return NextResponse.json(
          {
            error: "AI response content not found in OpenRouter data.",
            details: parsed,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({ response: aiResponseContent }, { status: 200 });

    } catch (parseError) {
      console.error("❌ Failed to parse JSON from OpenRouter:", parseError);
      return NextResponse.json(
        { error: "Invalid response format from OpenRouter API.", raw: rawText },
        { status: 500 }
      );
    }

  } catch (err) {
    console.error("❌ Request to OpenRouter failed:", err);
    return NextResponse.json(
      { error: "Failed to connect to OpenRouter API." },
      { status: 502 }
    );
  }
}