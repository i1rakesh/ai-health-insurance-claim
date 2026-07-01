import { NextRequest, NextResponse } from "next/server";
import { extractMedicalData } from "@/lib/ai/extractor";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.files || !Array.isArray(body.files)) {
      return NextResponse.json(
        {
          success: false,
          message: "No files provided.",
        },
        { status: 400 }
      );
    }

    const result = await extractMedicalData(body.files);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Extract API Error:", error);

    return NextResponse.json(
      {
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
          "Unable to process uploaded documents.",
          error?.message ?? "Unknown server error",
        ],
      },
      { status: 500 }
    );
  }
}