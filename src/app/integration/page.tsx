"use client";
import { useEffect, useState } from "react";
import { GraduationCap, FlaskConical, Heart, ExternalLink } from "lucide-react";

export default function IntegrationPage() {
  const [seminars, setSeminars] = useState<any[]>([]);
  const [fellowships, setFellowships] = useState<any[]>([]);
  const [autism, setAutism] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/integration/seminar?path=/seminars").then(r => r.json()),
      fetch("/api/integration/fellowship?path=/fellowships").then(r => r.json()),
      fetch("/api/integration/autism?path=/registrations").then(r => r.json()),
    ])
      .then(([s, f, a]) => {
        setSeminars(s.seminars || []);
        setFellowships(f.fellowships || []);
        setAutism(a.registrations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center text-muted">Loading portal data...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-extrabold text-navy mb-2">All Portals</h1>
      <p className="text-muted mb-8">Unified view of all VGMF programmes</p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <GraduationCap className="text-blue-600" size={20} />
            </div>
            <h2 className="font-heading text-xl font-bold text-navy">Seminars</h2>
          </div>
          {seminars.length > 0 ? (
            <div className="space-y-3">
              {seminars.slice(0, 3).map((s: any) => (
                <div key={s.id} className="border-l-2 border-blue-500 pl-3">
                  <p className="font-semibold text-sm">{s.title}</p>
                  <p className="text-xs text-muted">{s.date}</p>
                </div>
              ))}
              <a href="https://seminar.vaidyagogate.org" target="_blank" className="text-xs text-blue-600 flex items-center gap-1 mt-2">
                View All <ExternalLink size={12} />
              </a>
            </div>
          ) : (
            <p className="text-sm text-muted">No seminars available</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <FlaskConical className="text-green-600" size={20} />
            </div>
            <h2 className="font-heading text-xl font-bold text-navy">Fellowships</h2>
          </div>
          {fellowships.length > 0 ? (
            <div className="space-y-3">
              {fellowships.slice(0, 3).map((f: any) => (
                <div key={f.id} className="border-l-2 border-green-500 pl-3">
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-xs text-muted">{f.status}</p>
                </div>
              ))}
              <a href="https://fellowship.vaidyagogate.org" target="_blank" className="text-xs text-green-600 flex items-center gap-1 mt-2">
                View All <ExternalLink size={12} />
              </a>
            </div>
          ) : (
            <p className="text-sm text-muted">No fellowships available</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center">
              <Heart className="text-pink-600" size={20} />
            </div>
            <h2 className="font-heading text-xl font-bold text-navy">Autism Programme</h2>
          </div>
          {autism.length > 0 ? (
            <div className="space-y-3">
              {autism.slice(0, 3).map((a: any) => (
                <div key={a.id} className="border-l-2 border-pink-500 pl-3">
                  <p className="font-semibold text-sm">{a.childName}</p>
                  <p className="text-xs text-muted">{a.status}</p>
                </div>
              ))}
              <a href="https://autism.vaidyagogate.org" target="_blank" className="text-xs text-pink-600 flex items-center gap-1 mt-2">
                View All <ExternalLink size={12} />
              </a>
            </div>
          ) : (
            <p className="text-sm text-muted">No registrations available</p>
          )}
        </div>
      </div>
    </div>
  );
}
