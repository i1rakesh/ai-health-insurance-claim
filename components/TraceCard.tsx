type Props = {
  trace: any;
};

export default function TraceCard({ trace }: Props) {

  const icon =
    trace.status === "PASS"
      ? "✅"
      : trace.status === "WARNING"
      ? "⚠️"
      : "❌";

  return (
    <div className="rounded-lg border bg-white p-4">

      <div className="flex justify-between">

        <h3 className="font-semibold">

          {trace.step}

        </h3>

        <span>{icon}</span>

      </div>

      <p className="mt-2 text-gray-600">

        {trace.message}

      </p>

    </div>
  );
}