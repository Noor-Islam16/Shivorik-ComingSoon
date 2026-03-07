"use client";

import { useRef, useState } from "react";
import { motion, useInView, cubicBezier } from "framer-motion";
import IntakeModal from "../Home/IntakeModal";
import CalendlyModal from "../Home/CalendlyModal"; // ✅ our custom modal

const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.4,
      ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
      delay: i * 0.25,
    },
  }),
};

const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.4,
      ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
      delay: i * 0.25,
    },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
      delay: i * 0.22,
    },
  }),
};

function useSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  return { ref, inView };
}

const scrollToSection = (href: string) => {
  const el = document.querySelector(href);
  if (!el) return;
  const navbar = document.querySelector("header");
  const offset = navbar?.offsetHeight ?? 64;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
};

export default function HeroSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [calendlyOpen, setCalendlyOpen] = useState(false); // ✅

  const heroGrid = useSection();
  const ctaSection = useSection();

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  return (
    <>
      <section id="top" className="w-full flex items-center">
        <div className="max-w-[1440px] mx-auto w-full px-10 sm:px-10 lg:px-20 py-10 lg:py-14">
          {/* ================= HERO GRID ================= */}
          <div
            ref={heroGrid.ref}
            className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-stretch"
          >
            {/* ── LEFT COLUMN ── */}
            <div className="flex flex-col justify-center">
              <motion.h1
                className="text-white font-extrabold text-4xl lg:text-[56px] leading-[1.2] mb-6"
                variants={fadeLeft}
                initial="hidden"
                animate={heroGrid.inView ? "visible" : "hidden"}
                custom={0}
              >
                Security <br />
                questionnaires <br />
                every month? Get <br />
                coverage with a <br />
                72-hour SLA.
              </motion.h1>

              <motion.p
                className="text-white/60 text-sm sm:text-base leading-relaxed"
                variants={fadeLeft}
                initial="hidden"
                animate={heroGrid.inView ? "visible" : "hidden"}
                custom={1}
              >
                A premium, scope-controlled service for teams who must respond
                fast — without chaos. Built for real deal cycles and security
                reviewers. We deliver a clean, consistent draft aligned to your
                policies and evidence library.
              </motion.p>
            </div>

            {/* ── RIGHT COLUMN: Card ── */}
            <div className="flex">
              <motion.div
                className="bg-[#000] border border-white/10 rounded-2xl p-6 w-full flex flex-col"
                variants={fadeRight}
                initial="hidden"
                animate={heroGrid.inView ? "visible" : "hidden"}
                custom={0}
              >
                {/* Card Header */}
                <motion.div
                  className="flex items-center justify-between mb-1"
                  variants={fadeRight}
                  initial="hidden"
                  animate={heroGrid.inView ? "visible" : "hidden"}
                  custom={1}
                >
                  <span className="text-white text-base">
                    72-hour SLA (per unit)
                  </span>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#14EC5C" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="#05050A"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </motion.div>

                <motion.h3
                  className="text-white font-normal text-3xl mb-1"
                  variants={fadeRight}
                  initial="hidden"
                  animate={heroGrid.inView ? "visible" : "hidden"}
                  custom={2}
                >
                  Coverage snapshot
                </motion.h3>

                <motion.p
                  className="text-white/70 text-sm leading-normal mb-5"
                  variants={fadeRight}
                  initial="hidden"
                  animate={heroGrid.inView ? "visible" : "hidden"}
                  custom={3}
                >
                  Built for SaaS / IT teams closing deals under security review
                  pressure—priced as monthly coverage, not one-off chaos.
                </motion.p>

                {/* Stats Row */}
                <motion.div
                  className="grid grid-cols-3 gap-2 mb-3"
                  variants={fadeRight}
                  initial="hidden"
                  animate={heroGrid.inView ? "visible" : "hidden"}
                  custom={4}
                >
                  {[
                    { val: "≤72h", label: "SLA per unit" },
                    { val: "1–2", label: "Clarification rounds" },
                    { val: "1", label: "Single owner" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-[#1C1C1C] rounded-xl p-3"
                    >
                      <div className="text-white font-semibold text-2xl leading-tight">
                        {stat.val}
                      </div>
                      <div className="text-white/70 text-base mt-0.5">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Info Rows */}
                <motion.div
                  className="flex flex-col gap-2 mb-5 flex-1"
                  variants={fadeRight}
                  initial="hidden"
                  animate={heroGrid.inView ? "visible" : "hidden"}
                  custom={5}
                >
                  <div className="bg-[#1C1C1C] rounded-xl px-4 py-3 flex items-center justify-between gap-4">
                    <span className="text-white text-base shrink-0">
                      Typical input
                    </span>
                    <span className="text-white text-base text-right">
                      questionnaire + policy links + evidence files
                    </span>
                  </div>
                  <div className="bg-[#1C1C1C] rounded-xl px-4 py-3 flex items-center justify-between gap-4">
                    <span className="text-white text-base shrink-0">
                      Output format
                    </span>
                    <span className="text-white text-base text-right">
                      clean draft + evidence map
                    </span>
                  </div>
                </motion.div>

                {/* Card Buttons */}
                <motion.div
                  className="flex items-center gap-2 mt-auto"
                  variants={fadeRight}
                  initial="hidden"
                  animate={heroGrid.inView ? "visible" : "hidden"}
                  custom={6}
                >
                  <button
                    onClick={() => scrollToSection("#plans")}
                    className="flex-1 py-2.5 rounded-[10px] text-sm lg:text-xl font-semibold transition-all duration-200 hover:scale-105 cursor-pointer"
                    style={{ backgroundColor: "#14EC5C", color: "#05050A" }}
                  >
                    Plans
                  </button>

                  {/* ✅ Opens custom Calendly modal — no scrollbar, fully styled */}
                  <button
                    onClick={() => setCalendlyOpen(true)}
                    className="flex-1 py-2.5 rounded-[10px] text-sm lg:text-xl font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-200 hover:scale-105 cursor-pointer"
                  >
                    Book a Call
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* ================= BOTTOM CTA BUTTONS ================= */}
          <div ref={ctaSection.ref} className="mt-6">
            <div className="w-full lg:w-1/2">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <motion.button
                  onClick={openModal}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3.5 rounded-[10px] text-sm lg:text-2xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ backgroundColor: "#14EC5C", color: "#05050A" }}
                  variants={fadeUp}
                  initial="hidden"
                  animate={ctaSection.inView ? "visible" : "hidden"}
                  custom={0}
                >
                  Start – 2 minute intake
                </motion.button>

                <motion.a
                  href="#why-this-works"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3.5 rounded-[10px] text-sm lg:text-2xl font-medium hover:scale-105 text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-200 cursor-pointer"
                  variants={fadeUp}
                  initial="hidden"
                  animate={ctaSection.inView ? "visible" : "hidden"}
                  custom={1}
                >
                  See a redacted sample
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <IntakeModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <CalendlyModal
        open={calendlyOpen}
        onClose={() => setCalendlyOpen(false)}
      />
    </>
  );
}
