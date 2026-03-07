"use client";

import { useRef } from "react";
import { motion, useInView, cubicBezier } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

/* ─── Types ──────────────────────────────────────────────── */
interface PlanFeature {
  text: string;
}

interface Plan {
  badge?: string;
  title: string;
  price: string;
  period?: string;
  description?: string;
  features: PlanFeature[];
  overageUnit?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  highlighted?: boolean;
}

interface FootnoteItem {
  label: string;
  text: string;
}

interface PlansSectionProps {
  heading?: string;
  subheading?: string;
  badge?: string;
  plans?: Plan[];
  footnotes?: FootnoteItem[];
  showFootnotes?: boolean;
}

/* ─── Default Data ───────────────────────────────────────── */
const defaultPlans: Plan[] = [
  {
    title: "Starter",
    price: "$2,900",
    period: "/month",
    description:
      "For steady teams who want reliable help without paying for unused capacity.",
    features: [
      { text: "4 units included (≈ up to 300 questions/month)" },
      { text: "72-hour SLA per unit (queue-based)" },
      { text: "1 clarification round included" },
      { text: "Overage unit: $750" },
    ],
    primaryCTA: "Start intake",
    highlighted: false,
  },
  {
    badge: "Most chosen",
    title: "Coverage — 8 Units / Month",
    price: "$5,000",
    period: "/month",
    description:
      "The default for active sales cycles. Enough capacity to support multiple deals without fire drills.",
    features: [
      { text: "8 units included (≈ up to 600 questions/month)" },
      { text: "72-hour SLA per unit (priority queue)" },
      { text: "Up to 2 clarification rounds" },
      { text: "Overage unit: $750 + Rush add-on available" },
    ],
    primaryCTA: "Start intake",
    // secondaryCTA: "What's include",
    highlighted: true,
  },
  {
    badge: "Scale",
    title: "Coverage — 16 Units / Month",
    price: "$8,500",
    period: "/month",
    description:
      "For teams with constant inbound security reviews and multiple parallel opportunities.",
    features: [
      { text: "16 units included (≈ up to 1,200 questions/month)" },
      { text: "48–72h SLA per unit (fast lane)" },
      { text: "Up to 2 clarification rounds" },
      { text: "Overage unit: $700 + Rush add-on available" },
    ],
    primaryCTA: "Start intake",
    highlighted: false,
  },
];

const defaultFootnotes: FootnoteItem[] = [
  {
    label: "Queue rule (keeps the SLA honest):",
    text: "72-hour SLA is measured per unit. We process up to 2 units in parallel. Additional units enter the queue in the order received.",
  },
  {
    label: "Overages:",
    text: "If you exceed your included units, you can add units at the overage rate. No renegotiation, no surprise invoices.",
  },
  {
    label: "Rush add-on:",
    text: "When available, convert a unit to 24-hour handling for an additional fee (confirmed case-by-case).",
  },
];

/* ─── Card Variants ──────────────────────────────────────── */
const centerVariant = {
  hidden: { opacity: 0, scale: 0.88, y: 20, zIndex: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    zIndex: 10,
    transition: {
      duration: 1.4,
      ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
      delay: 0,
    },
  },
};

const leftVariant = {
  hidden: { opacity: 0, x: "35%", scale: 0.9, zIndex: 5 },
  visible: {
    opacity: 1,
    x: "0%",
    scale: 1,
    zIndex: 5,
    transition: {
      duration: 1.5,
      ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
      delay: 0.25,
    },
  },
};

const rightVariant = {
  hidden: { opacity: 0, x: "-35%", scale: 0.9, zIndex: 5 },
  visible: {
    opacity: 1,
    x: "0%",
    scale: 1,
    zIndex: 5,
    transition: {
      duration: 1.5,
      ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
      delay: 0.25,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
      delay: i * 0.2,
    },
  }),
};

const footnoteVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: cubicBezier(0.25, 0.46, 0.45, 0.94) },
  },
};

const featureItem = {
  hidden: { opacity: 0, filter: "blur(4px)", y: 8 },
  visible: (i = 0) => ({
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.9,
      ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
      delay: 0.5 + i * 0.12,
    },
  }),
};

/* ─── PlanCard ───────────────────────────────────────────── */
function PlanCard({ plan, inView }: { plan: Plan; inView: boolean }) {
  const {
    badge,
    title,
    price,
    period,
    description,
    features,
    primaryCTA,
    secondaryCTA,
    highlighted,
  } = plan;

  return (
    <div
      className={`relative flex flex-col rounded-2xl transition-colors duration-300 group
        ${
          highlighted
            ? "border-2 border-[#14EC5C]/60 bg-[#131a14] py-14 px-8 lg:px-10 shadow-2xl hover:border-[#14EC5C] hover:shadow-[0_0_40px_rgba(20,236,92,0.12)]"
            : "border border-white/10 bg-[rgba(255,255,255,0.03)] py-8 px-6 hover:border-white/20 hover:bg-[rgba(255,255,255,0.055)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        }`}
      style={highlighted ? { minHeight: "680px" } : undefined}
    >
      <div className="flex flex-col flex-1">
        {badge && (
          <div className="mb-3">
            <span
              className="text-lg font-medium uppercase"
              style={{ color: "#fff" }}
            >
              {badge}
            </span>
          </div>
        )}

        {!badge && (
          <p className="text-white text-lg font-medium mb-2 uppercase tracking-wider">
            {title.split("—")[0].trim()}
          </p>
        )}

        <h3 className="text-white font-medium text-2xl leading-tight mb-3">
          {highlighted
            ? title
            : `Coverage — ${title.includes("Units") ? title.split("—")[1]?.trim() : "4 Units / Month"}`}
        </h3>

        <div className="flex items-baseline gap-1 mb-3">
          <span className="font-medium text-3xl text-white">{price}</span>
          <span className="text-white/60 text-2xl">{period}</span>
        </div>

        {description && (
          <p className="text-white/60 text-base leading-relaxed mb-5">
            {description}
          </p>
        )}

        <div className="border-t border-white/[0.07] mb-5" />

        <ul className="flex flex-col gap-3">
          {features.map((f, i) => (
            <motion.li
              key={i}
              className="flex items-start gap-2.5"
              variants={featureItem}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i}
            >
              <span className="mt-2 shrink-0">
                <FaCheckCircle size={18} color="#14EC5C" />
              </span>
              <span className="text-white/70 text-xl leading-relaxed">
                {f.text}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div
        className={`flex gap-2 mt-6 ${secondaryCTA ? "flex-row justify-between" : "flex-col"}`}
      >
        {primaryCTA && (
          <button
            className={`flex-1 py-2.5 rounded-[10px] text-lg transition-all duration-200 hover:scale-[1.03] active:scale-95
              ${
                highlighted
                  ? "text-white bg-[#43FEA4]/55 border border-white/15 hover:border-white/30 hover:bg-white/5"
                  : "text-white border border-white/15 hover:border-white/30 hover:bg-[#14EC5C] hover:text-black bg-[#43FEA4]/55 w-full md:w-1/2"
              }`}
          >
            {primaryCTA}
          </button>
        )}
        {secondaryCTA && (
          <button className="flex-1 py-2.5 rounded-[10px] text-lg bg-[#43FEA4]/55 text-white border border-white/15 hover:border-white/30 hover:bg-white/5 transition-all duration-200 hover:scale-[1.03] active:scale-95">
            {secondaryCTA}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */
export default function PlansSection({
  heading = "Plans",
  subheading = "Choose monthly coverage (recommended) for predictable deal support. Each plan includes a defined number of units.\nOverages are simple: add units when you exceed your monthly allowance.",
  badge = "1 unit = up to 75 questions",
  plans = defaultPlans,
  footnotes = defaultFootnotes,
  showFootnotes = true,
}: PlansSectionProps) {
  const headerRef = useRef(null);
  const cardsRef = useRef(null);
  const footnoteRef = useRef(null);

  const headerInView = useInView(headerRef, { once: true, amount: 0.25 });
  const cardsInView = useInView(cardsRef, { once: true, amount: 0.2 });
  const footnoteInView = useInView(footnoteRef, { once: true, amount: 0.3 });

  const cardVariants = [leftVariant, centerVariant, rightVariant];

  return (
    <section id="plans" className="w-full pb-10 lg:pb-14">
      <style>{`
        @keyframes plans-dot-ping {
          0%   { transform: scale(1); opacity: 0.7; }
          70%  { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>

      <div className="max-w-[1440px] mx-auto px-10 sm:px-10 lg:px-20">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col items-center text-center mb-8"
        >
          <motion.h2
            className="text-white font-medium text-4xl sm:text-6xl tracking-normal mb-8"
            variants={fadeUp}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            custom={0}
          >
            {heading}
          </motion.h2>
          <motion.p
            className="text-white/60 text-sm sm:text-xl leading-normal whitespace-pre-line"
            variants={fadeUp}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            custom={1}
          >
            {subheading}
          </motion.p>
        </div>

        {/* Badge with pulsing dot */}
        <motion.div
          className="flex justify-center mb-10"
          variants={fadeUp}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          custom={2}
        >
          <div
            className="px-8 py-2.5 rounded-full text-white text-base font-medium"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            <span className="inline-flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full rounded-full bg-[#14EC5C] opacity-75"
                  style={{
                    animation:
                      "plans-dot-ping 1.6s cubic-bezier(0,0,0.2,1) infinite",
                  }}
                />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14EC5C]" />
              </span>
              {badge}
            </span>
          </div>
        </motion.div>

        {/* Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 mb-8 items-center"
          style={{ overflow: "visible" }}
        >
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              variants={cardVariants[i]}
              initial="hidden"
              animate={cardsInView ? "visible" : "hidden"}
              style={{ position: "relative" }}
              whileHover={
                plan.highlighted
                  ? {
                      y: -8,
                      transition: {
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    }
                  : {
                      y: -6,
                      transition: {
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    }
              }
            >
              <PlanCard plan={plan} inView={cardsInView} />
            </motion.div>
          ))}
        </div>

        {/* Footnotes */}
        {showFootnotes && footnotes && footnotes.length > 0 && (
          <motion.div
            ref={footnoteRef}
            className="rounded-2xl px-6 sm:px-8 py-5 flex flex-col gap-2 bg-[#131a14]"
            style={{
              // background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
            variants={footnoteVariant}
            initial="hidden"
            animate={footnoteInView ? "visible" : "hidden"}
          >
            {footnotes.map((fn, i) => (
              <motion.p
                key={i}
                className="text-white text-xl font-medium leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                animate={
                  footnoteInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                }
                transition={{
                  duration: 1.0,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.15 + i * 0.18,
                }}
              >
                <span className="text-white font-medium">{fn.label} </span>
                {fn.text}
              </motion.p>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
