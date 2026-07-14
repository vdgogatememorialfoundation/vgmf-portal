import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function LegendShalakiArticle() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/articles" className="inline-flex items-center gap-2 text-muted hover:text-navy mb-8">
        <ArrowLeft size={16} /> Back to Articles
      </Link>

      <article className="bg-white rounded-2xl border p-8">
        <header className="mb-8">
          <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">
            Shalakya Tantra
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-4">
            LEGEND SHALAKI
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Calendar size={14} /> March 31, 2023
            </span>
            <span className="flex items-center gap-1">
              <User size={14} /> Vd. R.B. Gogate
            </span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-ink-soft leading-relaxed space-y-4">
          <p className="text-lg font-semibold text-navy">
            "LEGEND SHALAKI," HEXAGENARIAN
          </p>

          <p>
            A GREAT ACADEMICIAN, CALLED PROF. R. B. GOGTE A "Great ACADEMICIAN," "SKILLED SURGEON," "GENUINE TEACHER," "DISCIPLINED ADMINISTRATOR," "ABLE GUIDE," "A PHILOSOPHER" & A MATURED THINKER.
          </p>

          <p>
            Prof. Dr. R.B. Gogte was born in 1933 at a remote place in Raigad District of Maharashtra state. Dr. Gogte got his graduation (G.F.A.M.) & then Post Graduation (A.V.P.) in the subject Shalya – Shalakya tantra and surgery from Tilak Ayurved Mahavidyalaya which was affiliated to Tilak Maharashtra Vidyapeeth.
          </p>

          <p>
            After getting enriched in practical surgery at Seth Tarachand Hospital, Dr. R. B. Gogte joined a Hospital called "Matrumandir" at Devarukh, Dist. Ratnagiri in capacity of chief Medical and administrative officer. Dr. Gogte worked with great devotion at this rural place to attain blessings from the people as "GOD MAN".
          </p>

          <p>
            Since Dr. R. B. Gogte is a born teacher, he returned from Devarukh to join Tilak Ayurved Mahavidyalaya as a lecturer in the department of shalya shalakya. Simultaneously he was also appointed as a chief Medical officer and Deputy Superintendent of Seth Tarachand Hospital. During his services at Tilak Ayurved Mahavidyalaya, he worked in all capacities, from Lecturer to professor, Post Graduate guide for A.V.P., M.S.(Ayu.), M.A.Sc.Ph.d. in the subjects Shalya & Shalakyatantra. He was guide to so many students who have now become reputed surgeons.
          </p>

          <p>
            To his credit there are a number of books but special mention is required for his books, "Shalyantantra- part 1&2, 4," "Asthibhagna" which are accepted as reference books by various Universities.
          </p>

          <p>
            During the career, Prof. Dr. Gogate conducted various Research projects successfully. To mention a few, they are "Kadar & Agnikarm," "Sadyovan & Yashtimadhughut," "Sadyovran & Vrandhooan," "AIDS". His project, namely "AIDS & AYURVED."
          </p>

          <p>
            Dr. R. B. Gogte was also designated in various capacities at Pune University. He was a member of Academic council, Member of Ayurvedic faculty and Chairman & a member of board of studies in shalya- shalakya.
          </p>

          <p>
            A Recipient of "Dhanvantari Puraskar" of Baidyanath, "Vd. Bapurao Patwardhan Sushant Puraskar" of Vd. Khadiwale Sansodhan Sanstha & "Award for Research work" by Gayatri Ayurvedic Sanshodhan Sanstha, Prof. Dr. R.B. Gogate will be felicitated with "LEGEND SHALAKI" AWARD IN "UPDATE SHALAKYATANTRA 2002" Conference.
          </p>

          <p className="text-right font-semibold text-navy mt-8">
            — PROF. D. P. PURANIK
          </p>
        </div>
      </article>
    </div>
  );
}
