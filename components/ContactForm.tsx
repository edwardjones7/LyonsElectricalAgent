"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const URGENCY_OPTIONS = [
  { value: "routine", label: "Routine — within a week or two" },
  { value: "soon", label: "Soon — within a few days" },
  { value: "urgent", label: "Urgent — but not an emergency" },
] as const;

type Status = "idle" | "submitting" | "ok" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      zip: String(fd.get("zip") || ""),
      city: String(fd.get("city") || ""),
      problem: String(fd.get("problem") || ""),
      urgency: String(fd.get("urgency") || "routine"),
      website: String(fd.get("website") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed");
      }
      setStatus("ok");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "ok") {
    return (
      <div className="rounded-3xl bg-emerald-50 ring-1 ring-emerald-200 p-7 lg:p-9">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="w-7 h-7 mt-0.5 shrink-0 text-emerald-700" />
          <div>
            <h3 className="text-emerald-900">Got it — we&rsquo;ll be in touch.</h3>
            <p className="mt-3 text-emerald-900 leading-relaxed">
              An estimator will follow up shortly. For anything urgent in the meantime, call us at
              the number above.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-white ring-1 ring-[var(--color-navy-200)] p-6 lg:p-8 shadow-[var(--shadow-soft)] space-y-5">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Your name" required autoComplete="name" />
        <Field name="phone" label="Phone" type="tel" required autoComplete="tel" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="email" label="Email (optional)" type="email" autoComplete="email" />
        <Field name="zip" label="ZIP code" required autoComplete="postal-code" />
      </div>
      <Field name="city" label="City / town" autoComplete="address-level2" />

      <div>
        <label className="block text-sm font-semibold text-[var(--color-navy-800)] mb-1.5">
          What's going on?
        </label>
        <textarea
          name="problem"
          required
          rows={5}
          placeholder="Briefly describe the work you need or the issue you're seeing."
          className="w-full rounded-2xl border border-[var(--color-navy-200)] focus:border-[var(--color-navy-500)] focus:ring-2 focus:ring-[var(--color-navy-200)] outline-none px-4 py-3 text-[0.9375rem] text-[var(--color-ink)] placeholder:text-[var(--color-muted)] resize-y"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[var(--color-navy-800)] mb-2">
          How quickly do you need it?
        </label>
        <div className="grid gap-2">
          {URGENCY_OPTIONS.map((o, i) => (
            <label
              key={o.value}
              className="flex items-center gap-3 rounded-2xl border border-[var(--color-navy-200)] hover:border-[var(--color-navy-700)] px-4 py-3 cursor-pointer transition-colors has-[:checked]:border-[var(--color-navy-900)] has-[:checked]:bg-[var(--color-navy-50)]"
            >
              <input
                type="radio"
                name="urgency"
                value={o.value}
                defaultChecked={i === 0}
                className="accent-[var(--color-navy-900)]"
              />
              <span className="text-[0.9375rem] text-[var(--color-ink)]">{o.label}</span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          For real emergencies (sparks, fire, water near electrical), call us instead.
        </p>
      </div>

      {error && (
        <div className="flex gap-3 rounded-2xl bg-[var(--color-emergency-50)] ring-1 ring-[var(--color-emergency-500)]/30 p-4 text-sm text-[var(--color-emergency-700)]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>{error}</div>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-navy-900)] hover:bg-[var(--color-navy-800)] disabled:opacity-50 text-white w-full sm:w-auto px-6 h-12 font-semibold transition-colors"
      >
        {status === "submitting" && <Loader2 className="w-4 h-4 animate-spin" />}
        Send request
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-[var(--color-navy-800)] mb-1.5">
        {label}{required && <span className="text-[var(--color-emergency-600)]"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-2xl border border-[var(--color-navy-200)] focus:border-[var(--color-navy-500)] focus:ring-2 focus:ring-[var(--color-navy-200)] outline-none px-4 h-12 text-[0.9375rem] text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
      />
    </div>
  );
}
