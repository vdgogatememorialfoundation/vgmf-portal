"use client";

interface GoogleMapEmbedProps {
  address?: string | null;
  city?: string | null;
  location?: string | null;
  className?: string;
}

export default function GoogleMapEmbed({ address, city, location, className = "" }: GoogleMapEmbedProps) {
  const query = [location, address, city].filter(Boolean).join(", ");
  if (!query) return null;

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(query)}&zoom=15`;

  return (
    <div className={`rounded-xl overflow-hidden border border-slate-200 ${className}`}>
      <iframe
        title="Event Location"
        width="100%"
        height="300"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
      />
      <div className="p-3 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center gap-2 text-sm text-ink">
          <svg className="w-4 h-4 text-teal shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{[location, address, city].filter(Boolean).join(", ")}</span>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-teal hover:underline mt-1 inline-block"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}
