"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface Props {
  result: any;
}

export default function AIExplanationCard({ result }: Props) {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");

  async function generateExplanation() {
    setLoading(true);

    const res = await fetch("/api/explain-decision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        result,
      }),
    });

    const data = await res.json();

    setExplanation(data.explanation);

    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Decision Explanation</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <button
          onClick={generateExplanation}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Generating..." : "Explain Decision"}
        </button>

        {explanation && (
          <div className="rounded-lg bg-slate-100 p-4 text-sm leading-7 prose prose-sm max-w-none">
            <ReactMarkdown>{explanation}</ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
