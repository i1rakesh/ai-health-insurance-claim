"use client";

import { useState } from "react";

import UploadDocuments from "./UploadDocuments";
import ClaimFields from "./ClaimFields";
import ResultCard from "./ResultCard";
import TraceCard from "./TraceCard";
import AIAnalysisCard from "./AIAnalysisCard";
import AIExplanationCard from "./AIExplanationCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClaimFormData {
  memberId: string;
  category: string;
  claimedAmount: number;
  diagnosis: string;
  treatmentDate: string;
  hospitalName: string;
}

export default function ClaimForm() {
  const [files, setFiles] = useState<File[]>([]);

  const [extracting, setExtracting] = useState(false);

  const [loading, setLoading] = useState(false);

  const [confidence, setConfidence] = useState<number | null>(null);

  const [warnings, setWarnings] = useState<string[]>([]);

  const [result, setResult] = useState<any>(null);

  const [aiData,setAiData]=useState<any>(null);

  const [form, setForm] = useState<ClaimFormData>({
    memberId: "EMP001",
    category: "consultation",
    claimedAmount: 1500,
    diagnosis: "",
    treatmentDate: "",
    hospitalName: "",
  });

  //---------------------------------------------
  // Convert file -> base64
  //---------------------------------------------

  function fileToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];

        resolve(base64);
      };

      reader.onerror = reject;
    });
  }

  //---------------------------------------------
  // AI Extraction
  //---------------------------------------------

  async function extractUsingAI() {
    if (files.length === 0) return;

    try {
      setExtracting(true);

      const converted = await Promise.all(
        files.map(async (file) => ({
          name: file.name,

          type: file.type,

          base64: await fileToBase64(file),
        })),
      );

      const response = await fetch("/api/ai-extract", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          files: converted,
        }),
      });

      const data = await response.json();

      console.log(data);

      if (!data.success) {
        alert("AI extraction failed.");

        return;
      }

      setConfidence(data.confidence);

      setWarnings(data.warnings || []);

      const extracted = data.extractedData;
      
      setAiData(extracted);

      const gateResponse = await fetch("/api/document-gate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: form.category,
          documents: extracted.documents,
        }),
      });

      const gate = await gateResponse.json();

      if (!gate.success) {
        alert(
          `Missing Documents:

${gate.missing.join(", ")}

Please upload them before continuing.`,
        );

        return;
      }

      setForm((prev) => ({
        ...prev,

        diagnosis: extracted.diagnosis ?? prev.diagnosis,

        hospitalName: extracted.hospitalName ?? prev.hospitalName,

        treatmentDate: extracted.treatmentDate ?? prev.treatmentDate,

        claimedAmount: extracted.claimedAmount ?? prev.claimedAmount,
      }));
    } catch (err) {
      console.error(err);

      alert("Unable to extract medical information.");
    } finally {
      setExtracting(false);
    }
  }

  //---------------------------------------------
  // Submit Claim
  //---------------------------------------------

  async function submitClaim() {
    try {
      setLoading(true);

      const documents = files.map((file) => ({
        type: file.name.toUpperCase().includes("PRESCRIPTION")
          ? "PRESCRIPTION"
          : file.name.toUpperCase().includes("LAB")
            ? "LAB_REPORT"
            : file.name.toUpperCase().includes("PHARMACY")
              ? "PHARMACY_BILL"
              : "HOSPITAL_BILL",

        readable: true,

        patientName: "Rajesh Kumar",
      }));

      const payload = {
        ...form,

        documents,
      };

      const response = await fetch("/api/claims", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const json = await response.json();

      setResult(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* LEFT PANEL */}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Claim Submission</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <UploadDocuments
              files={files}
              setFiles={setFiles}
              loading={extracting}
              onExtract={extractUsingAI}
            />

            <AIAnalysisCard
              confidence={confidence}
              warnings={warnings}
              extracted={aiData}
            />

            {confidence !== null && (
              <Card className="border-green-300 bg-green-50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold">AI Extraction Complete</h3>

                  <p className="mt-2">Confidence Score</p>

                  <p className="text-3xl font-bold text-green-700">
                    {(confidence * 100).toFixed(0)}%
                  </p>
                </CardContent>
              </Card>
            )}

            {warnings.length > 0 && (
              <Card className="border-yellow-300 bg-yellow-50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold">AI Warnings</h3>

                  <ul className="mt-3 list-disc pl-6">
                    {warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <ClaimFields form={form} setForm={setForm} />

            <button
              onClick={submitClaim}
              disabled={loading}
              className="w-full rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              {loading ? "Processing Claim..." : "Submit Claim"}
            </button>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT PANEL */}

      <div className="space-y-6">
        {result && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Claim Decision</CardTitle>
              </CardHeader>

              <CardContent>
                <ResultCard result={result} />
              </CardContent>
            </Card>

            <Card>
              {/* <CardHeader>
                <CardTitle>Explainable Trace</CardTitle>
              </CardHeader>

              <CardContent>
                <TraceCard trace={result.trace} />
              </CardContent> */}

              {result && (
                <AIExplanationCard
                  result={result}
                />
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
