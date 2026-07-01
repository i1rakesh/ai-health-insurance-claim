"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  confidence: number | null;

  warnings: string[];

  extracted: any;
}

export default function AIAnalysisCard({
  confidence,

  warnings,

  extracted,
}: Props) {
  if (!extracted) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Analysis</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div>
          <p className="font-semibold">Detected Documents</p>

          <ul className="list-disc pl-5">
            {extracted.documents?.map((doc: any, index: number) => (
              <li key={index}>{doc.documentType}</li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Patient</p>

            <p>{extracted.patientName || "-"}</p>
          </div>

          <div>
            <p className="text-gray-500">Hospital</p>

            <p>{extracted.hospitalName || "-"}</p>
          </div>

          <div>
            <p className="text-gray-500">Diagnosis</p>

            <p>{extracted.diagnosis || "-"}</p>
          </div>

          <div>
            <p className="text-gray-500">Amount</p>

            <p>₹{extracted.claimedAmount || 0}</p>
          </div>
        </div>

        <div>
          <p className="font-semibold">Confidence</p>

          <div className="mt-2 h-3 rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-green-500"
              style={{
                width: `${(confidence ?? 0) * 100}%`,
              }}
            ></div>
          </div>

          <p className="mt-2">{Math.round((confidence ?? 0) * 100)}%</p>
        </div>

        {warnings.length > 0 && (
          <div>
            <p className="font-semibold">Warnings</p>

            <ul className="list-disc pl-5">
              {warnings.map((w, index) => (
                <li key={index}>{w}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
