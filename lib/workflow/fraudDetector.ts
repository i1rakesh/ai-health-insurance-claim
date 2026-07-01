import policy from "../../data/policy_terms.json";

export function detectFraud(claim: any) {

  const sameDayClaims =
  (claim.sameDayClaims || 0) + 1;
  if (
    sameDayClaims >
    policy.fraud_thresholds.same_day_claims_limit
  ) {

    return {
      success: false,
      manualReview: true,
      trace: {
        step: "Fraud Analysis",
        status: "WARNING",
        message:
          "Same day claim threshold exceeded",
      },
    };
  }

  return {
    success: true,
    manualReview: false,
    trace: {
      step: "Fraud Analysis",
      status: "PASS",
      message: "No fraud signals detected",
    },
  };
}