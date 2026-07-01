import { verifyDocuments } from "./documentVerifier";
import { checkConsistency } from "./consistencyChecker";
import { evaluatePolicy } from "./policyEngine";
import { detectFraud } from "./fraudDetector";

export async function processClaim(claim: any) {
  const trace = [];

  const warnings: string[] = [];

  let confidence = 1.0;

  // -------------------------
  // Document Verification
  // -------------------------

  const docs = verifyDocuments(claim);

  trace.push(docs.trace);

  if (!docs.success) {
    return {
      decision: "INCOMPLETE",
      approvedAmount: 0,
      confidence: 0.95,
      reason: docs.trace.message,
      warnings,
      trace,
    };
  }

  // -------------------------
  // Consistency Check
  // -------------------------

  const consistency = checkConsistency(claim);

  trace.push(consistency.trace);

  if (!consistency.success) {
    return {
      decision: "INCOMPLETE",
      approvedAmount: 0,
      confidence: 0,
      reason: consistency.trace.message,
      trace,
    };
  }

  // -------------------------
  // Policy Validation
  // -------------------------

  const policy = evaluatePolicy(claim);

  trace.push(policy.trace);

  if (!policy.success) {
    return {
      decision: "REJECTED",
      approvedAmount: 0,
      confidence: 0.92,
      reason: policy.trace.message,
      warnings,
      trace,
    };
  }

  // -------------------------
  // Fraud Detection
  // -------------------------

  const fraud = detectFraud(claim);

  trace.push(fraud.trace);

  if (fraud.manualReview) {
    warnings.push("High fraud score detected.");

    return {
      decision: "MANUAL_REVIEW",
      approvedAmount: 0,
      confidence: 0.75,
      reason: fraud.trace.message,
      warnings,
      trace,
    };
  }

  // -------------------------
  // Confidence Calculation
  // -------------------------

  if (policy.partial) {
    confidence -= 0.05;
  }

  if (warnings.length > 0) {
    confidence -= 0.1;
  }

  confidence = Math.max(0.5, confidence);

  // -------------------------
  // Partial Approval
  // -------------------------

  if (policy.partial) {
    return {
      decision: "PARTIAL",
      approvedAmount: policy.approvedAmount,
      confidence: Number(confidence.toFixed(2)),
      reason: policy.trace.message,
      warnings,
      trace,
    };
  }

  // -------------------------
  // Approved
  // -------------------------

  return {
    decision: "APPROVED",
    approvedAmount: policy.approvedAmount,
    confidence: Number(confidence.toFixed(2)),
    reason: policy.trace.message,
    warnings,
    trace,
  };
}