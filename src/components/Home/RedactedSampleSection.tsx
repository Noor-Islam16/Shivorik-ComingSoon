"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView, cubicBezier } from "framer-motion";

interface StyleWinRow {
  label: string;
  value: string;
}

interface RedactedSampleProps {
  heading?: string;
  subheading?: string;
  badgeText?: string;
  questionTitle?: string;
  answerDraft?: string[];
  evidenceMap?: string[];
  flagNote?: string;
  whyTitle?: string;
  whyDescription?: string;
  styleWins?: StyleWinRow[];
}

const defaultAnswerDraft = [
  "In transit: Yes. We enforce TLS 1.2+ for all externally exposed endpoints and service-to-service traffic where applicable.",
  "At rest: Yes. Production data stores use platform-native encryption at rest.",
  "Key management: Keys are managed using a dedicated key management service with access controls and audit logging.",
  "Verification: Encryption configurations are validated through infrastructure reviews and periodic control checks.",
];

const defaultEvidenceMap = [
  "Security Policy — Encryption Standard (section 3.1–3.4)",
  "Cloud KMS / Key Rotation settings (screenshot or config export)",
  "Architecture diagram — data flow / boundary notes",
  "Logging policy — audit events retained for review",
];

const defaultStyleWins: StyleWinRow[] = [
  { label: "Default tone", value: "precise, conservative, review-friendly" },
  { label: "Goal", value: "reduce back-and-forth" },
  { label: "Approach", value: "evidence first" },
];

/* ── Easing ─────────────────────────────────────────────── */
const smooth = cubicBezier(0.42, 0, 0.58, 1);
const expo = cubicBezier(0.22, 1, 0.36, 1);

/* ── Variants ───────────────────────────────────────────── */
const curtainReveal = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 1 },
  visible: (i = 0) => ({
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: { duration: 1.5, ease: smooth, delay: i * 0.25 },
  }),
};

const irisReveal = {
  hidden: {
    clipPath: "inset(12% 6% 12% 6% round 24px)",
    opacity: 0,
    scale: 0.97,
  },
  visible: (i = 0) => ({
    clipPath: "inset(0% 0% 0% 0% round 24px)",
    opacity: 1,
    scale: 1,
    transition: { duration: 1.6, ease: smooth, delay: i * 0.35 },
  }),
};

const blurFade = {
  hidden: { opacity: 0, filter: "blur(6px)", y: 10 },
  visible: (i = 0) => ({
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 1.0, ease: smooth, delay: 0.6 + i * 0.14 },
  }),
};

const rowSlide = {
  hidden: { opacity: 0, x: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 1.1, ease: smooth, delay: 0.7 + i * 0.16 },
  }),
};

/* ── Mouse spotlight hook ────────────────────────────────── */
function useSpotlight() {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return { ref, pos, active, setActive, onMove };
}

/* ── Animated gradient border (CSS keyframes injected once) ─ */
const STYLE_TAG = `
@keyframes border-spin {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes ambient-pulse {
  0%, 100% { opacity: 0.18; transform: scale(1); }
  50%       { opacity: 0.32; transform: scale(1.08); }
}
@keyframes dot-ping {
  0%   { transform: scale(1); opacity: 0.7; }
  70%  { transform: scale(2.2); opacity: 0; }
  100% { transform: scale(2.2); opacity: 0; }
}
`;

/* ── Component ──────────────────────────────────────────── */
export default function RedactedSampleSection({
  heading = "Redacted sample (structure)",
  subheading = "This is intentionally generic — just enough to show the style without revealing any client details.",
  badgeText = 'Example: "Data encryption" question',
  questionTitle = "Q: Do you encrypt data at rest and in transit?",
  answerDraft = defaultAnswerDraft,
  evidenceMap = defaultEvidenceMap,
  flagNote = 'If "service-to-service TLS" is not universal, we phrase as "where applicable" and list exceptions.',
  whyTitle = "Why this style wins",
  whyDescription = "Reviewers want crisp answers that match evidence. We keep language defensible, avoid over-claiming, and point to proof.",
  styleWins = defaultStyleWins,
}: RedactedSampleProps) {
  const headerRef = useRef(null);
  const badgeRef = useRef(null);
  const cardsRef = useRef(null);

  const headerInView = useInView(headerRef, { once: true, amount: 0.25 });
  const badgeInView = useInView(badgeRef, { once: true, amount: 0.5 });
  const cardsInView = useInView(cardsRef, { once: true, amount: 0.2 });

  const leftSpot = useSpotlight();
  const rightSpot = useSpotlight();

  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <section id="why-this-works" className="w-full pb-10 lg:pb-14">
      <style>{STYLE_TAG}</style>

      <div className="max-w-[1440px] mx-auto px-10 sm:px-10 lg:px-20">
        {/* ── Header ── */}
        <div ref={headerRef} className="mb-3 overflow-hidden">
          <motion.h2
            className="text-white font-medium text-3xl sm:text-4xl lg:text-6xl tracking-normal mb-5"
            variants={curtainReveal}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            custom={0}
          >
            {heading}
          </motion.h2>
          <motion.p
            className="text-white/60 text-sm sm:text-xl leading-normal max-w-2xl"
            variants={curtainReveal}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            custom={1}
          >
            {subheading}
          </motion.p>
        </div>

        {/* ── Badge ── */}
        <div ref={badgeRef} className="flex justify-end mb-6">
          <motion.div
            className="relative px-4 py-2 rounded-full text-white text-xs sm:text-base overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
            initial={{ opacity: 0, x: 30 }}
            animate={badgeInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{
              borderColor: "rgba(20,236,92,0.3)",
              boxShadow:
                "0 0 24px rgba(20,236,92,0.12), inset 0 1px 0 rgba(255,255,255,0.07)",
              transition: { duration: 0.35 },
            }}
          >
            {/* live dot */}
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full rounded-full bg-[#14EC5C] opacity-75"
                  style={{
                    animation: "dot-ping 1.6s cubic-bezier(0,0,0.2,1) infinite",
                  }}
                />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14EC5C]" />
              </span>
              {badgeText}
            </span>
          </motion.div>
        </div>

        {/* ── Two Column Layout ── */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ══════════════════════════════════════════════
              LEFT CARD — Document / answer draft
          ══════════════════════════════════════════════ */}
          <motion.div
            ref={leftSpot.ref}
            className="relative rounded-2xl p-6 sm:p-8 flex flex-col gap-5 overflow-hidden"
            style={{
              background: "#05050A",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            variants={irisReveal}
            initial="hidden"
            animate={cardsInView ? "visible" : "hidden"}
            custom={0}
            onMouseMove={leftSpot.onMove}
            onMouseEnter={() => leftSpot.setActive(true)}
            onMouseLeave={() => leftSpot.setActive(false)}
            whileHover={{
              borderColor: "rgba(255,255,255,0.14)",
              boxShadow: "0 24px 72px rgba(0,0,0,0.7)",
              transition: { duration: 0.45 },
            }}
          >
            {/* Ambient background blob */}
            <div
              className="absolute -top-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
                animation: "ambient-pulse 5s ease-in-out infinite",
              }}
            />

            {/* Mouse spotlight */}
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              animate={{
                background: leftSpot.active
                  ? `radial-gradient(280px circle at ${leftSpot.pos.x}% ${leftSpot.pos.y}%, rgba(255,255,255,0.045) 0%, transparent 70%)`
                  : "radial-gradient(280px circle at 50% 50%, transparent 0%, transparent 70%)",
              }}
              transition={{ duration: 0.08 }}
            />

            {/* Top edge shimmer line */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
              }}
              animate={{ opacity: leftSpot.active ? 1 : 0.4 }}
              transition={{ duration: 0.4 }}
            />

            {/* ── Question ── */}
            <motion.p
              className="relative text-white font-medium text-sm sm:text-xl"
              whileHover={{
                color: "rgba(255,255,255,1)",
                transition: { duration: 0.2 },
              }}
            >
              {questionTitle}
            </motion.p>

            {/* ── Answer Draft ── */}
            <div className="relative flex flex-col gap-1 font-light">
              <p className="text-white/40 text-xs lg:text-sm uppercase tracking-widest mb-2 font-medium">
                A (draft)
              </p>
              <ul className="flex flex-col gap-2.5">
                {answerDraft.map((line, i) => (
                  <motion.li
                    key={i}
                    className="group flex gap-3 text-white/75 text-xs lg:text-base leading-relaxed cursor-default"
                    variants={blurFade}
                    initial="hidden"
                    animate={cardsInView ? "visible" : "hidden"}
                    custom={i}
                    whileHover={{
                      color: "rgba(255,255,255,0.95)",
                      x: 3,
                      transition: { duration: 0.2 },
                    }}
                  >
                    {/* animated bullet */}
                    <motion.span
                      className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "rgba(255,255,255,0.2)" }}
                      whileHover={{ background: "#14EC5C", scale: 1.4 }}
                      transition={{ duration: 0.2 }}
                    />
                    <span>{line}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* divider */}
            <motion.div
              className="relative border-t"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
              animate={
                leftSpot.active ? { borderColor: "rgba(255,255,255,0.1)" } : {}
              }
              transition={{ duration: 0.4 }}
            />

            {/* ── Evidence Map ── */}
            <div className="relative flex flex-col gap-1 font-light">
              <p className="text-white/40 text-xs lg:text-sm uppercase tracking-widest mb-2 font-medium">
                Evidence map
              </p>
              <ol className="flex flex-col gap-2">
                {evidenceMap.map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex gap-3 text-white/70 text-xs lg:text-base leading-relaxed cursor-default"
                    variants={blurFade}
                    initial="hidden"
                    animate={cardsInView ? "visible" : "hidden"}
                    custom={answerDraft.length + i}
                    whileHover={{
                      color: "rgba(255,255,255,0.95)",
                      x: 3,
                      transition: { duration: 0.2 },
                    }}
                  >
                    {/* numbered badge */}
                    <motion.span
                      className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-semibold"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.4)",
                      }}
                      whileHover={{
                        background: "rgba(20,236,92,0.12)",
                        borderColor: "rgba(20,236,92,0.3)",
                        color: "#14EC5C",
                        transition: { duration: 0.2 },
                      }}
                    >
                      {i + 1}
                    </motion.span>
                    {item}
                  </motion.li>
                ))}
              </ol>
            </div>

            {/* divider */}
            <div
              className="border-t"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            />

            {/* ── Flag ── */}
            <motion.div
              className="relative font-light"
              variants={blurFade}
              initial="hidden"
              animate={cardsInView ? "visible" : "hidden"}
              custom={answerDraft.length + evidenceMap.length}
            >
              <p className="text-white/40 text-xs lg:text-sm uppercase tracking-widest mb-2 font-medium">
                Flag (if needed)
              </p>
              <motion.p
                className="flex gap-2 text-white/70 text-xs lg:text-base leading-relaxed"
                whileHover={{
                  color: "rgba(255,255,255,0.9)",
                  transition: { duration: 0.2 },
                }}
              >
                <span
                  className="mt-1 text-[#14EC5C] text-xs shrink-0 font-bold"
                  style={{ lineHeight: "1.6" }}
                >
                  ⚑
                </span>
                {flagNote}
              </motion.p>
            </motion.div>
          </motion.div>

          {/* ══════════════════════════════════════════════
              RIGHT CARD — Why this style wins
          ══════════════════════════════════════════════ */}
          <motion.div
            ref={rightSpot.ref}
            className="relative rounded-2xl p-6 sm:p-8 flex flex-col gap-6 overflow-hidden"
            style={{
              background: "#05050A",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            variants={irisReveal}
            initial="hidden"
            animate={cardsInView ? "visible" : "hidden"}
            custom={1}
            onMouseMove={rightSpot.onMove}
            onMouseEnter={() => rightSpot.setActive(true)}
            onMouseLeave={() => rightSpot.setActive(false)}
            whileHover={{
              borderColor: "rgba(20,236,92,0.22)",
              boxShadow:
                "0 24px 72px rgba(0,0,0,0.7), 0 0 0 1px rgba(20,236,92,0.08)",
              transition: { duration: 0.45 },
            }}
          >
            {/* Ambient green blob */}
            <div
              className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(20,236,92,0.06) 0%, transparent 70%)",
                animation: "ambient-pulse 6s ease-in-out infinite",
                animationDelay: "1.2s",
              }}
            />

            {/* Mouse spotlight — green tinted */}
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              animate={{
                background: rightSpot.active
                  ? `radial-gradient(300px circle at ${rightSpot.pos.x}% ${rightSpot.pos.y}%, rgba(20,236,92,0.055) 0%, transparent 70%)`
                  : "radial-gradient(300px circle at 50% 50%, transparent 0%, transparent 70%)",
              }}
              transition={{ duration: 0.08 }}
            />

            {/* Animated gradient top border */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(20,236,92,0.0) 20%, rgba(20,236,92,0.35) 50%, rgba(20,236,92,0.0) 80%, transparent 100%)",
              }}
              animate={{
                opacity: rightSpot.active ? 1 : 0.3,
                backgroundPosition: rightSpot.active ? "200% 0" : "0% 0",
              }}
              transition={{ duration: 1.2, ease: "linear" }}
            />

            {/* ── Title + Description ── */}
            <div className="relative">
              <motion.div
                className="flex items-center gap-2 mb-4"
                variants={blurFade}
                initial="hidden"
                animate={cardsInView ? "visible" : "hidden"}
                custom={0}
              >
                {/* green accent bar */}
                <motion.span
                  className="block w-1 rounded-full bg-[#14EC5C]"
                  style={{ height: "20px" }}
                  animate={
                    rightSpot.active
                      ? { height: "28px", opacity: 1 }
                      : { height: "20px", opacity: 0.6 }
                  }
                  transition={{ duration: 0.4, ease: expo }}
                />
                <h3 className="text-white font-medium text-sm sm:text-xl">
                  {whyTitle}
                </h3>
              </motion.div>
              <motion.p
                className="text-white/55 text-base sm:text-lg font-light leading-relaxed"
                variants={blurFade}
                initial="hidden"
                animate={cardsInView ? "visible" : "hidden"}
                custom={1}
                whileHover={{
                  color: "rgba(255,255,255,0.75)",
                  transition: { duration: 0.3 },
                }}
              >
                {whyDescription}
              </motion.p>
            </div>

            {/* ── Style Win Rows ── */}
            <div className="relative flex flex-col gap-2.5 mt-auto">
              {styleWins.map((row, i) => (
                <motion.div
                  key={i}
                  className="relative flex items-center justify-between px-5 py-4 rounded-xl overflow-hidden cursor-default"
                  style={{
                    background: "rgba(39,40,41,0.55)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  variants={rowSlide}
                  initial="hidden"
                  animate={cardsInView ? "visible" : "hidden"}
                  custom={i}
                  onHoverStart={() => setHoveredRow(i)}
                  onHoverEnd={() => setHoveredRow(null)}
                  whileHover={{
                    background: "rgba(5,5,10,0.9)",
                    borderColor: "rgba(20,236,92,0.25)",
                    x: 5,
                    transition: { duration: 0.3, ease: expo },
                  }}
                >
                  {/* Row fill sweep */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(20,236,92,0.04) 0%, transparent 100%)",
                    }}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: hoveredRow === i ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: expo }}
                  />

                  <motion.span
                    className="relative text-white/70 text-sm sm:text-base font-light"
                    animate={{
                      color:
                        hoveredRow === i
                          ? "rgba(255,255,255,0.9)"
                          : "rgba(255,255,255,0.7)",
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    {row.label}
                  </motion.span>

                  <motion.span
                    className="relative text-sm sm:text-base text-right font-medium"
                    animate={{
                      color:
                        hoveredRow === i ? "#14EC5C" : "rgba(255,255,255,0.85)",
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    {row.value}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
