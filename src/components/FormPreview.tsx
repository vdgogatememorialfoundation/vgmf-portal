"use client";

import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  Upload,
  CheckSquare,
  Hash,
  ChevronDown,
  AlignLeft,
  List,
} from "lucide-react";

interface FormField {
  fieldName: string;
  fieldType: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string;
  section?: string;
}

interface FormPreviewProps {
  fields: FormField[];
  title?: string;
  description?: string;
}

const FIELD_ICONS: Record<string, any> = {
  text: User,
  email: Mail,
  tel: Phone,
  date: Calendar,
  select: List,
  textarea: AlignLeft,
  file: Upload,
  number: Hash,
  checkbox: CheckSquare,
};

function parseOptions(optionsStr?: string): string[] {
  if (!optionsStr) return [];
  try {
    const parsed = JSON.parse(optionsStr);
    if (Array.isArray(parsed)) return parsed;
    return optionsStr.split(",").map((o) => o.trim());
  } catch {
    return optionsStr.split(",").map((o) => o.trim());
  }
}

export default function FormPreview({ fields, title, description }: FormPreviewProps) {
  const sections = new Map<string, FormField[]>();
  fields.forEach((f) => {
    const section = f.section || "General";
    if (!sections.has(section)) sections.set(section, []);
    sections.get(section)!.push(f);
  });

  const sectionNames = Array.from(sections.keys());

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal/5 to-cyan-500/5 border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
            <FileText size={16} className="text-teal" />
          </div>
          <h3 className="font-heading text-lg font-bold text-navy">
            {title || "Form Preview"}
          </h3>
        </div>
        {description && <p className="text-sm text-muted mt-1 ml-11">{description}</p>}
        <div className="mt-3 ml-11 flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal/10 text-teal uppercase tracking-wider">
            Preview Mode
          </span>
          <span className="text-[10px] text-muted">
            {fields.length} field{fields.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Form Body */}
      <div className="p-6 space-y-6">
        {sectionNames.map((sectionName) => (
          <div key={sectionName}>
            {sectionNames.length > 1 && (
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <div className="w-1 h-4 bg-teal rounded-full" />
                <h4 className="text-xs font-bold text-muted uppercase tracking-wider">{sectionName}</h4>
              </div>
            ))}
            <div className="grid md:grid-cols-2 gap-4">
              {sections.get(sectionName)!.map((field) => (
                <PreviewField key={field.fieldName} field={field} />
              ))}
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-12">
            <FileText size={40} className="mx-auto text-slate-200 mb-3" />
            <p className="text-sm text-muted">No form fields configured</p>
            <p className="text-xs text-muted mt-1">Add fields to see a preview here</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PreviewField({ field }: { field: FormField }) {
  const Icon = FIELD_ICONS[field.fieldType] || User;
  const options = parseOptions(field.options);
  const isFullWidth = field.fieldType === "textarea" || field.fieldType === "file";

  return (
    <div className={isFullWidth ? "md:col-span-2" : ""}>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-ink mb-1.5">
        <Icon size={13} className="text-muted" />
        {field.label}
        {field.required && <span className="text-red-500 text-[10px]">*</span>}
      </label>

      {field.fieldType === "text" || field.fieldType === "email" || field.fieldType === "tel" || field.fieldType === "number" ? (
        <input
          type={field.fieldType === "number" ? "number" : field.fieldType}
          disabled
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-muted cursor-not-allowed"
        />
      ) : field.fieldType === "date" ? (
        <input
          type="date"
          disabled
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-muted cursor-not-allowed"
        />
      ) : field.fieldType === "select" ? (
        <div className="relative">
          <select disabled className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-muted appearance-none cursor-not-allowed pr-10">
            <option>{field.placeholder || `Select ${field.label.toLowerCase()}`}</option>
            {options.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        </div>
      ) : field.fieldType === "textarea" ? (
        <textarea
          disabled
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
          rows={3}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-muted cursor-not-allowed resize-none"
        />
      ) : field.fieldType === "file" ? (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50 cursor-not-allowed">
          <Upload size={20} className="mx-auto text-slate-300 mb-2" />
          <p className="text-xs text-muted">File upload (disabled in preview)</p>
        </div>
      ) : field.fieldType === "checkbox" ? (
        <label className="flex items-center gap-2 cursor-not-allowed">
          <input type="checkbox" disabled className="w-4 h-4 rounded border-slate-300 text-teal bg-slate-100" />
          <span className="text-sm text-muted">{field.placeholder || field.label}</span>
        </label>
      ) : (
        <input
          type="text"
          disabled
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-muted cursor-not-allowed"
        />
      )}
    </div>
  );
}
