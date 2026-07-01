"use client";

import { useState } from "react";

export default function EvaluationPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function runEvaluation() {
    setLoading(true);

    const res = await fetch("/api/evaluation");
    const data = await res.json();

    setResults(data);

    setLoading(false);
  }

  const passed = results.filter(r => r.match).length;

  return (
    <main className="mx-auto max-w-7xl p-10">

      <h1 className="mb-8 text-4xl font-bold">
        Evaluation Report
      </h1>

      <button
        onClick={runEvaluation}
        className="rounded bg-black px-6 py-3 text-white"
      >
        {loading ? "Running..." : "Run All Test Cases"}
      </button>

      {results.length > 0 && (
        <>
          <div className="mt-8 rounded-lg border bg-green-50 p-6">
            <h2 className="text-xl font-semibold">
              Summary
            </h2>

            <p className="mt-2">
              Passed {passed} / {results.length}
            </p>
          </div>

          <table className="mt-8 w-full border-collapse border">

            <thead className="bg-gray-100">

              <tr>

                <th className="border p-3">
                  Test
                </th>

                <th className="border p-3">
                  Expected
                </th>

                <th className="border p-3">
                  Actual
                </th>

                <th className="border p-3">
                  Result
                </th>

              </tr>

            </thead>

            <tbody>

              {results.map((r) => (

                <tr key={r.id}>

                  <td className="border p-3">
                    {r.id}
                  </td>

                  <td className="border p-3">
                    {r.expected}
                  </td>

                  <td className="border p-3">
                    {r.actual}
                  </td>

                  <td
                    className={`border p-3 font-bold ${
                      r.match
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {r.match ? "PASS" : "FAIL"}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        </>
      )}
    </main>
  );
}