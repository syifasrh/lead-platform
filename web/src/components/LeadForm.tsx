import type { ChangeEvent } from "react";
import type { LeadFormProps } from "@/types";
import { Card } from "./Card";

export function LeadForm({
  name,
  email,
  notes,
  isSubmitting,
  onNameChange,
  onEmailChange,
  onNotesChange,
  onSubmit,
}: LeadFormProps) {
  const inputClassName =
    "rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400";

  const currentYear = new Date().getFullYear();

  const fields: Array<{
    id: string;
    label: string;
    type: "text" | "email";
    placeholder: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  }> = [
      {
        id: "name",
        label: "Name",
        type: "text",
        placeholder: "Full name",
        value: name,
        onChange: onNameChange,
      },
      {
        id: "email",
        label: "Email",
        type: "email",
        placeholder: "name@email.com",
        value: email,
        onChange: onEmailChange,
      },
    ];

  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-semibold">Add New Lead</h2>
      <form className="grid gap-4 md:grid-cols-3" onSubmit={onSubmit}>
        {fields.map((field) => (
          <div key={field.id} className="flex flex-col gap-2 text-sm">
            <label htmlFor={field.id} className="font-medium">
              {field.label}
            </label>
            <input
              id={field.id}
              type={field.type}
              value={field.value}
              onChange={field.onChange}
              placeholder={field.placeholder}
              required
              className={inputClassName}
            />
          </div>
        ))}

        <div className="flex flex-col gap-2 text-sm">
          <label htmlFor="campaignId" className="font-medium">
            Campaign ID
          </label>
          <input
            id="campaignId"
            type="text"
            value={`CMP-${currentYear}-XXX`}
            disabled
            className={`${inputClassName} bg-slate-50 text-slate-500 cursor-not-allowed`}
          />
          <p className="text-xs text-slate-500">Auto-generated</p>
        </div>

        <div className="col-span-full flex flex-col gap-2 text-sm">
          <label htmlFor="notes" className="font-medium">
            Notes <span className="text-slate-400">(Optional - for sentiment analysis)</span>
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={onNotesChange}
            placeholder="Example: Lead is very interested in the product, requested proposal immediately..."
            rows={3}
            className={inputClassName}
          />
          <p className="text-xs text-slate-500">
            These notes will be analyzed to determine sentiment (positive/neutral/negative)
          </p>
        </div>

        <button
          className="col-span-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Lead"}
        </button>
      </form>
    </Card>
  );
}
