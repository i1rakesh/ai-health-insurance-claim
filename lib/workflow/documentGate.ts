const REQUIRED: Record<string, string[]> = {
  consultation: [
    "PRESCRIPTION",
    "HOSPITAL_BILL",
  ],

  pharmacy: [
    "PRESCRIPTION",
    "PHARMACY_BILL",
  ],

  diagnostic: [
    "PRESCRIPTION",
    "LAB_REPORT",
  ],

  dental: [
    "HOSPITAL_BILL",
  ],
};

export function validateDocuments(
  category: string,
  uploaded: any[]
) {
  const required = REQUIRED[category] || [];

  const uploadedTypes = uploaded.map(
    (d) => d.documentType
  );

  const missing = required.filter(
    (doc) => !uploadedTypes.includes(doc)
  );

  return {
    success: missing.length === 0,

    missing,

    uploaded: uploadedTypes,
  };
}