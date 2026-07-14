import Link from "next/link";

const articles = [
  { slug: "legend-shalaki", title: "LEGEND SHALAKI", category: "Shalakya Tantra", date: "March 31, 2023", excerpt: "A tribute to Prof. Dr. R.B. Gogate, recognizing his contributions as a great academician, skilled surgeon, genuine teacher, disciplined administrator, able guide, a philosopher & a matured thinker." },
  { slug: "shalakya-tantra-at-glance", title: "Shalakya Tantra at a Glance", category: "Shalakya Tantra", date: "March 31, 2023", excerpt: "An overview of Shalakya Tantra covering diseases of the head and neck region including eyes, ears, nose, and mouth, and their treatment using various Shalaka instruments." },
  { slug: "viddhakarma-points-4", title: "Viddhakarma Points 4", category: "Viddhakarma", date: "April 16, 2022", excerpt: "Advanced Viddhakarma points including treatment for conditions like Apachi (cervical lymphadenitis) and calcaneal spur. Precautions for Agnikarma with candle heating." },
  { slug: "viddhakarma-points-3", title: "Viddhakarma Points 3", category: "Viddhakarma", date: "March 6, 2022", excerpt: "Precautions before performing Viddha or Rakta Mokshan. Blood letting limits. Differences between Ayurvedic Viddha and Chinese acupuncture." },
  { slug: "viddhakarma-points-2", title: "Viddhakarma Points 2 (with Agnikarma Tips)", category: "Viddhakarma", date: "February 11, 2022", excerpt: "Use of Suvarna Shalaka, Mrittika Shalaka, and Loh Shalaka. Agnikarma for preventing recurrence of tumours and stopping bleeding." },
  { slug: "viddhakarma-points-1", title: "Viddhakarma Points 1", category: "Viddhakarma", date: "February 6, 2022", excerpt: "Introduction to Viddhakarma for instant pain management. Treatment described by Sushruta for draining accumulated fluid, entrapped Vayu, and pus." },
  { slug: "viddhakarma-correlation-chinese-medicine", title: "Viddhakarma and its Correlation with Chinese Medicine", category: "Research", date: "February 3, 2022", excerpt: "A comparative study of Viddhakarma and Chinese acupuncture highlighting similarities in principles, treatment points, and therapeutic approaches." },
  { slug: "types-of-agnikarma", title: "Types of Agnikarma", category: "Agnikarma", date: "February 3, 2022", excerpt: "Four types of Agnikarma: Valaya (circle), Bindu (dot), Vilekha (line), and Pratisarana. Application of honey and ghee after Agnikarma." },
  { slug: "agnikarma-shalaka", title: "Agnikarma Shalaka", category: "Agnikarma", date: "February 3, 2022", excerpt: "Types of probes used for Agnikarma: Suvarna, Loha, Panchaloha, Jambavaushtha, Shara, Asthi, Godanta, Mrittika, and more with their temperatures." },
  { slug: "instruments-for-agnikarma-and-viddhakarma", title: "Instruments for Agnikarma and Viddhakarma", category: "Agnikarma", date: "February 3, 2022", excerpt: "Complete list of instruments and requirements for Agnikarma and Viddhakarma procedures including place, apparatus, and materials needed." },
  { slug: "agnikarma", title: "Agnikarma", category: "Agnikarma", date: "February 3, 2022", excerpt: "Introduction to Agnikarma - a superior para surgical procedure for pain relief. Benefits include instant pain relief, variety of probes, and non-recurrence." },
  { slug: "raktamokshan", title: "Raktamokshan", category: "Shalya Tantra", date: "February 3, 2022", excerpt: "Introduction to Raktamokshana (blood letting). Sira Vyadh for removal of vitiated blood. Benefits and indications of Raktamokshana therapy." },
  { slug: "ayurveda-outdated-6", title: "आयुर्वेद आऊटडेटेड- मुळीच नाही 6", category: "Research", date: "February 3, 2022", excerpt: "आयुर्वेद कायाकल्प - रसायन - वाजीकरण. चरकाचार्यांनी चार हजार वर्षांपूर्वी वातावरणात होणारे बदल व प्रदूषण याबद्दल लिहिले आहे." },
  { slug: "ayurveda-outdated-5", title: "आयुर्वेद आऊटडेटेड ? मुळीच नाही .5", category: "Research", date: "December 8, 2021", excerpt: "हेवी मेटल्स व आयुर्वेद. शुद्धी डिटॉक्सिफिकेशन अतिशय महत्त्वाचे. अशुद्ध मेटल्स शरीरात गेल्यास काय काय लक्षणे निर्माण होतात." },
  { slug: "ayurveda-outdated-4", title: "आयुर्वेद आऊटडेटेड? मुळीच नाही 4", category: "Research", date: "December 8, 2021", excerpt: "पंचकर्म व विशेषतः रक्तमोक्षण अघोरी उपचार आहेत का? रक्तमोक्षण करीत असताना प्रमाणापेक्षा जास्त रक्तस्त्राव होऊ लागल्यास काय करावे." },
  { slug: "ayurveda-outdated-3", title: "आयुर्वेद आऊटडेटेड ? मुळीच नाही .3", category: "Research", date: "December 8, 2021", excerpt: "आयुर्वेदात शल्यतंत्र नावालाही नाही? मुळव्याध भगंदर परफोरेशन एक्स्त्रॅक्शन ब्लेंडर स्टोन शस्त्रकर्म वर्णन." },
  { slug: "ayurveda-outdated-2", title: "आयुर्वेद आऊटडेटेड ? मुळीच नाही .2", category: "Research", date: "November 26, 2021", excerpt: "आयुर्वेदातील पायाभूत कल्पना चुकीच्या आहेत का? ब्रह्मांडात आहे तेच प्राण्यांमध्ये आहे तेच वनस्पतीत आहे." },
  { slug: "ayurveda-outdated-1", title: "आयुर्वेद आऊटडेटेड ? मुळीच नाही .1", category: "Research", date: "November 19, 2021", excerpt: "आयुर्वेद अपरिवर्तनीय आहे का? आयुर्वेदाला सुरुवातीपासूनच परिवर्तन मान्य आहे. चरकाचार्यांनी सांगितलेल्या रसायन चिकित्सेत पंधराशे वर्षानंतर बदल." },
  { slug: "masanumasik-garbhavardha", title: "मासानुमासिक गर्भवाढ", category: "Prasuti Tantra", date: "November 12, 2021", excerpt: "आयुर्वेदामध्ये स्थुलमानाने गर्भाची गर्भाशयांत मासानुमासिक होणारी वाढ. पहिला महिना ते नववा महिना - संपूर्ण गर्भविज्ञान." },
  { slug: "viddha-agnikarma-shoolhar-chikitsa", title: "विध्द व अग्निकर्म प्रभावी शूलहर चिकित्सा", category: "Shalya Tantra", date: "September 19, 2021", excerpt: "आयुर्वेदिय चिकित्सा करत असताना वेदना व शूल त्वरीत नाहीसा कसा करता येईल. चायनीज वैद्यकशास्त्राशी साम्य." },
  { slug: "rasayana-hiv-chikitsa", title: "रसायन व (HIV) पीडित रुग्णांसाठी चिकित्सा", category: "Kayachikitsa", date: "September 19, 2021", excerpt: "रसायन- शरीराचे बल वाढविणे, पेशींचा क्षय थांबविणे, नवीन पेशींची उत्पत्ती करणे. गुडुची, शतावरी, भुईकोहळा, पिंपळी, अभ्रक, वंगभस्म." },
  { slug: "office-procedures-shalakyatantra", title: "OFFICE PROCEDURES AND COST-EFFECTIVE TREATMENT IN SHALAKYATANTRA", category: "Shalakya Tantra", date: "September 19, 2021", excerpt: "Karna Shula, Manyastambha, Pratishyaya, Tamakashwasa - cost effective treatments. Siravyadha Vidhi in Shalakya Tantra." },
  { slug: "arbuda-tumour", title: "अर्बुद (Tumour)", category: "Kayachikitsa", date: "September 19, 2021", excerpt: "आयुर्वेदांत उंचवटाउंच असे तीन व्याधी - ग्रंथी, गुल्म व अर्बुद. दोषज, छेद्य, निःशेष छेदनानी, असाध्य अर्बुदे." },
  { slug: "swine-flu-h1n1", title: "स्वाइन फ्लू- नवीन त-हेचा फ्लू सात दिवसांचा संततज्वर", category: "Kayachikitsa", date: "September 19, 2021", excerpt: "स्वाइन फ्लू (H1N1) - हा एक नेहमीच्या सात दिवसाच्या संततज्वराचा प्रकार. प्रसार श्वास मार्गातून. लक्षणे व चिकित्सा." },
  { slug: "faqs", title: "FAQs", category: "General", date: "September 18, 2021", excerpt: "According to Su:Sh.6/44 if sadyapranhar Marmas are damaged it could cost one's life. Surgery contraindicated at vital points." },
  { slug: "sangyaharan-ayurvedic-concept", title: "SANGYAHARAN- AN AYURVEDIC CONCEPT", category: "Shalya Tantra", date: "September 18, 2021", excerpt: "By Dr.R.B.Gogate. Many detailed surgical procedures in Ayurveda but not much information about anaesthetics drugs." },
  { slug: "sandhivaat", title: "संधिवात (Sandhivaat)", category: "Kayachikitsa", date: "September 18, 2021", excerpt: "संधिवात म्हणजे संधिशूल. वातकंटक, कलाय खंज, मन्या व कटीग्रह, जानुसंधि विकृति - संपूर्ण वर्णन." },
  { slug: "shalya-shalakyatantriya-shoola", title: "शल्य- शालाक्यतंत्रीय शूल", category: "Shalya Tantra", date: "September 18, 2021", excerpt: "यत् मनोशरीरविघातकरं तत् शल्यम्. वेदना या सुखकर या दुखःकर असू शकतात. Pain is an unpleasant sensory and emotional experience." },
  { slug: "hiv", title: "HIV", category: "Kayachikitsa", date: "September 18, 2021", excerpt: "आता जो जनपदोध्वंस होऊ घातला आहे तो एड्‍सचा! HIV विषाणूचा संसर्ग, फैलाव, Staging in AIDS, आयुर्वेदिक दृष्टिकोन." },
];

export default function ArticlesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-navy/5 text-navy text-xs font-semibold rounded-full mb-4 tracking-wider uppercase">Knowledge Base</span>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-navy mb-4">Articles & Research</h1>
        <p className="text-muted max-w-2xl mx-auto">Complete collection of 29 articles and research papers by Vd. R.B. Gogate on Ayurveda, Shalya Tantra, Shalakya Tantra, Kayachikitsa, and more.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {["All", "Shalakya Tantra", "Viddhakarma", "Agnikarma", "Shalya Tantra", "Kayachikitsa", "Research", "Prasuti Tantra", "General"].map(cat => (
          <button key={cat} className="px-4 py-2 rounded-full text-sm font-medium border hover:bg-navy hover:text-white transition-all">
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <Link key={article.slug} href={`/articles/${article.slug}`} className="card-hover bg-white rounded-2xl border p-6 block">
            <span className="inline-block px-2 py-1 bg-navy/5 text-navy text-xs font-semibold rounded mb-3">
              {article.category}
            </span>
            <h3 className="font-heading text-lg font-bold text-navy mb-2 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-ink-soft mb-4 line-clamp-3">
              {article.excerpt}
            </p>
            <p className="text-xs text-muted">
              {article.date}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
