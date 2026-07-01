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

function normalize(type: string) {
  return type
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
}

export function validateDocuments(
  category: string,
  uploaded: any[]
) {
  const required =
    (REQUIRED[category] || []).map(normalize);

  const uploadedTypes = uploaded.map((d) =>
    normalize(d.documentType || "")
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