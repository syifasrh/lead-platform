import { useCallback, useEffect, useMemo, useState } from "react";
import type { Lead, LeadCreateResponse, LeadPayload, LeadResponse } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const DEFAULT_PAGE_SIZE = 10;

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSentiment, setLastSentiment] = useState<string | null>(null);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / DEFAULT_PAGE_SIZE));
  }, [total]);

  const loadLeads = useCallback(async () => {
    const response = await fetch(
      `${API_BASE}/leads?page=${page}&pageSize=${DEFAULT_PAGE_SIZE}`,
    );
    if (!response.ok) {
      throw new Error("Failed to load leads data.");
    }
    const data: LeadResponse = await response.json();
    setLeads(data.data);
    setTotal(data.total);
  }, [page]);

  useEffect(() => {
    loadLeads().catch((error) => {
      setErrors([error instanceof Error ? error.message : "An error occurred."]);
    });
  }, [loadLeads]);

  const createLead = useCallback(
    async (payload: LeadPayload) => {
      setIsSubmitting(true);
      setErrors([]);

      try {
        const response = await fetch(`${API_BASE}/leads`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          const message = data?.message ?? "Failed to save lead.";
          throw new Error(Array.isArray(message) ? message.join(" ") : message);
        }

        const data: LeadCreateResponse = await response.json();
        setLastSentiment(data.sentiment ?? null);
        await loadLeads();
        return { success: true, sentiment: data.sentiment };
      } catch (error) {
        setErrors([error instanceof Error ? error.message : "An error occurred."]);
        return { success: false, sentiment: null };
      } finally {
        setIsSubmitting(false);
      }
    },
    [loadLeads],
  );

  return {
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
  };
}
