import { NextRequest, NextResponse } from "next/server";
import { validateDocuments } from "@/lib/workflow/documentGate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = validateDocuments(
      body.category,
      body.documents
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        success: false,
        missing: [],
      },
      { status: 500 }
    );
  }
}