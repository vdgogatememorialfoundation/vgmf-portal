import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function ViddhakarmaPoints2Article() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/articles" className="inline-flex items-center gap-2 text-muted hover:text-navy mb-8">
        <ArrowLeft size={16} /> Back to Articles
      </Link>

      <article className="bg-white rounded-2xl border p-8">
        <header className="mb-8">
          <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">
            Viddhakarma
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-4">
            Viddhakarma Points 2 (with Agnikarma Tips)
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Calendar size={14} /> February 11, 2022
            </span>
            <span className="flex items-center gap-1">
              <User size={14} /> Vd. R.B. Gogate
            </span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-ink-soft leading-relaxed space-y-4">
          <p>
            We use <strong>Suvarna Shalaka</strong> (Gold probe) because needle cannot be used in diabetic patients. As it doesn't cause wound, so pus formation is naturally prevented. Of course it is used in pain only.
          </p>

          <p>
            When there is pain of calcaneal spur, then <strong>Mrittika Shalaka</strong> (Mud or clay probe) is used.
          </p>

          <p>
            In case of corn, heated <strong>Loh Shalaka</strong> (Iron probe) is used. This probe should not be too pointed. This probe should be red hot for Agni karma success. If it is not so much hot, then there are chances of pus formation. And wound takes much more time to heal and corn is also not cured. So, not too pointed but red hot Iron probe is must while performing this Agni karma.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">Agnikarma Benefits</h2>
          <p>
            Agni karma is used to relieve pain as well as to cure the disease. Texts reveal that diseases cured by Agni karma never recur. Hence after excision of tumour, Agni karma is done at operated site for prevention of recurrence.
          </p>

          <p>
            In Ayurveda Agni karma has been used to stop bleeding (Rakta stambhan). In excessive bleeding, Agni karma is done at the bleeding point to stop the bleeding immediately.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy">Important Precautions</h2>
          <p>
            When performing Agni karma, the following precautions should be taken:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The probe should be heated properly until red hot</li>
            <li>The patient should be in comfortable position</li>
            <li>The area should be cleaned properly before procedure</li>
            <li>After procedure, the wound should be dressed with appropriate medicine</li>
            <li>Patient should be advised about post-procedure care</li>
          </ul>

          <p>
            These simple precautions ensure successful Agni karma without any complications.
          </p>
        </div>
      </article>
    </div>
  );
}
