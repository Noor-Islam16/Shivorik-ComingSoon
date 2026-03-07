"use client";

import { useRef, useState } from "react";
import { motion, useInView, cubicBezier, easeInOut } from "framer-motion";
import { FaClock, FaToriiGate } from "react-icons/fa";
import { IoShieldCheckmark } from "react-icons/io5";
import { Button } from "../ui/moving-border";

/* ─── Types ─────────────────────────────────────────────── */
interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export type CardHoverVariant = "default" | "liquid" | "tilt";

interface OperatorSectionProps {
  id?: string;
  heading?: string;
  subheading?: string;
  badge?: string;
  features?: FeatureCard[];
  trustNote?: string;
  trustLabel?: string;
  hoverVariant?: CardHoverVariant;
}

/* ─── Default Data ───────────────────────────────────────── */
const defaultFeatures: FeatureCard[] = [
  {
    icon: <FaToriiGate size={22} color="#14EC5C" />,
    title: "Reviewer-friendly structure",
    description:
      "We standardize language, reduce ambiguity, and keep answers defensible — so reviewers don't reopen the same questions.",
  },
  {
    icon: <IoShieldCheckmark size={22} color="#14EC5C" />,
    title: "NDA-compatible workflow",
    description:
      "We can work with least-privilege access, secure links, time-boxed shares, or redacted exports — you choose the risk posture.",
  },
  {
    icon: <FaClock size={22} color="#14EC5C" />,
    title: "Deadline discipline",
    description:
      "We keep scope tight, run a single-owner pipeline, and move fast with structured clarification — no endless back-and-forth.",
  },
];

/* ─── Animation Variants ─────────────────────────────────── */
const headerVariants = {
  hidden: { opacity: 0, y: 40 },
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

const cardVariants = {
  hidden: { opacity: 0, x: -90 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.3,
      ease: cubicBezier(0.22, 1, 0.36, 1),
      delay: i * 0.22,
    },
  }),
};

const trustVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: easeInOut, delay: 0.2 },
  },
};

/* ─── Card Components ────────────────────────────────────── */
function DefaultCard({
  card,
  i,
  inView,
}: {
  card: FeatureCard;
  i: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const ease = [0.25, 0.46, 0.45, 0.94] as const;

  return (
    <motion.div
      className="rounded-2xl p-6 flex flex-col gap-4 border cursor-default backdrop-blur-md"
      style={{
        borderColor: hovered ? "rgba(20,236,92,0.35)" : "rgba(255,255,255,0.1)",
        background: hovered ? "rgba(50,52,53,0.90)" : "rgba(39,40,41,0.70)",
        boxShadow: hovered
          ? "0 20px 56px rgba(0,0,0,0.5), 0 0 0 1px rgba(20,236,92,0.18)"
          : "none",
      }}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={i}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.4, ease }}
    >
      <motion.div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        animate={{
          backgroundColor: hovered ? "#0f2018" : "#0A0A0A",
          boxShadow: hovered
            ? "0 0 20px rgba(20,236,92,0.5), 0 0 0 1px rgba(20,236,92,0.3), inset 0 0 12px rgba(20,236,92,0.08)"
            : "0 0 0px rgba(20,236,92,0)",
        }}
        transition={{ duration: 0.35, ease }}
      >
        {card.icon}
      </motion.div>
      <div>
        <motion.h3
          className="font-medium text-xl mb-2"
          animate={{ color: hovered ? "#14EC5C" : "#ffffff" }}
          transition={{ duration: 0.35, ease }}
        >
          {card.title}
        </motion.h3>
        <p className="text-white/70 text-[15px] leading-relaxed">
          {card.description}
        </p>
      </div>
    </motion.div>
  );
}

function LiquidCard({
  card,
  i,
  inView,
}: {
  card: FeatureCard;
  i: number;
  inView: boolean;
}) {
  return (
    <motion.div
      className="relative rounded-2xl p-6 flex flex-col gap-4 border border-white/10 backdrop-blur-md cursor-default overflow-hidden"
      style={{ background: "rgba(39,40,41,0.70)" }}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={i}
      whileHover="liquidHover"
    >
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: "linear-gradient(to top, #05050A 60%, #0a1a0f 100%)",
          scaleY: 0,
          transformOrigin: "bottom",
        }}
        variants={{
          liquidHover: {
            scaleY: 1,
            transition: { duration: 0.65, ease: cubicBezier(0.22, 1, 0.36, 1) },
          },
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ border: "1px solid transparent" }}
        variants={{
          liquidHover: {
            borderColor: "rgba(20,236,92,0.45)",
            boxShadow:
              "0 0 32px rgba(20,236,92,0.12), inset 0 0 24px rgba(20,236,92,0.05)",
            transition: { duration: 0.5, delay: 0.1 },
          },
        }}
      />
      <motion.div
        className="relative z-10 w-10 h-10 rounded-lg flex items-center justify-center bg-[#0A0A0A]"
        variants={{
          liquidHover: {
            backgroundColor: "#0f2018",
            boxShadow: "0 0 16px rgba(20,236,92,0.35)",
            transition: { duration: 0.4, delay: 0.15 },
          },
        }}
      >
        <motion.span
          className="flex items-center justify-center"
          variants={{
            liquidHover: {
              filter:
                "brightness(0) saturate(100%) invert(78%) sepia(61%) saturate(464%) hue-rotate(90deg) brightness(103%) contrast(95%)",
              transition: { duration: 0.35, delay: 0.2 },
            },
          }}
        >
          {card.icon}
        </motion.span>
      </motion.div>
      <div className="relative z-10">
        <motion.h3
          className="font-medium text-xl mb-2 text-white"
          variants={{
            liquidHover: {
              color: "#14EC5C",
              transition: { duration: 0.4, delay: 0.2 },
            },
          }}
        >
          {card.title}
        </motion.h3>
        <motion.p
          className="text-[15px] leading-relaxed text-white/70"
          variants={{
            liquidHover: {
              color: "rgba(255,255,255,0.85)",
              transition: { duration: 0.4, delay: 0.25 },
            },
          }}
        >
          {card.description}
        </motion.p>
      </div>
    </motion.div>
  );
}

function TiltCard({
  card,
  i,
  inView,
}: {
  card: FeatureCard;
  i: number;
  inView: boolean;
}) {
  return (
    <div style={{ perspective: "800px" }}>
      <motion.div
        className="rounded-2xl p-6 flex flex-col gap-4 border border-white/10 backdrop-blur-md cursor-default"
        style={{
          background: "rgba(39,40,41,0.70)",
          transformStyle: "preserve-3d",
        }}
        variants={cardVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        custom={i}
        whileHover={{
          rotateY: 18,
          rotateX: -10,
          scale: 1.04,
          background: "rgba(5,5,10,0.95)",
          borderColor: "rgba(20,236,92,0.5)",
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.6), -12px 0 40px rgba(20,236,92,0.12), 0 0 0 1px rgba(20,236,92,0.2)",
          transition: { duration: 0.45, ease: cubicBezier(0.22, 1, 0.36, 1) },
        }}
      >
        <motion.div
          className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#0A0A0A]"
          whileHover={{
            backgroundColor: "#0f2018",
            boxShadow:
              "0 0 20px rgba(20,236,92,0.4), 0 0 60px rgba(20,236,92,0.1)",
            transition: { duration: 0.3 },
          }}
        >
          {card.icon}
        </motion.div>
        <div>
          <motion.h3
            className="font-medium text-xl mb-2 text-white"
            whileHover={{ color: "#14EC5C", transition: { duration: 0.3 } }}
          >
            {card.title}
          </motion.h3>
          <p className="text-white/70 text-[15px] leading-relaxed">
            {card.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function OperatorSection({
  id,
  heading = "Operator-grade execution",
  subheading = `This isn't "generic compliance writing." It's a controlled delivery system built for real deal cycles and real security reviewers.`,
  badge,
  features = defaultFeatures,
  trustNote,
  trustLabel = "Trust note:",
  hoverVariant = "default",
}: OperatorSectionProps) {
  const headerRef = useRef(null);
  const cardsRef = useRef(null);
  const trustRef = useRef(null);

  const headerInView = useInView(headerRef, { once: true, amount: 0.35 });
  const cardsInView = useInView(cardsRef, { once: true, amount: 0.25 });
  const trustInView = useInView(trustRef, { once: true, amount: 0.5 });

  const renderCard = (card: FeatureCard, i: number) => {
    const props = { card, i, inView: cardsInView };
    if (hoverVariant === "liquid") return <LiquidCard key={i} {...props} />;
    if (hoverVariant === "tilt") return <TiltCard key={i} {...props} />;
    return <DefaultCard key={i} {...props} />;
  };

  return (
    <section id={id} className="w-full pb-10 lg:pb-14">
      <div className="max-w-[1440px] mx-auto px-10 sm:px-10 lg:px-20">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col items-center text-center mb-10"
        >
          <motion.h2
            className="text-white font-medium text-4xl sm:text-5xl lg:text-6xl leading-tight mb-4"
            variants={headerVariants}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            custom={0}
          >
            {heading}
          </motion.h2>
          <motion.p
            className="text-white/60 text-sm sm:text-xl max-w-2xl whitespace-pre-line"
            variants={headerVariants}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            custom={1}
          >
            {subheading}
          </motion.p>
        </div>

        {/* Badge */}
        {badge && (
          <motion.div
            className="flex justify-center mb-12"
            variants={headerVariants}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            custom={2}
          >
            {/* Outer wrapper has no overflow:hidden so rings expand freely */}
            <div className="relative inline-flex items-center justify-center">
              {/* Pulse ring 1 */}
              <motion.span
                className="absolute rounded-full bg-[#14EC5C] pointer-events-none"
                style={{ width: 10, height: 10 }}
                animate={{ scale: [1, 3.8], opacity: [0.6, 0] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: [0.0, 0.0, 0.2, 1],
                  repeatDelay: 0.3,
                }}
              />
              {/* Pulse ring 2 — staggered for continuous feel */}
              <motion.span
                className="absolute rounded-full bg-[#14EC5C] pointer-events-none"
                style={{ width: 10, height: 10 }}
                animate={{ scale: [1, 3.8], opacity: [0.35, 0] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: [0.0, 0.0, 0.2, 1],
                  repeatDelay: 0.3,
                  delay: 0.85,
                }}
              />
              <Button
                as="div"
                borderRadius="9999px"
                duration={8000}
                containerClassName="inline-flex h-auto w-auto"
                className="px-6 py-3 text-base font-medium gap-2.5"
              >
                {/* Only solid core dot inside the clipped Button */}
                <span className="inline-flex rounded-full w-2.5 h-2.5 shrink-0 bg-[#14EC5C] shadow-[0_0_8px_3px_rgba(20,236,92,0.8)]" />
                {badge}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Feature Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
        >
          {features.map((card, i) => renderCard(card, i))}
        </div>

        {/* Trust Note */}
        {trustNote && (
          <div ref={trustRef}>
            <motion.div
              className="flex justify-center"
              variants={trustVariants}
              initial="hidden"
              animate={trustInView ? "visible" : "hidden"}
            >
              <div
                className="w-full rounded-full px-6 py-4 text-base font-medium text-white text-center bg-[#05050A]"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <span className="text-white text-xl font-medium">
                  {trustLabel}&nbsp;
                </span>
                {trustNote}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

export { DefaultCard, LiquidCard, TiltCard };
export type { FeatureCard };
