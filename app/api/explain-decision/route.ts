import { NextRequest, NextResponse } from "next/server";
import { explainDecision } from "@/lib/ai/explainer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const explanation = await explainDecision(body.result);

    return NextResponse.json({
      success: true,
      explanation,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        explanation: "Unable to explain decision.",
      },
      { status: 500 }
    );
  }
}