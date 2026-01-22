import type { ErrorAlertProps } from "@/types";

export function ErrorAlert({ errors }: ErrorAlertProps) {
  if (errors.length === 0) return null;

  return (
    <div className="space-y-1 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      {errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </div>
  );
}
