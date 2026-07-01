import { NextRequest, NextResponse } from "next/server";
import { processClaim } from "@/lib/workflow/engine";

export async function POST(req: NextRequest) {
  try {
    const claim = await req.json();

    const result = await processClaim(claim);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to process claim",
      },
      {
        status: 500,
      }
    );
  }
}