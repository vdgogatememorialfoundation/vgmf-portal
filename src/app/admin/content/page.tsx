import { Edit, Eye, EyeOff, PencilLine } from "lucide-react";

const pages = [
  { id: "pg1", title: "Home — Hero Banner", slug: "/#hero", updated: "14 Jul 2026", published: true },
  { id: "pg2", title: "Home — About Section", slug: "/#about", updated: "10 Jul 2026", published: true },
  { id: "pg3", title: "Home — Mission & Vision", slug: "/#mission", updated: "08 Jul 2026", published: true },
  { id: "pg4", title: "Seminar Overview", slug: "/seminar", updated: "12 Jul 2026", published: true },
  { id: "pg5", title: "Fellowship Overview", slug: "/fellowship", updated: "11 Jul 2026", published: false },
  { id: "pg6", title: "Autism Centre Overview", slug: "/autism", updated: "09 Jul 2026", published: true },
  { id: "pg7", title: "Contact Page", slug: "/contact", updated: "05 Jul 2026", published: true },
];

export default function AdminContent() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-navy">Content</h1>
        <p className="text-muted mt-1">Manage page sections and site content</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white rounded-2xl border p-5">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-3"><PencilLine size={20} /></div>
          <p className="text-2xl font-heading font-extrabold text-navy">{pages.length}</p>
          <p className="text-xs text-muted mt-1">Total Content Blocks</p>
        </div>
        <div className="bg-white rounded-2xl border p-5">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-3"><Eye size={20} /></div>
          <p className="text-2xl font-heading font-extrabold text-navy">{pages.filter(p => p.published).length}</p>
          <p className="text-xs text-muted mt-1">Published</p>
        </div>
        <div className="bg-white rounded-2xl border p-5">
          <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 mb-3"><EyeOff size={20} /></div>
          <p className="text-2xl font-heading font-extrabold text-navy">{pages.filter(p => !p.published).length}</p>
          <p className="text-xs text-muted mt-1">Drafts</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy/5">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-navy">Page / Section</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Slug</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Last Updated</th>
              <th className="text-left px-6 py-4 font-semibold text-navy">Status</th>
              <th className="text-right px-6 py-4 font-semibold text-navy">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-navy">{p.title}</td>
                <td className="px-6 py-4 text-muted font-mono text-xs">{p.slug}</td>
                <td className="px-6 py-4 text-muted">{p.updated}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${p.published ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>{p.published ? "Published" : "Draft"}</span></td>
                <td className="px-6 py-4 text-right"><button className="p-2 hover:bg-gray-100 rounded-lg text-muted"><Edit size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
