"use client";

import { useRef } from "react";
import { motion, useInView, easeInOut } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.3, ease: easeInOut, delay: i * 0.18 },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 1.3, ease: easeInOut, delay: i * 0.18 },
  }),
};

const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 1.3, ease: easeInOut, delay: i * 0.18 },
  }),
};

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "2-minute intake",
      description:
        "Share the questionnaire + any policy links, evidence folders, and notes. We confirm scope and timing.",
      gradient: true,
    },
    {
      number: 2,
      title: "Evidence map",
      description:
        "We align each question to your controls, policies, and proof. Missing evidence is clearly flagged.",
      gradient: false,
    },
    {
      number: 3,
      title: "Draft delivery",
      description:
        "You receive a consistent, review-ready draft with tight wording and minimal ambiguity.",
      gradient: false,
    },
    {
      number: 4,
      title: "Clarify + finalize",
      description:
        "One structured clarification round (two if needed). You approve and submit internally.",
      gradient: true,
    },
  ];

  const headerRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  const headerInView = useInView(headerRef, { once: true, amount: 0.25 });
  const row1InView = useInView(row1Ref, { once: true, amount: 0.25 });
  const row2InView = useInView(row2Ref, { once: true, amount: 0.25 });

  return (
    <section
      id="how-it-works"
      className="w-full px-10 sm:px-10 lg:px-20 pb-10 sm:pb-14"
      style={{ maxWidth: "1440px", margin: "0 auto" }}
    >
      {/* Header */}
      <div ref={headerRef} className="mb-6">
        <motion.h2
          className="text-white text-3xl sm:text-4xl lg:text-6xl font-medium leading-tight mb-3"
          variants={fadeUp}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          custom={0}
        >
          How it{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #14EC5C, #0db84a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            works
          </span>
        </motion.h2>
        <motion.p
          className="text-white/60 text-xl max-w-xl font-light leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          custom={1}
        >
          A simple, controlled process designed to meet deadlines while keeping
          your internal team sane.
        </motion.p>
      </div>

      {/* Cards Grid */}
      <div className="flex flex-col gap-3 mt-10">
        {/* Row 1 */}
        <div ref={row1Ref} className="flex flex-col sm:flex-row gap-3">
          <motion.div
            className="sm:w-[40%]"
            variants={fadeLeft}
            initial="hidden"
            animate={row1InView ? "visible" : "hidden"}
            custom={0}
          >
            <Card step={steps[0]} />
          </motion.div>
          <motion.div
            className="sm:w-[60%]"
            variants={fadeRight}
            initial="hidden"
            animate={row1InView ? "visible" : "hidden"}
            custom={1}
          >
            <Card step={steps[1]} />
          </motion.div>
        </div>

        {/* Row 2 */}
        <div ref={row2Ref} className="flex flex-col sm:flex-row gap-3">
          <motion.div
            className="sm:w-[60%]"
            variants={fadeLeft}
            initial="hidden"
            animate={row2InView ? "visible" : "hidden"}
            custom={0}
          >
            <Card step={steps[2]} />
          </motion.div>
          <motion.div
            className="sm:w-[40%]"
            variants={fadeRight}
            initial="hidden"
            animate={row2InView ? "visible" : "hidden"}
            custom={1}
          >
            <Card step={steps[3]} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Card({
  step,
}: {
  step: {
    number: number;
    title: string;
    description: string;
    gradient: boolean;
  };
}) {
  return (
    <motion.div
      className={`relative rounded-2xl p-6 sm:p-8 h-full flex flex-col justify-between overflow-hidden cursor-default ${
        step.gradient
          ? "bg-gradient-to-br from-[#272829] via-[#272829] to-[#14EC5C]/30"
          : "bg-[#272829]"
      }`}
      whileHover={{
        y: -6,
        scale: 1.02,
        boxShadow: step.gradient
          ? "0 20px 56px rgba(0,0,0,0.5), 0 0 0 1px rgba(20,236,92,0.3)"
          : "0 20px 56px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.12)",
        transition: { duration: 0.4, ease: "easeInOut" },
      }}
    >
      {/* Top: title + description */}
      <div>
        <h3 className="text-white font-medium text-base sm:text-2xl mb-3">
          {step.title}
        </h3>
        <p className="text-white/70 text-lg leading-relaxed max-w-xl">
          {step.description}
        </p>
      </div>

      {/* Number badge — top right */}
      <motion.div
        className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold"
        style={{ background: "#000000", color: "#14EC5C" }}
        whileHover={{
          scale: 1.2,
          boxShadow: "0 0 14px rgba(20,236,92,0.5)",
          transition: { duration: 0.3 },
        }}
      >
        {step.number}
      </motion.div>
    </motion.div>
  );
}
