"use client";

import { useState, useTransition } from "react";
import { updateLeadStatus } from "@/lib/admin/actions";
import { LEAD_STATUSES } from "@/lib/analytics/payload";

export function LeadStatusSelect({
  leadId,
  status,
}: {
  leadId: string;
  status: string;
}) {
  const [value, setValue] = useState(status);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <span className="adm-row">
      <select
        className="adm-select"
        value={value}
        disabled={pending}
        aria-label="Lead status"
        onChange={(event) => {
          const next = event.target.value;
          const previous = value;
          setValue(next);
          setError(null);

          startTransition(async () => {
            const result = await updateLeadStatus(leadId, next);
            if (!result.ok) {
              // Put the dropdown back where it was so the UI never claims a
              // change the database did not accept.
              setValue(previous);
              setError(result.error ?? "Could not update.");
            }
          });
        }}
      >
        {LEAD_STATUSES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {pending ? <span className="adm-muted">saving…</span> : null}
      {error ? <span style={{ color: "var(--adm-bad)" }}>{error}</span> : null}
    </span>
  );
}
