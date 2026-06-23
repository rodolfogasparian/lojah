"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  id: string;
  title: string;
  content: string;
}

interface Props {
  faqs: FaqItem[];
}

export function FaqAccordion({ faqs }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (faqs.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-xl border">
        <p className="text-muted-foreground text-sm">Nenhuma pergunta cadastrada ainda.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div key={faq.id} className="bg-white rounded-xl border overflow-hidden">
            <button
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-sm">{faq.title}</span>
              <ChevronDown className={`size-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                {faq.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
