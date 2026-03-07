import { useState } from "react";

const faqs = [
  {
    question: "Is this a guarantee we'll pass security review?",
    answer:
      "No. We do not guarantee approval, acceptance, or a pass outcome. Review results depend on your customer's reviewers, their standards, and your organization's actual controls, evidence, and risk posture. We provide a review-ready draft, evidence mapping, and gap flags to help your team respond faster and more clearly.",
  },
  {
    question: "What exactly is this service?",
    answer:
      "This is a deadline-driven drafting and response support service for customer security questionnaires. We help your team organize existing policies and evidence, draft clear answers, and prepare a structured deliverable for internal review. We are not replacing your internal authority, legal counsel, or security leadership.",
  },
  {
    question: "Who completes the work?",
    answer:
      "Work is completed by our team through a structured delivery process (single-owner coordination plus a controlled drafting workflow). We do not present this as an automated tool or AI-only output. Your organization remains responsible for final review, edits, approvals, and submission.",
  },
  {
    question:
      "Do you act as our company or communicate with our customer/reviewer?",
    answer:
      "No, not by default. We do not sign documents, make legal commitments, or act as your company in customer communications. Your organization remains the party of record and controls final submission. Any direct customer-facing support would need to be explicitly scoped in writing.",
  },
  {
    question: "What do you need from us to start?",
    answer:
      "At minimum: the questionnaire file/link (or portal access if approved by you), relevant policies/documents/evidence, a point of contact for clarifications, and the selected coverage plan or approved scope. If evidence is incomplete, we can still start and flag missing items.",
  },
  {
    question:
      "What happens if we are missing policies, proof, or internal confirmations?",
    answer:
      "That is common. We flag gaps clearly and identify where additional proof, internal confirmation, or wording changes are needed. We do not invent controls, overstate compliance, or make unsupported claims. Your team decides whether to provide evidence, revise wording, defer an answer, or scope it out.",
  },
  {
    question: "What is included in the deliverable?",
    answer:
      "Depending on the scope/unit, the deliverable typically includes a clean draft questionnaire response, an evidence map (answer to supporting document/control), gap/risk flags, and structured clarification notes within your included clarification rounds. Exact inclusions follow the plan and scope confirmed at intake.",
  },
  {
    question: "What is not included?",
    answer:
      "Unless separately quoted, the service does not include legal advice, contract negotiation, signing on your behalf, full GRC implementation, policy creation from scratch, SOC 2 program buildout, penetration testing/security engineering, or guaranteed review outcomes.",
  },
  {
    question: "How is the 72-hour SLA measured?",
    answer:
      "The SLA is measured per unit, not for the entire month's volume at once. We process units according to your plan and queue priority. If multiple units are submitted, delivery follows the stated queue rule and parallel-processing limit shown in your plan terms.",
  },
  {
    question: "What is a unit?",
    answer:
      "A unit is your pricing/scoping measure (1 unit = up to 75 questions). If a questionnaire exceeds the included volume or requires additional work beyond the plan, it may consume more than one unit or require an overage unit.",
  },
  {
    question: "What happens if we exceed our included units?",
    answer:
      "If you exceed your monthly included units, additional work is handled as overage units at the published overage rate (or current quoted rate if updated). This keeps pricing predictable and avoids surprise scope expansion inside covered units.",
  },
  {
    question: "Can we use rush or 24-hour handling?",
    answer:
      "Yes, when available and confirmed case-by-case. Rush handling is an add-on and depends on queue load, scope clarity, and whether the required inputs are complete enough to support accelerated drafting.",
  },
  {
    question: "What can delay delivery?",
    answer:
      "The most common delays are missing or late evidence, unclear questionnaire access, delayed client clarifications, major scope changes after intake, and requests that exceed the included unit scope. We keep the process structured, but delivery timing depends on timely client inputs.",
  },
  {
    question: "How do you handle sensitive documents?",
    answer:
      "We use a least-privilege, need-to-know workflow and request only what is required for the scoped work. You choose your preferred sharing method (secure links, time-boxed access, or redacted exports). We do not publish client work, and we can operate under NDA-compatible workflows.",
  },
  {
    question: "Who owns the final work product?",
    answer:
      "You retain ownership of your underlying documents, policies, and submitted materials. We provide drafting and organizational support deliverables for your internal use and review. Your organization remains responsible for final decisions, final wording, and final submission.",
  },
  {
    question: "Is this legal, compliance, or certification advice?",
    answer:
      "No. This service is documentation drafting and operational support. It is not legal advice, certification advice, or a substitute for your legal/compliance/security decision-makers.",
  },
  {
    question: "Why is this low-risk for our team?",
    answer:
      "Because we do not take over your authority or make unsupported claims on your behalf. We provide a controlled drafting process using your evidence, with clear gap flags and scope boundaries, while your team keeps control of approvals and submission.",
  },
];

const INITIAL_VISIBLE = 5;

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`flex-shrink-0 transition-transform duration-300 ease-in-out ${
        isOpen ? "rotate-180" : "rotate-0"
      }`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/20">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
        aria-expanded={isOpen}
      >
        <span className="text-white cursor-pointer text-sm sm:text-xl font-medium leading-normal">
          {question}
        </span>
        <span className="text-white/60 cursor-pointer group-hover:text-white transition-colors duration-200">
          <ChevronIcon isOpen={isOpen} />
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-white/70 text-base leading-relaxed pb-5 pr-8">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [showAll, setShowAll] = useState(false);

  const visibleFaqs = showAll ? faqs : faqs.slice(0, INITIAL_VISIBLE);

  return (
    <section
      id="faq"
      className="w-full pb-10 sm:pb-14 px-10 sm:px-10 lg:px-20"
      style={{ maxWidth: "1920px", margin: "0 auto" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-white text-3xl sm:text-4xl lg:text-6xl font-semibold leading-normal mb-4">
            Frequently Asked
            <br />
            Questions
          </h2>
          <p className="text-white/70 text-sm sm:text-xl">
            Fast answers to the questions buyers and internal teams typically
            ask.
          </p>
        </div>

        {/* FAQ List */}
        <div>
          {visibleFaqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* See More / See Less Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="flex items-center gap-2 text-white/78 cursor-pointer hover:text-white text-sm sm:text-base font-medium transition-colors duration-200 group"
          >
            <span>
              {showAll
                ? "See less"
                : `See more (${faqs.length - INITIAL_VISIBLE} more questions)`}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${showAll ? "rotate-180" : "rotate-0"}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
