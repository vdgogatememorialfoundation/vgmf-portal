export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Foundation</span>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-navy mb-4">About Vaidya Gogate Memorial Foundation</h1>
        <p className="text-muted max-w-3xl mx-auto">Preserving ancient Ayurvedic wisdom through research, education, and community service since 1972.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="card-hover bg-white rounded-2xl border p-8">
          <h2 className="font-heading text-2xl font-bold text-navy mb-4">The Visionary</h2>
          <p className="text-ink-soft leading-relaxed">
            Vaidya Ramchandra Ballal Gogate (1933-2005) was a visionary Ayurvedic physician, surgeon, researcher, and educator. A gold medalist from Tilak Ayurved Mahavidyalaya, Pune, he held dual degrees — GFAM and AVP in Shalya-Shalakya. His pioneering research in Agnikarma (thermal cauterization) and Viddhakarma (therapeutic needling) earned him national recognition.
          </p>
        </div>
        <div className="card-hover bg-white rounded-2xl border p-8">
          <h2 className="font-heading text-2xl font-bold text-navy mb-4">Foundation & Mission</h2>
          <p className="text-ink-soft leading-relaxed">
            The Shree Samarth Vagbhata Seva Mandal was established on 28th May 1972, providing a platform for Vaidya Gogate's mission. The trust organized community clinics serving thousands of patients, and its flagship Fellowship Programme has trained hundreds of aspiring vaidyas.
          </p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto mt-8 card-hover bg-gradient-to-br from-navy to-navy-light text-white rounded-2xl p-8">
        <h2 className="font-heading text-2xl font-bold mb-4">Continuing the Legacy</h2>
        <p className="text-white/80 leading-relaxed">
          After his samadhi in 2005, his family — led by his wife Dr. Anagha Gogate — continued his work. Today, VGMF serves as a comprehensive digital platform hosting the annual National Seminar on Agnikarma & Viddhakarma, managing the Viddhakarma Research Fellowship Programme, and running community initiatives like the Autism Awareness Programme. Every initiative reflects Vaidya Gogate's conviction that the ancient wisdom of Ayurveda, when rigorously studied and compassionately applied, can transform lives.
        </p>
      </div>
    </div>
  );
}
