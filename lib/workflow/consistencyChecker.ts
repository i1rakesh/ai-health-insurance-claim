export function checkConsistency(claim: any) {
  const names = claim.documents
    ?.map((d: any) => d.patientName)
    .filter(Boolean);

  const uniqueNames = [...new Set(names)];

  if (uniqueNames.length > 1) {
    return {
      success: false,
      trace: {
        step: "Consistency Check",
        status: "FAIL",
        message: `Patient mismatch detected: ${uniqueNames.join(
          ", "
        )}`,
      },
    };
  }

  return {
    success: true,
    trace: {
      step: "Consistency Check",
      status: "PASS",
      message: "Patient names match",
    },
  };
}