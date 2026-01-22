import type { LeadPayload } from "@/types";

export function validateLead({ name, email }: LeadPayload) {
  const nextErrors: string[] = [];
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  if (trimmedName.length < 2) {
    nextErrors.push("Name must be at least 2 characters.");
  }
  if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
    nextErrors.push("Email is invalid.");
  }

  return nextErrors;
}
