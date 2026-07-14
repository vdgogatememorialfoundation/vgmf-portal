import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function ShalakyaTantraArticle() {
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
            Shalakya Tantra at a Glance
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
          <p>
            The diseases in the <strong>Urdhwa Jatrugata Pradesh</strong> (Area above the manubrum sterni) are grouped under the subclass of Shalakyatantra. This Urdhwa Jatrugat Pradesh includes the structures like Nasa (Nose), Karna (ear), Netra (Eyes), Mukh (Mouth) which includes Jihwa (Tongue), Kantha (Oropharynx) and Shir (Cranium with Contents) Mastulunga (Brain).
          </p>

          <p>
            The main cause in separating these diseases is that a Tantra, called as "Shalakyatantra" (Different types of probes) are used, for diagnosis & curative purpose. Different types of Vyuhan Yantras (Scopes) are also used especially for ear, nose & oropharynx.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy mt-6 mb-3">Examples of Shalaka Usage</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>To determine the depth of danta nadi (dental sinus) the probe is used as diagnostic instrument</li>
            <li>For application of medicines in the eyes 'Anjana shalaka' is used</li>
            <li>For removing Karna Goothak, Karna Vishodhani shalaka is used</li>
            <li>For dahankarma - again heated probe is used</li>
            <li>For application of tailas, quathas or for cleaning the wounds a shalaka called as Karpasa Krutashanisha shalaka is used</li>
          </ol>

          <h2 className="font-heading text-xl font-bold text-navy mt-6 mb-3">Panchabhautik Indriyan</h2>
          <p>
            According to Ayurved, our body is composed of principles of panchamahabhoota. Each of the Indriya in shalakya tantra represents one mahabhoota and possesses guna grahan of that mahabhoota:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Netra</strong> - Represents "Tejas" Mahabhoot, does grahan of Roop</li>
            <li><strong>Karna</strong> - Represents "Akasha" Mahabhoot, does grahan of Shabda</li>
            <li><strong>Nose</strong> - Represents "Prithavi" Mahabhoot, does grahan of Gandha</li>
            <li><strong>Tongue</strong> - Represents "Apa" Mahabhoot, does grahan of Rasa</li>
            <li><strong>Skin</strong> - Represents "Vayu" Mahabhoot, does grahan of Sparsha</li>
          </ul>

          <h2 className="font-heading text-xl font-bold text-navy mt-6 mb-3">Normally Habitant Doshas & Their Karma</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Alochak Pitta</strong> - eye to see</li>
            <li><strong>Bodhak Kapha</strong> - mouth to taste</li>
            <li><strong>Sadhak Pitta</strong> - Shirastha Hridaya Dhee, medha</li>
            <li><strong>Pranavayu</strong> - ura, kantha, shir, tones-up indriyas, to spit, to talk, to swallow food, to exhale air</li>
            <li><strong>Udan Vayu</strong> - nasta to nabhi to talk, to initiate, gives strength to the body, luster to Skin, improves memory</li>
            <li><strong>Vyan Vayu</strong> - Shirastha Hridaya. All the movements of the body including Nimesha & Unmesha of eye ball</li>
          </ul>

          <h2 className="font-heading text-xl font-bold text-navy mt-6 mb-3">Specific Treatment in Shalakya Tantra</h2>
          <p>
            Along with the general line of treatment, specific treatment for specific organs has been described. They are called as Kriya Kalpas:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Nasya</li>
            <li>Shirobasti</li>
            <li>Karnapuran</li>
            <li>Netrabasti</li>
            <li>Gandoosha</li>
            <li>Kawalgraha</li>
            <li>Dhoomapan</li>
          </ol>

          <h2 className="font-heading text-xl font-bold text-navy mt-6 mb-3">Nasya Chikitsa</h2>
          <p>
            Amongst the Kriyakalpas, Nasya plays important role in the cure of many Shalakya diseases. Nasa is a door entry for all shalakya diseases, namely Shir, Karna, Netra, Mukha & Nasa. Medications through nose thus cure many disease conditions of almost all indriyas.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy mt-6 mb-3">Plastic Surgery in Ayurveda</h2>
          <p>
            Sushruta - i.e. Ayurveda, The Pioneer of reconstruction surgery of nose & ears. Facial Surgery - also the first concept in surgery in pedicle grafts. Accepted by modern plastic surgeons.
          </p>
        </div>
      </article>
    </div>
  );
}
