import OpenAI from "openai";
import { AIExtractionResult } from "@/types/ai";


const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

interface UploadedFile {
  name: string;
  type: string;
  base64: string;
}

const SYSTEM_PROMPT = `
You are an expert Indian Health Insurance Claim Parser.

You receive one or more uploaded medical documents.

Documents may include:

- Hospital Bills
- Prescriptions
- Lab Reports
- Pharmacy Bills
- Diagnostic Reports

Some images may be blurry.
Some may contain handwriting.
Some values may be missing.

Never invent information.

Return ONLY valid JSON.

Schema:

{
  "patientName": null,
  "hospitalName": null,
  "doctorName": null,
  "diagnosis": null,
  "treatmentDate": null,
  "claimedAmount": null,
  "documents":[
    {
      "documentType":"",
      "patientName":null,
      "hospitalName":null,
      "doctorName":null,
      "diagnosis":null,
      "treatmentDate":null,
      "claimedAmount":null
    }
  ],
  "confidence":0.0,
  "warnings":[]
}

Rules:

- confidence between 0 and 1
- warnings should mention blurry images, unreadable text, missing fields etc.
- Never explain.
- Never return markdown.
`;

export async function extractMedicalData(
  files: UploadedFile[]
): Promise<AIExtractionResult> {
  try {
    const content: any[] = [
      {
        type: "text",
        text:
          "Extract structured claim information from all uploaded medical documents.",
      },
    ];

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        content.push({
          type: "image_url",
          image_url: {
            url: `data:${file.type};base64,${file.base64}`,
          },
        });
      }
}
  
    const completion = await client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL!,
      temperature: 0,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content,
        },
      ],
      max_tokens: 4000,
      response_format: {
        type: "json_object",
      },
    });

    const raw = completion.choices[0].message.content;

    if (!raw) {
      throw new Error("Empty AI response");
    }

    const parsed = JSON.parse(raw);

    return {
      success: true,
      confidence: parsed.confidence ?? 0,
      extractedData: {
        patientName: parsed.patientName ?? null,
        hospitalName: parsed.hospitalName ?? null,
        diagnosis: parsed.diagnosis ?? null,
        treatmentDate: parsed.treatmentDate ?? null,
        claimedAmount: parsed.claimedAmount ?? null,
        documents: parsed.documents ?? [],
      },
      warnings: [
        ...(parsed.warnings ?? [])
      ],
      rawResponse: raw,
    };
  } catch (error: any) {
    console.error("AI Extraction Error:", error);

    return {
      success: false,
      confidence: 0,
      extractedData: {
        patientName: null,
        hospitalName: null,
        diagnosis: null,
        treatmentDate: null,
        claimedAmount: null,
        documents: [],
      },
      warnings: [
        "AI extraction failed.",
        error?.message ?? "Unknown error",
      ],
    };
  }
}