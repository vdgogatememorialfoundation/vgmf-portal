"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Advancing Ayurveda Since 1972",
    subtitle: "Vaidya Gogate Memorial Foundation",
    description: "Preserving the legacy of Vaidya R.B. Gogate through research fellowships, national seminars, and community healthcare initiatives.",
    cta: { label: "Get Started", href: "/signup" },
    cta2: { label: "About Us", href: "/about" },
    bg: "from-[#0d6662] to-[#14918b]",
  },
  {
    title: "National Seminar 2026",
    subtitle: "Agnikarma & Viddhakarma",
    description: "Join leading Ayurvedic practitioners for live demonstrations, research presentations, and expert panels on traditional thermal and puncture therapies.",
    cta: { label: "Register Now", href: "/signup" },
    cta2: { label: "Learn More", href: "/about" },
    bg: "from-[#1a1a2e] to-[#2d2d44]",
  },
  {
    title: "Research Fellowship",
    subtitle: "Grants up to ₹75,000",
    description: "Apply for the Viddhakarma Research Fellowship. Contribute to evidence-based Ayurveda under expert mentorship and advance the field.",
    cta: { label: "Apply Now", href: "/signup" },
    cta2: { label: "Learn More", href: "/about" },
    bg: "from-[#c2761c] to-[#a86216]",
  },
  {
    title: "Autism Awareness Programme",
    subtitle: "Free Community Service",
    description: "Free awareness sessions, therapy support, and community resources for families affected by autism. Serving the community since inception.",
    cta: { label: "Join Now", href: "/signup" },
    cta2: { label: "Learn More", href: "/about" },
    bg: "from-[#7c1d1d] to-[#991b1b]",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden">
      <div className={`bg-gradient-to-br ${slide.bg} transition-all duration-700`}>
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-[15%] w-72 h-72 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute bottom-10 left-[10%] w-56 h-56 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl animate-fade-up" key={current}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur rounded-full mb-5">
              <div className="w-1.5 h-1.5 bg-[#c2761c] rounded-full animate-pulse" />
              <span className="text-white/90 text-[11px] font-bold tracking-wider uppercase font-heading">{slide.subtitle}</span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-white leading-tight mb-5">
              {slide.title}
            </h1>
            <p className="text-white/75 text-base md:text-lg leading-relaxed mb-8 max-w-lg font-body">
              {slide.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={slide.cta.href} className="btn-gold !py-3 !px-6">
                {slide.cta.label} <ArrowRight size={16} />
              </Link>
              <Link href={slide.cta2.href} className="inline-flex items-center gap-2 px-5 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-sm font-heading">
                {slide.cta2.label}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-20">
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-20">
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-[#c2761c]" : "w-2 bg-white/40 hover:bg-white/60"}`}
          />
        ))}
      </div>
    </section>
  );
}
