export interface ExtractedDocument {
  filename?: string;

  documentType: string;

  confidence: number;

  patientName: string | null;

  hospitalName: string | null;

  doctorName: string | null;

  diagnosis: string | null;

  treatmentDate: string | null;

  claimedAmount: number | null;
}

export interface AIExtractionResult {
  success: boolean;
  confidence: number;

  extractedData: {
    patientName: string | null;
    hospitalName: string | null;
    diagnosis: string | null;
    treatmentDate: string | null;
    claimedAmount: number | null;
    documents: ExtractedDocument[];
  };

  warnings: string[];

  rawResponse?: string;
}
