import { NextRequest, NextResponse } from "next/server";

const knowledge = {
  fellowship: "The Viddhakarma Research Fellowship offers grants up to ₹75,000 for evidence-based Ayurvedic research. Applications are reviewed by an expert panel. Visit /fellowship to apply.",
  seminar: "VGMF hosts an annual National Seminar on Agnikarma & Viddhakarma. Practitioners, researchers, and students from across India participate. Visit /seminar to register.",
  autism: "The Autism Awareness Programme provides free therapy and support for children on the autism spectrum. Pre-registration is open to all families. Visit /autism to learn more.",
  contact: "You can reach us at care@vaidyagogate.org or call +91 93737 92952. Our clinic is at Ramprasad Chambers, Nana Peth, Pune.",
};

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const msg = message.toLowerCase();
  let reply = "I can help with information about our Fellowship programme, National Seminar, Autism programme, or contact details. What would you like to know?";
  
  if (msg.includes("fellow")) reply = knowledge.fellowship;
  else if (msg.includes("seminar")) reply = knowledge.seminar;
  else if (msg.includes("autism")) reply = knowledge.autism;
  else if (msg.includes("contact") || msg.includes("email") || msg.includes("phone")) reply = knowledge.contact;
  
  return NextResponse.json({ reply });
}
