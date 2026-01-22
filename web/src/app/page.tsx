"use client";

import { useState } from "react";
import { ErrorAlert } from "@/components/ErrorAlert";
import { LeadForm } from "@/components/LeadForm";
import { LeadsTable } from "@/components/LeadsTable";
import { Pagination } from "@/components/Pagination";
import { useLeads } from "@/hooks/useLeads";
import { validateLead } from "@/utils/validateLead";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const {
    leads,
    total,
    page,
    totalPages,
    errors,
    isSubmitting,
    lastSentiment,
    setPage,
    setErrors,
    createLead,
  } = useLeads();

  const validate = () => {
    const nextErrors = validateLead({ name, email });
    setErrors(nextErrors);
    return nextErrors.length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    const result = await createLead({
      name,
      email,
      notes: notes.trim() || undefined
    });

    // Clear form on successful submission
    if (result.success) {
      setName("");
      setEmail("");
      setNotes("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Lead Management Platform</h1>
          <p className="text-slate-600">
            Capture and manage marketing leads with sentiment analysis.
          </p>
        </header>

        <LeadForm
          name={name}
          email={email}
          notes={notes}
          isSubmitting={isSubmitting}
          onNameChange={(event) => setName(event.target.value)}
          onEmailChange={(event) => setEmail(event.target.value)}
          onNotesChange={(event) => setNotes(event.target.value)}
          onSubmit={handleSubmit}
        />
        {lastSentiment && (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
            Sentiment:{" "}
            <span className="font-semibold text-slate-900">
              {lastSentiment}
            </span>
          </div>
        )}
        <ErrorAlert errors={errors} />
        <LeadsTable leads={leads} total={total} />
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
          onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
        />
      </main>
    </div>
  );
}
