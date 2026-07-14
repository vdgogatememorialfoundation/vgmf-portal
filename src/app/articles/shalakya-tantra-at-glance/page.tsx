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
          <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Shalakya Tantra</span>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-4">Shalakya Tantra at a Glance</h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1"><Calendar size={14} /> March 31, 2023</span>
            <span className="flex items-center gap-1"><User size={14} /> Vd. R.B. Gogate</span>
          </div>
        </header>
        <div className="prose prose-lg max-w-none text-ink-soft leading-relaxed space-y-4">
          <p>
            The diseases in the Urdhwa Jatrugata Pradesh (Area above the manubrum sterni) are grouped under the subclass of Shalakyatantra. This Urdhwa Jatrugat Pradesh includes the structures like Nasa (Nose), Karna (ear), Netra (Eyes), Mukh (Mouth) which includes Jihwa (Tongue), Kantha (Oropharynx) and Shir (Cranium with Contents) Mastulunga (Brain).
          </p>

          <p>
            The main cause in separating these diseases is that a Tantra, called as &quot;Shalakyatantra&quot; (Different types of probes) are used, for diagnosis &amp; curative purpose. Different types of Vyuhan Yantras (Scopes) are also used especially for ear, nose &amp; oropharynx.
          </p>

          <p>For example:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>To determine the depth of danta nadi (dental sinus) the probe is used as diagnostic instrument.</li>
            <li>For application of medicines in the eyes &apos;Anjana shalaka&apos; is used.</li>
            <li>For removing Karna Goothak, Karna Vishodhani shalaka is used.</li>
            <li>For dahankarma - again heated probe is used.</li>
            <li>For application of tailas, quathas or for cleaning the wounds a shalaka called as Karpasa Krutashanisha shalaka is used.</li>
          </ol>

          <p>
            For Karna &amp; Nasa Auroscope, Nasal Speculum (Talayantra) and oroscope is used to remove Foreign Bodies.
          </p>

          <p>
            Health of the body depends upon the good health of the indriyas, namely Netra, Nasa, Karna, Mukha, Twak and Shir. They are responsible for reception of Dhyana and have a separate storing capacity as netrabudhi (olfactory lobes) brocas area (olfactory bulb). Shir holds the prime importance.
          </p>

          <p>
            If Shir and its allied organs are in a good healthy condition, then the body growth and its maintenance is good.
          </p>

          <p>
            In day to day life it is commonly seen that the person who cannot either see, smell or lacks the sense of taste cannot really be called healthy though overall he may present a healthy picture with no obvious problems. Such a person however cannot lead a smoother life and his movements or his getting about in Life is Limited to a certain extent.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy mt-6 mb-3">PANCHABHUTIK (SHARIR) INDRIYAN:</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Netra - Represents &quot;Tejas&quot; Mahabhoot, does grahan of Roop</li>
            <li>Karna - Represents &quot;Akasha&quot; Mahabhoot, does grahan of Shabda</li>
            <li>Nose - Represents &quot;Prithavi&quot; Mahabhoot, does grahan of Gandha</li>
            <li>Tongue - Represents &quot;Apa&quot; Mahabhoot, does grahan of Rasa</li>
            <li>Skin - Represents &quot;Vayu&quot; Mahabhoot, does grahan of Sparsha</li>
          </ul>

          <h2 className="font-heading text-xl font-bold text-navy mt-6 mb-3">NORMALLY HABITANT DOSHAS &amp; THEIR KARMA:</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Alochak Pitta - eye to see</li>
            <li>Bodhak Kapha - mouth to taste</li>
            <li>Sadhak Pitta - Shirastha Hridaya Dhee, medha</li>
            <li>Pranavayu - ura, kantha, shir, tones-up indriyas</li>
            <li>Udan Vayu - nasta to nabhi to talk, to initiate, gives strength to the body</li>
            <li>Vyan Vayu - Shirastha Hridaya. All the movements of the body</li>
          </ul>

          <h2 className="font-heading text-xl font-bold text-navy mt-6 mb-3">FACE INFLUENCING THE PERSONALITY:</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Oshtha (lips) - 4 Angulas in length</li>
            <li>Nasa (Nose) - 4 Angulas in length, should be straight</li>
            <li>Netra (Eyes) - Both the eyes should be identical</li>
            <li>Karna (ears) - Size of the ear assumes great importance in determining the span of life</li>
            <li>Fore head - 4 angulas in length</li>
          </ul>

          <h2 className="font-heading text-xl font-bold text-navy mt-6 mb-3">MARMAS PLAYING IMPORTANT ROLE IN SURGERY:</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Dhamani - hoarseness or change in voice</li>
            <li>Matruka - Death</li>
            <li>Krikatika - Shirokampa, Tossing of head</li>
            <li>Vidhur - Deafness</li>
            <li>Phana - Loss of sense of smell</li>
            <li>Apanga - Loss of vision or diminution of vision</li>
            <li>Avarta - Blindness</li>
            <li>Shankha - Death</li>
            <li>Utkshepaka - Impacted F.B. if removed death</li>
            <li>Seemanta - Fainting, Semiconsciousness or insanity</li>
            <li>Shrungataka - Death</li>
            <li>Adipati - Death</li>
            <li>Stapani - Impacted F.B. if removed death</li>
          </ol>

          <h2 className="font-heading text-xl font-bold text-navy mt-6 mb-3">SWASTHA VRITTA IN RELATION TO SHALAKYATANTRA:</h2>
          <p>
            For good health to teeth the daily use of soft stems of herbs like Nimba, Khadir, Karanja having Kashaya, Tikta &amp; Katu taste have been advised.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy mt-6 mb-3">NUMBER OF DISEASES IN SHALAKYA TANTRA:</h2>
          <p>
            Charaka, Sushruta &amp; Vagbhat have given the following number of diseases.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy mt-6 mb-3">SPECIFIC TREATMENT IN SHALAKYA TANTRA:</h2>
          <p>Kriya Kalpas:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Nasya</li>
            <li>Shirobasti</li>
            <li>Karnapuran</li>
            <li>Netrabasti</li>
            <li>Gandoosha</li>
            <li>Kawalgraha</li>
            <li>Dhoomapan</li>
          </ol>

          <h2 className="font-heading text-xl font-bold text-navy mt-6 mb-3">NASYA CHIKITSA:</h2>
          <p>
            Nasa is a door entry for all shalakya diseases. Medications through nose thus cure many disease conditions.
          </p>

          <h2 className="font-heading text-xl font-bold text-navy mt-6 mb-3">PLASTIC SURGERY – TWAGAROPAN – SUSRUTA:</h2>
          <p>
            The Pioneer of reconstruction surgery of nose &amp; ears. Facial Surgery - also the first concept in surgery in pedicle grafts. Accepted by modern plastic surgeons.
          </p>
        </div>
        <div className="bg-gray-50 border-l-4 border-navy p-4 mt-8">
          <p className="text-sm text-muted italic">Please note: The article(s) were written by Dr. R. B. Gogate during 1961-2010. The fundamental relevance of these holds true even today, yet the readers/viewers should consider the timeline and the limited availability of the resources which might conflict with the recent advancements.</p>
        </div>
      </article>
    </div>
  );
}
