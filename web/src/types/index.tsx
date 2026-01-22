import type { ChangeEvent, FormEvent, ReactNode } from "react";

export interface Lead {
  id: string;
  name: string;
  email: string;
  campaignId: string;
  notes?: string | null;
  sentiment?: string | null;
  createdAt: string;
}

export interface LeadResponse {
  total: number;
  page: number;
  pageSize: number;
  data: Lead[];
}

export interface LeadCreateResponse {
  lead: Lead;
  sentiment: string | null;
}

export type LeadPayload = {
  name: string;
  email: string;
  notes?: string;
};

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export interface LeadFormProps {
  name: string;
  email: string;
  notes: string;
  isSubmitting: boolean;
  onNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onNotesChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export interface LeadsTableProps {
  leads: Lead[];
  total: number;
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export interface ErrorAlertProps {
  errors: string[];
}
