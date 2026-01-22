import type { CardProps } from "@/types";

export function Card({ children, className }: CardProps) {
  return (
    <section
      className={`rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60 ${className ?? ""
        }`.trim()}
    >
      {children}
    </section>
  );
}
