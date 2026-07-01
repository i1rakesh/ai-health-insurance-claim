import { NextResponse } from "next/server";
import { processClaim } from "@/lib/workflow/engine";
import testData from "@/data/test_cases.json";

export async function GET() {
  const results = [];

  for (const tc of testData.test_cases) {
    try {
      const diagnosisDocument = tc.input.documents.find(
        (d: any) => d.content?.diagnosis
      );

      const claim = {
        memberId: tc.input.member_id,
        policyId: tc.input.policy_id,

        category: tc.input.claim_category.toLowerCase(),

        treatmentDate: tc.input.treatment_date,

        claimedAmount: tc.input.claimed_amount,

        diagnosis: diagnosisDocument?.content?.diagnosis,

        hospitalName: tc.input.documents.find(
          (d: any) => d.content?.hospital_name
        )?.content?.hospital_name,
        
        procedures:
        tc.input.documents
            .flatMap((d: any) =>
            d.content?.line_items ?? []
            )
            .map((item: any) => ({
            name: item.description,
            amount: item.amount,
            })),
        sameDayClaims:
          tc.input.claims_history?.length ?? 0,

        documents: tc.input.documents.map((d: any) => ({
          type: d.actual_type,
          expectedType: d.expected_type,
          readable:
            d.readable ??
            (d.quality !== "UNREADABLE"),
          patientName:
            d.content?.patient_name ??
            d.patient_name_on_doc ??
            null,
        })),
      };

      const output = await processClaim(claim);

      results.push({
        id: tc.case_id,
        name: tc.case_name,
        expected: tc.expected.decision ?? "DOCUMENT_ERROR",
        actual: output.decision,
        match:
          (tc.expected.decision === null &&
            output.decision === "INCOMPLETE") ||
          tc.expected.decision === output.decision,
        trace: output.trace,
      });
    } catch (e) {
      results.push({
        id: tc.case_id,
        name: tc.case_name,
        expected: tc.expected.decision ?? "UNKNOWN",
        actual: "ERROR",
        match: false,
        trace: [],
      });
    }
  }

  return NextResponse.json(results);
}