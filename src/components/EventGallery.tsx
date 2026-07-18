"use client";
import { useState } from "react";
import { Play, Calendar, MapPin, ExternalLink, Award, Users, BookOpen } from "lucide-react";

const pastEvents = [
  {
    id: 1,
    title: "National Seminar on Agnikarma & Viddhakarma",
    year: "2025",
    date: "March 15-16, 2025",
    location: "Pune, Maharashtra",
    description: "Two-day national seminar featuring live demonstrations of Agnikarma and Viddhakarma techniques, research paper presentations, and expert panels with over 200+ delegates.",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailColor: "from-[#0d6662] to-[#14918b]",
    highlights: ["200+ Delegates", "15 Expert Speakers", "Live Demos"],
    icon: Award,
  },
  {
    id: 2,
    title: "VGMF Fellowship Awards Ceremony",
    year: "2025",
    date: "August 22, 2025",
    location: "Pune, Maharashtra",
    description: "Annual fellowship awards ceremony recognizing outstanding research in Viddhakarma. Five researchers received grants for their projects in traditional Ayurvedic therapies.",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailColor: "from-[#c2761c] to-[#d4922a]",
    highlights: ["5 Fellows Awarded", "₹3.75L Grants", "Research Showcase"],
    icon: BookOpen,
  },
  {
    id: 3,
    title: "Autism Awareness & Therapy Camp",
    year: "2025",
    date: "April 2, 2025",
    location: "Pune, Maharashtra",
    description: "Free community programme providing autism screening, therapy sessions, and family counseling. Over 85 families participated and received personalized care plans.",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailColor: "from-[#7c1d1d] to-[#991b1b]",
    highlights: ["85+ Families", "Free Screening", "Therapy Sessions"],
    icon: Users,
  },
  {
    id: 4,
    title: "Workshop on Traditional Shalaka Techniques",
    year: "2024",
    date: "November 10, 2024",
    location: "Pune, Maharashtra",
    description: "Hands-on workshop for Ayurvedic practitioners on traditional Shalaka preparation and application techniques for Agnikarma and Viddhakarma procedures.",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailColor: "from-[#1a1a2e] to-[#2d2d44]",
    highlights: ["50+ Practitioners", "Hands-on Training", "Certificate Course"],
    icon: Award,
  },
];

export default function EventGallery() {
  const [showVideo, setShowVideo] = useState<number | null>(null);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="section-heading">
          <span className="badge">Gallery</span>
          <h2>Past Events &amp; Highlights</h2>
          <p>Relive our impactful events and watch recordings of seminars, workshops, and community programmes</p>
        </div>

        {/* Event Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {pastEvents.map((event) => (
            <div key={event.id} className="bg-[#faf9f6] rounded-2xl border border-gray-100 overflow-hidden card-hover group shadow-sm">
              {/* Thumbnail / Video Embed */}
              {showVideo === event.id ? (
                <div className="relative w-full aspect-video bg-black">
                  <iframe
                    src={event.youtubeUrl}
                    title={event.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <button onClick={() => setShowVideo(null)}
                    className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg hover:bg-black/70 z-10">
                    Close
                  </button>
                </div>
              ) : (
                <div className={`relative w-full aspect-video bg-gradient-to-br ${event.thumbnailColor} flex items-center justify-center cursor-pointer`}
                  onClick={() => setShowVideo(event.id)}>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Play size={28} className="text-white ml-1" fill="white" />
                    </div>
                    <p className="text-white/80 text-xs font-bold uppercase tracking-wider font-heading">{event.year} Event</p>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 bg-gradient-to-br ${event.thumbnailColor} rounded-lg flex items-center justify-center text-white`}>
                    <event.icon size={16} />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-extrabold text-[#1a1a2e] leading-tight">{event.title}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-[#7c7c8a]">
                      <Calendar size={10} /> {event.date}
                      <span>&middot;</span>
                      <MapPin size={10} /> {event.location}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[#7c7c8a] leading-relaxed mb-3 font-body">{event.description}</p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.highlights.map((h, j) => (
                    <span key={j} className="px-2 py-0.5 bg-[#0d6662]/10 text-[#0d6662] text-[10px] font-bold rounded-full">{h}</span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button onClick={() => setShowVideo(event.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7c1d1d]/5 text-[#7c1d1d] text-xs font-bold rounded-lg hover:bg-[#7c1d1d]/10 transition-colors">
                    <Play size={12} fill="currentColor" /> Watch Video
                  </button>
                  <a href={event.youtubeUrl.replace("/embed/", "/watch?v=")} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-[#7c7c8a] text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors">
                    <ExternalLink size={12} /> YouTube
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* YouTube Channel Link */}
        <div className="text-center">
          <a href="https://www.youtube.com/@VGMFOfficial" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c2761c] text-white font-bold rounded-xl hover:bg-[#a86216] transition-colors shadow-lg shadow-[#c2761c]/20">
            <Play size={18} fill="white" />
            Visit Our YouTube Channel
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
