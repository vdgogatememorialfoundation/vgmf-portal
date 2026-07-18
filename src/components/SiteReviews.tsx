"use client";
import { useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  userName: string | null;
  userDesignation: string | null;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? "fill-[#c2761c] text-[#c2761c]" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

const sampleReviews: Review[] = [
  { id: "1", rating: 5, title: "Transformative Experience", content: "VGMF's National Seminar on Agnikarma was a life-changing event. The live demonstrations and expert panels gave me practical knowledge I couldn't find anywhere else.", userName: "Dr. Ananya Sharma", userDesignation: "Ayurvedic Practitioner, Mumbai" },
  { id: "2", rating: 5, title: "Excellent Mentorship", content: "The Research Fellowship programme provided exceptional guidance and mentorship. The grants enabled me to publish two papers on Viddhakarma techniques.", userName: "Dr. Rajesh Kulkarni", userDesignation: "Research Fellow, Pune" },
  { id: "3", rating: 4, title: "Great Community Support", content: "The Autism Awareness Programme has been a blessing for our family. The therapy sessions and community support helped our child immensely.", userName: "Priya Deshmukh", userDesignation: "Parent, Pune" },
  { id: "4", rating: 5, title: "Highly Recommended", content: "VGMF is doing incredible work in preserving and advancing Ayurvedic knowledge. Their programmes are well-organized and truly impactful.", userName: "Dr. Meena Joshi", userDesignation: "Professor, B.J. Medical College" },
];

export default function SiteReviews({ reviews }: { reviews: Review[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = reviews.length > 0 ? reviews : sampleReviews;

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 340;
      scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-14 bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="section-heading">
          <span className="badge">Testimonials</span>
          <h2>What People Say</h2>
          <p>Hear from our community members about their experience with VGMF</p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full shadow-md border border-[#1a1a2e]/5 flex items-center justify-center text-[#0d6662] hover:bg-[#0d6662]/5 transition-colors hidden md:flex"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full shadow-md border border-[#1a1a2e]/5 flex items-center justify-center text-[#0d6662] hover:bg-[#0d6662]/5 transition-colors hidden md:flex"
          >
            <ChevronRight size={16} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            {items.map((r) => (
              <div
                key={r.id}
                className="min-w-[300px] max-w-[320px] bg-white rounded-2xl border border-[#1a1a2e]/5 p-6 snap-center shrink-0 flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <StarRating rating={r.rating} />
                  <Quote size={20} className="text-[#c2761c]/30" />
                </div>
                {r.title && (
                  <h4 className="font-heading text-sm font-bold text-[#1a1a2e] mb-2">{r.title}</h4>
                )}
                <p className="text-sm text-[#7c7c8a] leading-relaxed italic flex-1">
                  &ldquo;{r.content || "Great experience with VGMF programmes."}&rdquo;
                </p>
                <div className="mt-4 pt-3 border-t border-[#1a1a2e]/5">
                  <p className="font-heading text-xs font-bold text-[#1a1a2e]">{r.userName || "Anonymous"}</p>
                  {r.userDesignation && (
                    <p className="text-[10px] text-[#7c7c8a] mt-0.5">{r.userDesignation}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-1.5 mt-4">
            {items.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#0d6662]/20" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
