import { Search, Eye, GraduationCap, FlaskConical, Heart } from "lucide-react";

const seminarRegs = [
  { id: "s1", name: "Rahul Sharma", email: "rahul@email.com", phone: "9876543210", org: "AIIMS Delhi", designation: "Researcher", date: "14 Jul 2026", status: "Verified" },
  { id: "s2", name: "Dr. Sunita Rao", email: "sunita@email.com", phone: "9123456780", org: "PGI Chandigarh", designation: "Professor", date: "12 Jul 2026", status: "Verified" },
  { id: "s3", name: "Arun Verma", email: "arun@email.com", phone: "9988776655", org: "BHU Varanasi", designation: "Student", date: "10 Jul 2026", status: "Pending" },
];

const fellowshipApps = [
  { id: "f1", name: "Priya Patel", email: "priya@email.com", phone: "9876501234", area: "Ayurvedic Neurology", institution: "NIA Jaipur", status: "Under Review", date: "13 Jul 2026" },
  { id: "f2", name: "Vikram Singh", email: "vikram@email.com", phone: "8765432109", area: "Panchakarma", institution: "SDM Hassan", status: "Shortlisted", date: "11 Jul 2026" },
];

const autismRegs = [
  { id: "a1", childName: "Aarav Kumar", parentName: "Rajesh Kumar", email: "rajesh@email.com", phone: "9911223344", age: 8, city: "Mumbai", date: "14 Jul 2026", status: "Pre-Registered" },
  { id: "a2", childName: "Ishita Sharma", parentName: "Anita Sharma", email: "anita@email.com", phone: "8899001122", age: 6, city: "Pune", date: "12 Jul 2026", status: "Fully Registered" },
  { id: "a3", childName: "Rohan Desai", parentName: "Mehul Desai", email: "mehul@email.com", phone: "7788990011", age: 10, city: "Surat", date: "10 Jul 2026", status: "Verified" },
];

const statusColors: Record<string, string> = {
  Verified: "bg-green-50 text-green-700",
  Pending: "bg-yellow-50 text-yellow-700",
  "Under Review": "bg-blue-50 text-blue-700",
  Shortlisted: "bg-purple-50 text-purple-700",
  "Pre-Registered": "bg-yellow-50 text-yellow-700",
  "Fully Registered": "bg-green-50 text-green-700",
};

export default function StaffRegistrations() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-navy">Registrations</h1>
        <p className="text-muted mt-1">View seminar, fellowship, and autism registrations</p>
      </div>

      <div className="bg-white rounded-2xl border p-4 mb-6">
        <div className="relative max-w-sm"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input type="text" placeholder="Search registrations..." className="w-full pl-10 pr-4 py-2.5 bg-cream rounded-xl text-sm border-0 outline-none focus:ring-2 focus:ring-navy/20" /></div>
      </div>

      {/* SEMINAR REGISTRATIONS */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600"><GraduationCap size={20} /></div>
          <div><h2 className="font-heading text-xl font-bold text-navy">Seminar Registrations</h2><p className="text-xs text-muted">{seminarRegs.length} registrations</p></div>
        </div>
        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-navy/5">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-navy">Name</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Email</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Phone</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Organization</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Designation</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Date</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Status</th>
                <th className="text-right px-6 py-4 font-semibold text-navy">Action</th>
              </tr>
            </thead>
            <tbody>
              {seminarRegs.map(r => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-navy">{r.name}</td>
                  <td className="px-6 py-4 text-muted">{r.email}</td>
                  <td className="px-6 py-4 text-muted">{r.phone}</td>
                  <td className="px-6 py-4">{r.org}</td>
                  <td className="px-6 py-4">{r.designation}</td>
                  <td className="px-6 py-4 text-muted">{r.date}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusColors[r.status]}`}>{r.status}</span></td>
                  <td className="px-6 py-4 text-right"><button className="p-2 hover:bg-gray-100 rounded-lg text-muted"><Eye size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FELLOWSHIP APPLICATIONS */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><FlaskConical size={20} /></div>
          <div><h2 className="font-heading text-xl font-bold text-navy">Fellowship Applications</h2><p className="text-xs text-muted">{fellowshipApps.length} applications</p></div>
        </div>
        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-navy/5">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-navy">Name</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Email</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Phone</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Area of Interest</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Institution</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Date</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Status</th>
                <th className="text-right px-6 py-4 font-semibold text-navy">Action</th>
              </tr>
            </thead>
            <tbody>
              {fellowshipApps.map(f => (
                <tr key={f.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-navy">{f.name}</td>
                  <td className="px-6 py-4 text-muted">{f.email}</td>
                  <td className="px-6 py-4 text-muted">{f.phone}</td>
                  <td className="px-6 py-4">{f.area}</td>
                  <td className="px-6 py-4">{f.institution}</td>
                  <td className="px-6 py-4 text-muted">{f.date}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusColors[f.status]}`}>{f.status}</span></td>
                  <td className="px-6 py-4 text-right"><button className="p-2 hover:bg-gray-100 rounded-lg text-muted"><Eye size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* AUTISM REGISTRATIONS */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600"><Heart size={20} /></div>
          <div><h2 className="font-heading text-xl font-bold text-navy">Autism Centre Registrations</h2><p className="text-xs text-muted">{autismRegs.length} registrations</p></div>
        </div>
        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-navy/5">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-navy">Child Name</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Parent Name</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Email</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Phone</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Age</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">City</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Date</th>
                <th className="text-left px-6 py-4 font-semibold text-navy">Status</th>
                <th className="text-right px-6 py-4 font-semibold text-navy">Action</th>
              </tr>
            </thead>
            <tbody>
              {autismRegs.map(r => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-navy">{r.childName}</td>
                  <td className="px-6 py-4">{r.parentName}</td>
                  <td className="px-6 py-4 text-muted">{r.email}</td>
                  <td className="px-6 py-4 text-muted">{r.phone}</td>
                  <td className="px-6 py-4">{r.age}</td>
                  <td className="px-6 py-4">{r.city}</td>
                  <td className="px-6 py-4 text-muted">{r.date}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusColors[r.status]}`}>{r.status}</span></td>
                  <td className="px-6 py-4 text-right"><button className="p-2 hover:bg-gray-100 rounded-lg text-muted"><Eye size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
