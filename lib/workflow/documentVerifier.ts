import policy from "../../data/policy_terms.json";

export function verifyDocuments(claim: any) {

  const claimType =
    claim.category?.toUpperCase();

  const requirement =
    (policy.document_requirements as any)[claimType];

  if (!requirement) {

    return {
      success: false,
      trace: {
        step: "Document Verification",
        status: "FAIL",
        message:
          "Unknown claim category",
      },
    };
  }

  const uploadedDocs =
    claim.documents?.map(
      (d: any) => d.type
    ) || [];

  const missingDocs =
    requirement.required.filter(
      (doc: string) =>
        !uploadedDocs.includes(doc)
    );

  if (missingDocs.length) {

    return {
      success: false,
      trace: {
        step: "Document Verification",
        status: "FAIL",
        message:
          `Missing documents: ${missingDocs.join(", ")}`,
      },
    };
  }

  const unreadable =
    claim.documents?.find(
      (d: any) =>
        d.readable === false
    );
  
  const wrongDocument =
      claim.documents?.find(
        (d: any) =>
          d.expectedType &&
          d.expectedType !== d.type
      );

    if (wrongDocument) {
      return {
        success: false,
        trace: {
          step: "Document Verification",
          status: "FAIL",
          message: `Expected ${wrongDocument.expectedType} but received ${wrongDocument.type}`,
        },
      };
    }

  if (unreadable) {

    return {
      success: false,
      trace: {
        step: "Document Verification",
        status: "FAIL",
        message:
          `${unreadable.type} is unreadable`,
      },
    };
  }

  return {
    success: true,
    trace: {
      step: "Document Verification",
      status: "PASS",
      message:
        "All required documents verified",
    },
  };
}