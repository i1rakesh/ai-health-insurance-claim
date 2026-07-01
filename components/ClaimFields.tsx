"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClaimFormData {
  memberId: string;
  category: string;
  claimedAmount: number;
  diagnosis: string;
  treatmentDate: string;
  hospitalName: string;
}

interface ClaimFieldsProps {
  form: ClaimFormData;
  setForm: React.Dispatch<React.SetStateAction<ClaimFormData>>;
}

export default function ClaimFields({
  form,
  setForm,
}: ClaimFieldsProps) {
  function updateField(
    key: keyof ClaimFormData,
    value: string | number
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Claim Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">

        {/* Member ID */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Member ID
          </label>

          <input
            value={form.memberId}
            onChange={(e) =>
              updateField("memberId", e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />
        </div>

        {/* Category */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Claim Category
          </label>

          <select
            value={form.category}
            onChange={(e) =>
              updateField("category", e.target.value)
            }
            className="w-full rounded-lg border p-3"
          >
            <option value="consultation">
              Consultation
            </option>

            <option value="pharmacy">
              Pharmacy
            </option>

            <option value="diagnostic">
              Diagnostic
            </option>

            <option value="dental">
              Dental
            </option>
          </select>
        </div>

        {/* Diagnosis */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Diagnosis
          </label>

          <input
            value={form.diagnosis}
            onChange={(e) =>
              updateField("diagnosis", e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />
        </div>

        {/* Hospital */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Hospital Name
          </label>

          <input
            value={form.hospitalName}
            onChange={(e) =>
              updateField("hospitalName", e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />
        </div>

        {/* Treatment Date */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Treatment Date
          </label>

          <input
            type="date"
            value={form.treatmentDate}
            onChange={(e) =>
              updateField("treatmentDate", e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />
        </div>

        {/* Amount */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Claimed Amount (₹)
          </label>

          <input
            type="number"
            value={form.claimedAmount}
            onChange={(e) =>
              updateField(
                "claimedAmount",
                Number(e.target.value)
              )
            }
            className="w-full rounded-lg border p-3"
          />
        </div>

      </CardContent>
    </Card>
  );
}