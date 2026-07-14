"use client";
import { useState, useEffect } from "react";
import { Search, Eye } from "lucide-react";

export default function AdminAutism() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ total: 0, registered: 0, preregistered: 0 });

  useEffect(() => { fetchData(); }, [search]);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/autism?search=${search}`);
    const data = await res.json();
    setRegistrations(data.items || []);
    setStats({ total: data.total || 0, registered: data.items?.filter((r:any) => r.isFullyRegistered).length || 0, preregistered: data.items?.filter((r:any) => r.isPreRegistered && !r.isFullyRegistered).length || 0 });
    setLoading(false);
  };

  const statusColor = (r: any) => r.isFullyRegistered ? "bg-green-50 text-green-700" : r.isPreRegistered ? "bg-yellow-50 text-yellow-700" : "bg-gray-50 text-gray-600";

  return (
    <div>
      <div className="mb-8"><h1 className="font-heading text-3xl font-extrabold text-navy">Autism Programme</h1><p className="text-muted mt-1">Registrations & therapy progress</p></div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[{l:"Total",v:stats.total},{l:"Registered",v:stats.registered},{l:"Pre-Registered",v:stats.preregistered}].map(s => (
          <div key={s.l} className="bg-white rounded-2xl border p-5"><p className="text-xs text-muted uppercase">{s.l}</p><p className="font-heading text-2xl font-extrabold text-navy">{s.v}</p></div>
        ))}
      </div>
      <div className="flex gap-4 mb-6"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..." className="px-4 py-2.5 border rounded-xl w-64" /></div>
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-navy/5"><tr><th className="text-left px-6 py-3">Child Name</th><th className="text-left px-6 py-3">Age</th><th className="text-left px-6 py-3">Parent</th><th className="text-left px-6 py-3">E-Ticket</th><th className="text-left px-6 py-3">Date</th><th className="text-left px-6 py-3">Status</th></tr></thead>
        <tbody>
          {loading ? <tr><td colSpan={6} className="text-center py-8 text-muted">Loading...</td></tr> :
           registrations.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-muted">No registrations</td></tr> :
           registrations.map(r => (
            <tr key={r.id} className="border-t hover:bg-gray-50">
              <td className="px-6 py-3 font-medium">{r.childName}</td><td className="px-6 py-3">{r.childAge}</td>
              <td className="px-6 py-3">{r.parentName}</td><td className="px-6 py-3 text-muted">{r.eTicketNumber}</td>
              <td className="px-6 py-3 text-muted">{new Date(r.registrationDate).toLocaleDateString()}</td>
              <td className="px-6 py-3"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusColor(r)}`}>{r.isFullyRegistered ? "Registered" : "Pre-Registered"}</span></td>
            </tr>
          ))}
        </tbody></table>
      </div>
    </div>
  );
}
