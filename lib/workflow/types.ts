export type PolicyResult = {
  success: boolean;

  approvedAmount: number;

  reason?: string;

  trace: {
    step: string;
    status: "PASS" | "FAIL";
    message: string;
  };
};