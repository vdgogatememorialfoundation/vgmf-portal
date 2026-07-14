import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">About Us</span>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-navy mb-4">About Vaidya Gogate Memorial Foundation</h1>
      </div>

      {/* Foundation Introduction */}
      <div className="bg-white rounded-2xl border p-8 mb-8">
        <h2 className="font-heading text-2xl font-bold text-navy mb-4">Our Mission</h2>
        <p className="text-ink-soft leading-relaxed mb-4">
          Vaidya Gogate Memorial Foundation is a platform with a sole motto: <strong>Propagation of knowledge</strong>. This is a platform to share our grandfather&apos;s, Vd. Ramchandra Ballal Gogate&apos;s work and carry forward his vision &apos;knowledge for all&apos;. We are creating this platform as an authentic source of information.
        </p>
        <p className="text-ink-soft leading-relaxed mb-4">
          Our purpose is to ignite young minds through his writings and teachings. We plan to reach out to all vaidyas, students of ayurved as well as disseminating the knowledge across all pathies and common people. Fortunately, our family has been blessed with renowned vaidyas for many generations.
        </p>
        <p className="text-ink-soft leading-relaxed">
          Starting from Vd. Mahadev (Bapu) Gogate who was the rajavaidya to the king of Jawhar, next generation being Vd. Vishnu Mahadev Gogate (Dravyaguna) and Vd. Trimbak Mahadev Gogate (Panchakarma), next generation being Vd. Ramchandra Ballal Gogate (Shalya tantra), and this legacy still continues. They have made huge contributions to the field of ayurved of which many remain under appreciated.
        </p>
      </div>

      {/* Vaidya R.B. Gogate */}
      <div className="bg-white rounded-2xl border p-8 mb-8">
        <h2 className="font-heading text-2xl font-bold text-navy mb-4">Vaidya Ramchandra Ballal Gogate</h2>
        <p className="text-ink-soft leading-relaxed mb-4">
          Vd. R. B. Gogate was born on <strong>4th February, 1933</strong> at Atkar gaon and passed away on <strong>28th September, 2015</strong> at Pune. He received his GFAM (General Fellow of Ayurvedic Medicine) and AVP (Ayur Vidya Parangat) in Shalya-Shalakya from Pune.
        </p>
        
        <h3 className="font-heading text-xl font-bold text-navy mt-6 mb-3">Professional Career</h3>
        <p className="text-ink-soft leading-relaxed mb-4">
          He worked as a professor for post graduate studies (Pune University), Director- Research and publication (Sane Guruji Arogya Kendra, Hadapsar), Principal (Tilak Ayurved Mahavidyalaya), Hon. Surgeon and HOD (Seth Tarachand Ramnath Hospital, Pune), C.M.O. (Matru Mandir Hospital, Devrukh), Chief of AIDS research centre (STRC Hospital, Pune) and Chief of Cancer project (Pethe Arogya Kendra, Belgaum).
        </p>

        <h3 className="font-heading text-xl font-bold text-navy mt-6 mb-3">Research Areas</h3>
        <p className="text-ink-soft leading-relaxed mb-4">
          He conducted extensive research on AIDS, cancer, Agnikarma, Viddhakarma, dhoopan chikitsa in vrana, cauterisation of corns by ayurvedic method, raktamokshan, to name a few. He published various books covering subjects like AIDS, Viddha and Agnikarma, Bhagna and Asthi roga, Shalya tantra, Hasti ayurved.
        </p>

        <h3 className="font-heading text-xl font-bold text-navy mt-6 mb-3">Books Published</h3>
        <ul className="list-disc pl-6 text-ink-soft space-y-2 mb-4">
          <li>AIDS</li>
          <li>Viddha and Agnikarma</li>
          <li>Bhagna and Asthi roga</li>
          <li>Shalya tantra</li>
          <li>Hasti ayurved</li>
        </ul>
      </div>

      {/* Dr. Anagha Gogate */}
      <div className="bg-white rounded-2xl border p-8 mb-8">
        <h2 className="font-heading text-2xl font-bold text-navy mb-4">Dr. Anagha Gogate</h2>
        <p className="text-ink-soft leading-relaxed mb-4">
          The most significant contribution in terms of unwavering support and strength to Dr. Ramchandra B Gogate was made by his wife, Dr. Anagha Ramchandra Gogate.
        </p>
        <p className="text-ink-soft leading-relaxed mb-4">
          She was born on <strong>7th November 1936</strong> to Mr. Gajanan and Indira Sahasrabuddhe in Panchgani, Satara district of Maharashtra. She did her schooling from Sanjeevan Vidyalaya Panchgani, and moved to Pune in 1950 for her higher secondary studies in Ferguson College. She was later admitted to Tilak Ayurved Mahavidyalaya for BAMS where she pursued her bachelor&apos;s degree in Ayurvedic sciences.
        </p>
        <p className="text-ink-soft leading-relaxed mb-4">
          She married Dr. Ramchandra Ballal Gogate on <strong>21st May 1963</strong>. She worked as an MO in Matrumandir from 1968-69 and as a clinical assistant from 1968-69. She received enormous appreciation in teaching as a professor in Tilak Ayurvedic Mahavidyalaya from 1970 onwards.
        </p>
        <p className="text-ink-soft leading-relaxed">
          We lost her on <strong>12th September 2019</strong> after her longstanding battle with prolonged illness. She will always be remembered for being remarkably virtuous and dutiful with incomparable will to stand by her husband through any odds.
        </p>
      </div>

      {/* Awards & Accolades */}
      <div className="bg-white rounded-2xl border p-8 mb-8">
        <h2 className="font-heading text-2xl font-bold text-navy mb-4">Awards & Accolades</h2>
        <p className="text-ink-soft leading-relaxed mb-4">
          Vd. R. B. Gogate&apos;s work has been recognized and awarded by many institutions:
        </p>
        <ul className="list-disc pl-6 text-ink-soft space-y-2">
          <li><strong>Pandit Ramnarayan Sharma Award</strong> for research in ayurved (Baidyanath) - received by his son Ar. Padmanabha Gogate at the hands of the honorable President of India Shri Ramnath Kovind</li>
          <li><strong>Sushrut Puraskar</strong> (Khadiwale Vaidya Sanstha)</li>
          <li><strong>Gayatri Pratishthan Puraskar</strong> for work on AIDS</li>
          <li><strong>Legend Shalaki Karyabhushan Puraskar</strong></li>
          <li><strong>Jivan Gaurav Puraskar</strong> (TAMV, RSM)</li>
        </ul>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-navy to-navy-light text-white rounded-2xl p-8 text-center">
        <h2 className="font-heading text-2xl font-bold mb-4">Explore Our Knowledge Base</h2>
        <p className="text-white/80 mb-6">Read articles on Ayurveda, Viddhakarma, Agnikarma, and more</p>
        <Link href="/articles" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy font-semibold rounded-xl hover:bg-gold-light transition-all">
          View Articles
        </Link>
      </div>
    </div>
  );
}
