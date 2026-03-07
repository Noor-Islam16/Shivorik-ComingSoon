"use client";

import { useRef } from "react";
import { motion, useInView, cubicBezier } from "framer-motion";

const included = [
  "Draft questionnaire responses aligned to your available policies + evidence.",
  "Evidence map (what supports each answer).",
  'Clear "missing proof" flags and recommended next steps.',
  "One structured clarification round (two if needed).",
];

const notIncluded = [
  "Writing brand-new policies, full GRC implementation, or SOC 2 program buildouts.",
  "Pen tests, vulnerability scanning, or active security engineering work.",
  "Legal review, contract negotiation, or signing on your behalf.",
  "Guaranteeing acceptance of your security review.",
];

/* ── Variants ───────────────────────────────────────────── */

const headerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.3,
      ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
      delay: i * 0.22,
    },
  }),
};

// 3D card: starts rotated on Y axis + tilted on X, fades in slowly
const card3D = {
  hidden: {
    opacity: 0,
    rotateY: 18,
    rotateX: -8,
    y: 40,
    scale: 0.96,
  },
  visible: (i = 0) => ({
    opacity: 1,
    rotateY: 0,
    rotateX: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.6,
      ease: cubicBezier(0.22, 1, 0.36, 1),
      delay: i * 0.3,
    },
  }),
};

// Each list item fades + slides up with stagger
const listItem = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.1,
      ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
      delay: 0.5 + i * 0.16,
    },
  }),
};

/* ── Icons ──────────────────────────────────────────────── */

function CheckIcon({ className }: { className?: string }) {
  return (
    <span
      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${className || ""}`}
      style={{ background: "#14b87a" }}
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path
          d="M2.5 6.5L5.5 9.5L10.5 3.5"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function CrossIcon({ className }: { className?: string }) {
  return (
    <span
      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${className || ""}`}
      style={{ background: "#e05252" }}
    >
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path
          d="M2 2L9 9M9 2L2 9"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

/* ── Component ──────────────────────────────────────────── */

export default function ScopeDefinition() {
  const headerRef = useRef(null);
  const cardsRef = useRef(null);

  const headerInView = useInView(headerRef, { once: true, amount: 0.25 });
  const cardsInView = useInView(cardsRef, { once: true, amount: 0.2 });

  return (
    <section
      id="scope"
      className="w-full px-10 sm:px-10 lg:px-20 pb-10 sm:pb-14"
      style={{ maxWidth: "1440px", margin: "0 auto", perspective: "1200px" }}
    >
      {/* Header */}
      <div ref={headerRef} className="mb-10 sm:mb-14">
        <motion.h2
          className="text-white text-3xl sm:text-4xl lg:text-6xl font-medium leading-tight mb-4"
          variants={headerVariants}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          custom={0}
        >
          Scope definition
        </motion.h2>
        <motion.p
          className="text-white/60 font-light text-sm sm:text-xl max-w-xl leading-relaxed"
          variants={headerVariants}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          custom={1}
        >
          The rescue stays fast because we keep scope clear. If you need extra
          work, we quote it separately.
        </motion.p>
      </div>

      {/* Cards */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        style={{ perspective: "1200px" }}
      >
        {/* ── Included ── */}
        <motion.div
          className="rounded-2xl p-7 sm:p-9 flex flex-col gap-5 bg-black/25"
          style={{ transformStyle: "preserve-3d" }}
          variants={card3D}
          initial="hidden"
          animate={cardsInView ? "visible" : "hidden"}
          custom={0}
          whileHover={{
            y: -6,
            scale: 1.015,
            boxShadow:
              "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(20,184,122,0.25)",
            transition: {
              duration: 0.45,
              ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
            },
          }}
        >
          <h3 className="text-white text-lg sm:text-xl font-semibold mb-1">
            Included
          </h3>
          <ul className="flex flex-col gap-4">
            {included.map((item, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3"
                variants={listItem}
                initial="hidden"
                animate={cardsInView ? "visible" : "hidden"}
                custom={i}
              >
                <CheckIcon className="mt-1" />
                <span className="text-white/60 text-lg leading-relaxed">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* ── Not Included ── */}
        <motion.div
          className="rounded-2xl p-7 sm:p-9 flex flex-col gap-5 bg-black/25"
          style={{ transformStyle: "preserve-3d" }}
          variants={card3D}
          initial="hidden"
          animate={cardsInView ? "visible" : "hidden"}
          custom={1}
          whileHover={{
            y: -6,
            scale: 1.015,
            boxShadow:
              "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(224,82,82,0.25)",
            transition: {
              duration: 0.45,
              ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
            },
          }}
        >
          <h3 className="text-white text-lg sm:text-xl font-semibold mb-1">
            Not included (quoted separately)
          </h3>
          <ul className="flex flex-col gap-4">
            {notIncluded.map((item, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3"
                variants={listItem}
                initial="hidden"
                animate={cardsInView ? "visible" : "hidden"}
                custom={i}
              >
                <CrossIcon className="mt-1" />
                <span className="text-white/60 text-lg leading-relaxed">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
