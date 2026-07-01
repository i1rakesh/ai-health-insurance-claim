import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function explainDecision(result: any) {
  try {
    const prompt = `
You are an AI Claims Review Assistant.

Explain the insurance claim decision in simple English.

Decision:
${JSON.stringify(result, null, 2)}

Rules:
- Explain step by step.
- Mention every workflow stage.
- Explain why the final decision happened.
- Mention confidence if available.
- Keep it under 150 words.
- Do NOT invent information.
`;

    const response = await client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL!,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You explain health insurance claim decisions clearly.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error(error);

    return "Unable to generate explanation at this time.";
  }
}