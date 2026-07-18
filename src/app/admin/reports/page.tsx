"use client";
import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Download,
  Printer,
  Filter,
  Calendar,
  ChevronDown,
  Search,
  Users,
  GraduationCap,
  ShoppingBag,
  Award,
  BookOpen,
  CalendarDays,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

interface ReportItem {
  id: string;
  [key: string]: any;
}

interface EventOption {
  id: string;
  title: string;
  eventType: string;
}

const REPORT_TYPES = [
  { key: "registrations", label: "Registrations", icon: GraduationCap, color: "text-teal bg-teal/10" },
  { key: "fellowships", label: "Fellowships", icon: BookOpen, color: "text-violet-600 bg-violet-50" },
  { key: "orders", label: "Orders", icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
  { key: "users", label: "Users", icon: Users, color: "text-amber-600 bg-amber-50" },
  { key: "certificates", label: "Certificates", icon: Award, color: "text-emerald-600 bg-emerald-50" },
  { key: "events", label: "Events", icon: CalendarDays, color: "text-rose-600 bg-rose-50" },
];

const REG_STATUSES = ["SUBMITTED", "APPROVED", "REJECTED", "CANCELLED"];
const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const FELLOWSHIP_STATUSES = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW_SCHEDULED", "SELECTED", "REJECTED", "FUNDED"];
const CERTIFICATE_STATUSES = ["ACTIVE", "EXPIRED", "REVOKED"];
const USER_ROLES = ["USER", "STAFF", "ADMIN", "DOCTOR", "JUDGE", "REVIEWER", "TRUSTEE", "APPLICANT", "SCANNER"];

function getStatusOptions(type: string): string[] {
  switch (type) {
    case "registrations": return REG_STATUSES;
    case "fellowships": return FELLOWSHIP_STATUSES;
    case "orders": return ORDER_STATUSES;
    case "certificates": return CERTIFICATE_STATUSES;
    case "users": return USER_ROLES;
    default: return [];
  }
}

export default function ReportsPage() {
  const [type, setType] = useState("registrations");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState("");
  const [eventId, setEventId] = useState("");
  const [events, setEvents] = useState<EventOption[]>([]);

  const [report, setReport] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/admin/reports?type=events&limit=200")
      .then((r) => r.json())
      .then((d) => setEvents(d.items || []))
      .catch(() => {});
  }, []);

  const fetchReport = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ type, page: String(p), limit: "50" });
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      if (status) params.set("status", status);
      if (eventId) params.set("eventId", eventId);

      const res = await fetch(`/api/admin/reports?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setReport(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setPage(p);
    } catch {
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  }, [type, dateFrom, dateTo, status, eventId]);

  const exportCSV = () => {
    if (report.length === 0) return toast.error("No data to export");

    const headers = Object.keys(report[0]).filter((k) => !k.startsWith("_"));
    const csvRows = [
      headers.join(","),
      ...report.map((row) =>
        headers
          .map((h) => {
            let val = row[h];
            if (val === null || val === undefined) val = "";
            if (typeof val === "object") val = JSON.stringify(val);
            const str = String(val).replace(/"/g, '""');
            return `"${str}"`;
          })
          .join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vgmf-${type}-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };

  const printReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const headers = report.length > 0 ? Object.keys(report[0]).filter((k) => !k.startsWith("_")) : [];

    const headerHtml = headers.map((h) => `<th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-100 border-b">${h}</th>`).join("");

    const rowsHtml = report
      .map(
        (row) =>
          `<tr class="border-b hover:bg-gray-50">${headers
            .map((h) => {
              let val = row[h];
              if (val === null || val === undefined) val = "";
              if (typeof val === "object") val = JSON.stringify(val);
              return `<td class="px-4 py-3 text-sm text-gray-600">${val}</td>`;
            })
            .join("")}</tr>`
      )
      .join("");

    printWindow.document.write(`
      <html><head><title>VGMF ${type} Report</title>
      <style>body{font-family:system-ui,sans-serif;padding:20px}table{width:100%;border-collapse:collapse}h1{font-size:20px;margin-bottom:4px}.meta{color:#666;font-size:12px;margin-bottom:20px}</style>
      </head><body>
      <h1>VGMF ${type.charAt(0).toUpperCase() + type.slice(1)} Report</h1>
      <p class="meta">Generated on ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · ${total} records</p>
      <table><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table>
      </body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const renderCell = (key: string, value: any) => {
    if (value === null || value === undefined) return <span className="text-muted">—</span>;
    if (typeof value === "object") {
      if (value.name) return <span>{value.name}</span>;
      if (value.title) return <span className="truncate">{value.title}</span>;
      return <span className="text-xs font-mono">{JSON.stringify(value)}</span>;
    }
    if (key === "createdAt" || key === "registrationDate" || key === "submittedAt" || key === "issuedDate") {
      return (
        <span className="text-xs">
          {new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      );
    }
    if (key === "totalAmount" || key === "paymentAmount" || key === "unitPrice" || key === "totalPrice") {
      return <span className="text-xs font-semibold">₹{Number(value).toLocaleString("en-IN")}</span>;
    }
    if (key === "status") {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
          {value}
        </span>
      );
    }
    return <span className="text-xs">{String(value).length > 50 ? String(value).slice(0, 50) + "..." : String(value)}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-navy">Reports</h1>
          <p className="text-muted mt-1 text-sm">Generate and export data reports</p>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {REPORT_TYPES.map((rt) => (
          <button
            key={rt.key}
            onClick={() => { setType(rt.key); setStatus(""); setReport([]); }}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${
              type === rt.key
                ? "border-teal bg-teal/5 shadow-md shadow-teal/10"
                : "border-slate-200 bg-white hover:border-teal/30 hover:shadow-sm"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${rt.color}`}>
              <rt.icon size={20} />
            </div>
            <span className={`text-xs font-semibold ${type === rt.key ? "text-teal" : "text-ink"}`}>{rt.label}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-muted" />
          <h3 className="text-sm font-semibold text-navy">Filters</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="input-field w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="input-field w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Status / Role</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-field w-full text-sm"
            >
              <option value="">All</option>
              {getStatusOptions(type).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          {(type === "registrations" || type === "events") && (
            <div>
              <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Event</label>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="input-field w-full text-sm"
              >
                <option value="">All Events</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex items-end gap-2">
            <button
              onClick={() => fetchReport(1)}
              disabled={loading}
              className="btn-primary px-5 py-2.5 text-sm flex-1 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw size={14} className="animate-spin" /> Loading...
                </span>
              ) : (
                "Generate"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Report Results */}
      {report.length > 0 && (
        <div className="space-y-4">
          {/* Actions Bar */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">
              <span className="font-bold text-ink">{total}</span> records found
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={exportCSV}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-navy bg-white border border-slate-200 hover:bg-slate-50 hover:border-teal/30 transition-all duration-200 shadow-sm"
              >
                <Download size={14} />
                Export CSV
              </button>
              <button
                onClick={printReport}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal to-cyan-500 hover:shadow-lg hover:shadow-teal/20 transition-all duration-200"
              >
                <Printer size={14} />
                Print
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {report.length > 0 &&
                      Object.keys(report[0])
                        .filter((k) => !k.startsWith("_"))
                        .slice(0, 10)
                        .map((key) => (
                          <th
                            key={key}
                            className="text-left px-4 py-3 font-semibold text-ink text-xs uppercase tracking-wider whitespace-nowrap"
                          >
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </th>
                        ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/50 transition-colors">
                      {Object.keys(item)
                        .filter((k) => !k.startsWith("_"))
                        .slice(0, 10)
                        .map((key) => (
                          <td key={key} className="px-4 py-3">
                            {renderCell(key, item[key])}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <p className="text-xs text-muted">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchReport(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 disabled:opacity-30 hover:bg-slate-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => fetchReport(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 disabled:opacity-30 hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && report.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <FileText size={40} className="mx-auto text-slate-200 mb-3" />
          <p className="text-muted font-medium">No report data yet</p>
          <p className="text-xs text-muted mt-1">Select a report type and click Generate to view data</p>
        </div>
      )}
    </div>
  );
}
