"use client";

import { useState } from "react";

type Faq = { id: string; question: string; answer: string };

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id || null);

  return (
    <dl className="faq-list">
      {faqs.map((f) => {
        const isOpen = open === f.id;
        return (
          <div key={f.id} className="faq-item">
            <dt>
              <button
                type="button"
                className={`faq-q${isOpen ? " is-open" : ""}`}
                onClick={() => setOpen(isOpen ? null : f.id)}
                aria-expanded={isOpen}
              >
                <span className="faq-q-text">{f.question}</span>
                <svg
                  className={`faq-chevron${isOpen ? " is-open" : ""}`}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </dt>
            {isOpen && <dd className="faq-a">{f.answer}</dd>}
          </div>
        );
      })}
    </dl>
  );
}
