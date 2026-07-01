import ClaimForm from "@/components/ClaimForm";
import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
  <div className="mx-auto max-w-7xl px-8 py-10">

    <div className="mb-10 flex items-center justify-between">

      <div>
        <h1 className="text-5xl font-bold tracking-tight">
          🩺 Plum AI Claims Processing
        </h1>

        <p className="mt-3 text-lg text-slate-600">
          Intelligent Health Insurance Claim Processing using AI
        </p>

        <p className="mt-1 text-sm text-slate-500">
          OCR • Policy Validation • Fraud Detection • Explainable Decisions
        </p>
      </div>

      <Link
        href="/evaluation"
        className="rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:bg-slate-800"
      >
        View Evaluation Report →
      </Link>

    </div>

    <ClaimForm />

  </div>
</main>
  );
}
