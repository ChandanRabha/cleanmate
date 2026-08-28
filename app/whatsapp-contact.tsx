"use client";

import { MessageCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { Language } from "./language-context";

const contactCopy = {
  en: { message: "Hi CleanMate, I'd like to book a cleaning service.", lead: "Tell us what needs cleaning and where you’re located. Our team will get back to you with a tailored quote on WhatsApp.", scan: "Scan to chat", name: "WhatsApp CleanMate", button: "Message on WhatsApp", title: "Scan to contact CleanMate on WhatsApp" },
  hi: { message: "नमस्ते CleanMate, मैं सफाई सेवा बुक करना चाहता/चाहती हूँ।", lead: "हमें बताएँ कि क्या साफ करवाना है और आपका स्थान कहाँ है। हमारी टीम WhatsApp पर उपयुक्त कोटेशन भेजेगी।", scan: "चैट के लिए स्कैन करें", name: "WhatsApp CleanMate", button: "WhatsApp पर संदेश भेजें", title: "WhatsApp पर CleanMate से संपर्क करने के लिए स्कैन करें" },
  as: { message: "নমস্কাৰ CleanMate, মই পৰিষ্কাৰ সেৱা বুক কৰিব বিচাৰোঁ।", lead: "কি পৰিষ্কাৰ কৰিব লাগে আৰু আপোনাৰ স্থান ক’ত জনাওক। আমাৰ দলে WhatsApp-ত উপযুক্ত মূল্য জনাব।", scan: "চেট কৰিবলৈ স্কেন কৰক", name: "WhatsApp CleanMate", button: "WhatsApp-ত বাৰ্তা পঠিয়াওক", title: "WhatsApp-ত CleanMate-ৰ সৈতে যোগাযোগ কৰিবলৈ স্কেন কৰক" },
} as const;

export function WhatsAppContact({ language }: { language: Language }) {
  const c = contactCopy[language];
  const whatsappHref = `https://wa.me/918638785565?text=${encodeURIComponent(c.message)}`;
  return <div className="contact-copy"><p>{c.lead}</p><div className="whatsapp-contact-card"><a className="whatsapp-qr" href={whatsappHref} target="_blank" rel="noreferrer" aria-label={c.title}><QRCodeSVG value={whatsappHref} size={132} level="M" marginSize={2} title={c.title} data-testid="whatsapp-qr" /></a><div className="whatsapp-contact-details"><span>{c.scan}</span><b>{c.name}</b><p>+91 97748 83172</p><a className="button button-light" href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={17} /> {c.button}</a></div></div></div>;
}
