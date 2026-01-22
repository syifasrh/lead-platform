import type { LeadsTableProps } from "@/types";
import { Card } from "./Card";

export function LeadsTable({ leads, total }: LeadsTableProps) {
  const getSentimentBadge = (sentiment: string | null | undefined) => {
    if (!sentiment) return null;

    const colors = {
      positive: "bg-green-100 text-green-700",
      negative: "bg-red-100 text-red-700",
      neutral: "bg-slate-100 text-slate-700",
    };

    const color = colors[sentiment as keyof typeof colors] || colors.neutral;

    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${color}`}>
        {sentiment}
      </span>
    );
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between text-sm font-medium text-slate-600">
        <h2 className="text-base font-semibold text-slate-900">Leads List</h2>
        <span>{total} total</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              <th className="px-2 py-3">Name</th>
              <th className="px-2 py-3">Email</th>
              <th className="px-2 py-3">Campaign ID</th>
              <th className="px-2 py-3">Notes</th>
              <th className="px-2 py-3">Sentiment</th>
              <th className="px-2 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-2 py-6 text-center text-slate-500"
                >
                  No leads yet.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-slate-100">
                <td className="px-2 py-3 font-medium text-slate-900">
                  {lead.name}
                </td>
                <td className="px-2 py-3 text-slate-600">{lead.email}</td>
                <td className="px-2 py-3 text-slate-600">
                  {lead.campaignId}
                </td>
                <td className="px-2 py-3 text-slate-600 max-w-xs">
                  {lead.notes ? (
                    <div className="truncate" title={lead.notes}>
                      {lead.notes}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">-</span>
                  )}
                </td>
                <td className="px-2 py-3">
                  {getSentimentBadge(lead.sentiment)}
                </td>
                <td className="px-2 py-3 text-slate-600">
                  {new Date(lead.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
