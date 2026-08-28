"use client";

import { Check, MessageCircle, Minus, Plus } from "lucide-react";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { Language } from "./language-context";

const homes = [
  { label: "1 BHK", price: 2500 },
  { label: "2 BHK", price: 3500 },
  { label: "3 BHK", price: 4500 },
  { label: "4 BHK", price: 5500 },
];

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const calculatorCopy = {
  en: { kicker:"Plan your clean", title:"Build a quick price estimate.", lead:"Select your home size and any specialist services. We’ll confirm the final price after understanding the condition and scope.", assurance:"Based on CleanMate’s published starting prices", home:"Choose your home size", extras:"Add specialist services", labels:[["Bathroom","₹600 each"],["Kitchen","₹1,200 each"],["5-seater sofa","₹1,200 each"],["Mattress","₹700 each"]], total:"Estimated starting price", send:"Send estimate on WhatsApp", note:"This is a planning estimate, not a final quotation. Site condition, location and service requirements may affect the price.", message:"Hi CleanMate, I'd like a quote for" },
  hi: { kicker:"अपनी सफाई चुनें", title:"तुरंत कीमत का अनुमान पाएँ।", lead:"अपने घर का आकार और अतिरिक्त सेवाएँ चुनें। स्थिति और काम समझने के बाद हम अंतिम कीमत की पुष्टि करेंगे।", assurance:"CleanMate की प्रकाशित शुरुआती कीमतों पर आधारित", home:"घर का आकार चुनें", extras:"अतिरिक्त सेवाएँ जोड़ें", labels:[["बाथरूम","₹600 प्रत्येक"],["रसोई","₹1,200 प्रत्येक"],["5-सीटर सोफा","₹1,200 प्रत्येक"],["गद्दा","₹700 प्रत्येक"]], total:"अनुमानित शुरुआती कीमत", send:"WhatsApp पर अनुमान भेजें", note:"यह केवल योजना के लिए अनुमान है, अंतिम कोटेशन नहीं। स्थान, स्थिति और आवश्यकता से कीमत बदल सकती है।", message:"नमस्ते CleanMate, मुझे कोटेशन चाहिए:" },
  as: { kicker:"আপোনাৰ পৰিষ্কাৰ বাছক", title:"দ্ৰুত মূল্য অনুমান কৰক।", lead:"ঘৰৰ আকাৰ আৰু অতিৰিক্ত সেৱা বাছক। অৱস্থা আৰু কাম বুজাৰ পিছত আমি চূড়ান্ত মূল্য নিশ্চিত কৰিম।", assurance:"CleanMate-ৰ প্ৰকাশিত আৰম্ভণি মূল্যৰ ভিত্তিত", home:"ঘৰৰ আকাৰ বাছক", extras:"অতিৰিক্ত সেৱা যোগ কৰক", labels:[["স্নানাগাৰ","₹600 প্ৰতিটো"],["পাকঘৰ","₹1,200 প্ৰতিটো"],["5-আসনৰ ছোফা","₹1,200 প্ৰতিটো"],["গাদি","₹700 প্ৰতিটো"]], total:"আনুমানিক আৰম্ভণি মূল্য", send:"WhatsApp-ত অনুমান পঠিয়াওক", note:"এয়া কেৱল পৰিকল্পনাৰ অনুমান, চূড়ান্ত মূল্য নহয়। স্থান, অৱস্থা আৰু প্ৰয়োজন অনুসৰি মূল্য সলনি হ’ব পাৰে।", message:"নমস্কাৰ CleanMate, মই মূল্য জানিব বিচাৰোঁ:" },
} as const;

function Stepper({ label, detail, value, onChange }: { label: string; detail: string; value: number; onChange: Dispatch<SetStateAction<number>> }) {
  return <div className="calculator-option"><div><b>{label}</b><span>{detail}</span></div><div className="stepper"><button type="button" aria-label={`Remove ${label}`} onClick={() => onChange((current) => Math.max(0, current - 1))} disabled={value === 0}><Minus size={15}/></button><output aria-label={`${label} quantity`}>{value}</output><button type="button" aria-label={`Add ${label}`} onClick={() => onChange((current) => Math.min(10, current + 1))}><Plus size={15}/></button></div></div>;
}

export function PricingCalculator({ language }: { language: Language }) {
  const c = calculatorCopy[language];
  const [homeIndex, setHomeIndex] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [kitchens, setKitchens] = useState(0);
  const [sofas, setSofas] = useState(0);
  const [mattresses, setMattresses] = useState(0);
  const home = homes[homeIndex];
  const total = home.price + bathrooms * 600 + kitchens * 1200 + sofas * 1200 + mattresses * 700;

  const whatsappHref = useMemo(() => {
    const extras = [
      bathrooms && `${bathrooms} bathroom deep clean${bathrooms > 1 ? "s" : ""}`,
      kitchens && `${kitchens} kitchen deep clean${kitchens > 1 ? "s" : ""}`,
      sofas && `${sofas} × 5-seater sofa cleaning`,
      mattresses && `${mattresses} mattress cleaning${mattresses > 1 ? "s" : ""}`,
    ].filter(Boolean);
    const message = `${c.message} ${home.label}${extras.length ? `, ${extras.join(", ")}` : ""}. ${c.total}: ${formatPrice(total)}.`;
    return `https://wa.me/919774883172?text=${encodeURIComponent(message)}`;
  }, [bathrooms, c, home, kitchens, mattresses, sofas, total]);

  return <section className="calculator-section" id="calculator"><div className="calculator-intro"><p className="kicker">{c.kicker}</p><h2>{c.title}</h2><p>{c.lead}</p><div className="calculator-assurance"><Check size={17}/><span>{c.assurance}</span></div></div><div className="calculator-card"><fieldset><legend>{c.home}</legend><div className="home-size-grid">{homes.map((option, index)=><button type="button" key={option.label} className={homeIndex === index ? "is-selected" : ""} aria-pressed={homeIndex === index} onClick={() => setHomeIndex(index)}><b>{option.label}</b><span>{formatPrice(option.price)}</span></button>)}</div></fieldset><fieldset><legend>{c.extras}</legend><div className="calculator-options"><Stepper label={c.labels[0][0]} detail={c.labels[0][1]} value={bathrooms} onChange={setBathrooms}/><Stepper label={c.labels[1][0]} detail={c.labels[1][1]} value={kitchens} onChange={setKitchens}/><Stepper label={c.labels[2][0]} detail={c.labels[2][1]} value={sofas} onChange={setSofas}/><Stepper label={c.labels[3][0]} detail={c.labels[3][1]} value={mattresses} onChange={setMattresses}/></div></fieldset><div className="estimate-total"><div><span>{c.total}</span><strong data-testid="estimate-total">{formatPrice(total)}</strong></div><a className="button button-green" href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={18}/> {c.send}</a></div><p className="estimate-note">{c.note}</p></div></section>;
}
