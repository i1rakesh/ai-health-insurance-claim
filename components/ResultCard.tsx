"use client";

interface Props {
  result: any;
}

export default function ResultCard({ result }: Props) {
  const colors: Record<string, string> = {
    APPROVED: "text-green-600",
    PARTIAL: "text-orange-500",
    REJECTED: "text-red-600",
    MANUAL_REVIEW: "text-yellow-600",
    INCOMPLETE: "text-blue-600",
  };

  const color = colors[result.decision] || "text-gray-700";

  return (
    <div className="space-y-6">

      <div>
        <p className="text-sm text-gray-500">Decision</p>

        <h2 className={`text-3xl font-bold ${color}`}>
          {result.decision}
        </h2>
      </div>

      <div>
        <p className="text-sm text-gray-500">
          Approved Amount
        </p>

        <h2 className="text-2xl font-semibold">
          ₹{result.approvedAmount}
        </h2>
      </div>

      <div>
        <p className="text-sm text-gray-500">
          Confidence
        </p>

        <h2 className="text-xl font-semibold">
          {Math.round((result.confidence ?? 1) * 100)}%
        </h2>
      </div>

      <div>
        <p className="text-sm text-gray-500">
          Reason
        </p>

        <p className="font-medium">
          {result.reason ?? "No reason available"}
        </p>
      </div>

      {result.warnings?.length > 0 && (
        <div>
          <p className="text-sm text-gray-500">
            Warnings
          </p>

          <ul className="list-disc pl-5">
            {result.warnings.map(
              (warning: string, index: number) => (
                <li key={index}>{warning}</li>
              )
            )}
          </ul>
        </div>
      )}

    </div>
  );
}