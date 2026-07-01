import policy from "../../data/policy_terms.json";
import { getMember, daysBetween } from "../policy/helper";

export function evaluatePolicy(claim: any) {
  const category = claim.category?.toLowerCase();

  const rules = (policy.opd_categories as any)[category];

  if (!rules) {
    return {
      success: false,
      approvedAmount: 0,
      trace: {
        step: "Policy Validation",
        status: "FAIL",
        message: "Category not covered",
      },
    };
  }

  // TC012
  const diagnosis = claim.diagnosis?.toLowerCase() || "";


  if (diagnosis.includes("obesity")) {
    return {
      success: false,
      approvedAmount: 0,
      trace: {
        step: "Policy Validation",
        status: "FAIL",
        message: "Obesity treatment excluded",
      },
    };
  }

  // TC005
  if (diagnosis.includes("diabetes")) {
    const member = getMember(claim.memberId);

    if (member) {
      const days = daysBetween(
        member.join_date!,
        claim.treatmentDate!
      );

      if (days < 90) {
        return {
          success: false,
          approvedAmount: 0,
          trace: {
            step: "Policy Validation",
            status: "FAIL",
            message: "Diabetes waiting period not completed",
          },
        };
      }
    }
  }

  // TC007
  if (
    category === "diagnostic" &&
    claim.testName === "MRI" &&
    claim.claimedAmount > 10000 &&
    !claim.preAuth
  ) {
    return {
      success: false,
      approvedAmount: 0,
      trace: {
        step: "Policy Validation",
        status: "FAIL",
        message: "MRI requires pre authorization",
      },
    };
  }

  let approved = claim.claimedAmount;

  // TC010
  if (policy.network_hospitals.includes(claim.hospitalName)) {
    approved = approved * (1 - rules.network_discount_percent / 100);
  }
  // TC006 - Partial Approval

  if (category === "dental" && claim.procedures?.length) {
    const coveredProcedures = policy.opd_categories.dental.covered_procedures;

    let approvedAmount = 0;

    for (const procedure of claim.procedures) {
      if (coveredProcedures.includes(procedure.name)) {
        approvedAmount += procedure.amount;
      }
    }

    return {
      success: true,
      partial: approvedAmount < claim.claimedAmount,

      approvedAmount,

      trace: {
        step: "Policy Validation",
        status: "PASS",
        message: `Dental coverage approved ₹${approvedAmount}`,
      },
    };
  }

    // TC008
  if (claim.claimedAmount > policy.coverage.per_claim_limit) {
    return {
      success: false,
      approvedAmount: 0,
      trace: {
        step: "Policy Validation",
        status: "FAIL",
        message: "Per claim limit exceeded",
      },
    };
  }

  
  // TC004

  approved = approved * (1 - rules.copay_percent / 100);

  return {
    success: true,
    approvedAmount: Math.round(approved),
    trace: {
      step: "Policy Validation",
      status: "PASS",
      message: "Policy validation successful",
    },
  };
}
