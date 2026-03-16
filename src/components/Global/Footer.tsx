"use client";

import { useRef } from "react";
import { motion, useInView, easeInOut } from "framer-motion";
import logo from "../../assets/logo.png";

const fadeLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 1.3, ease: easeInOut, delay: i * 0.2 },
  }),
};

// const fadeRight = {
//   hidden: { opacity: 0, x: 50 },
//   visible: (i = 0) => ({
//     opacity: 1,
//     x: 0,
//     transition: { duration: 1.3, ease: easeInOut, delay: i * 0.18 },
//   }),
// };

const dividerVariant = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.4, ease: easeInOut, delay: 0.2 },
  },
};

export default function Footer() {
  // const navLinks = [
  //   { label: "Scope", href: "#scope" },
  //   { label: "Deliverables", href: "#deliverables" },
  //   { label: "Why this works", href: "#why-this-works" },
  //   { label: "Plans", href: "#plans" },
  //   { label: "Back to top", href: "#top" },
  // ];

  const footerRef = useRef(null);
  const dividerRef = useRef(null);

  const inView = useInView(footerRef, { once: true, amount: 0.2 });
  const dividerInView = useInView(dividerRef, { once: true, amount: 0.8 });

  return (
    <section className="bg-[#05050A]">
      <footer
        className="w-full bg-[#05050A] px-10 sm:px-10 lg:px-20 pt-12 pb-6"
        style={{ maxWidth: "1440px", margin: "0 auto" }}
      >
        {/* Main footer content */}
        <div
          ref={footerRef}
          className="flex flex-col sm:flex-row justify-between gap-10 sm:gap-6"
        >
          {/* ── Left side ── */}
          <div className="flex flex-col gap-6 max-w-4xl">
            {/* Logo — item 0 */}
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={0}
            >
              <style>{`
    .footer-logo {
      height: 80px;
      width: auto;
      object-fit: contain;
      display: block;
    }
    @media (max-width: 1024px) {
      .footer-logo { height: 60px; }
    }
    @media (max-width: 768px) {
      .footer-logo { height: 52px; }
    }
    @media (max-width: 480px) {
      .footer-logo { height: 46px; }
    }
  `}</style>
              <img src={logo} alt="Shivorik" className="footer-logo" />
            </motion.div>
            {/* Disclaimer — item 1 */}
            <motion.p
              className="text-white/70 text-base leading-relaxed"
              variants={fadeLeft}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={1}
            >
              Disclaimer: Shivorik provides documentation drafting and
              organizational support. We do not provide legal advice, guarantee
              outcomes, or represent your organization. You are responsible for
              review, accuracy, and final submission.
            </motion.p>

            {/* Contact — item 2 */}
            <motion.p
              className="text-white text-base"
              variants={fadeLeft}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={2}
            >
              Contact:{" "}
              <a
                href="mailto:hello@shivorik.com"
                className="text-white underline underline-offset-2 hover:text-white/70 transition-colors duration-200"
              >
                hello@shivorik.com
              </a>{" "}
              • Request a redacted walkthrough anytime.
            </motion.p>
          </div>

          {/* ── Right side nav links ── */}
          {/* <nav className="flex flex-col gap-3 sm:items-end sm:justify-start">
            <div className="hidden sm:block" style={{ height: "76px" }} />
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-white text-[18px] relative group"
                variants={fadeRight}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={i}
              >
                {link.label}
                <span
                  className="absolute left-0 -bottom-0.5 h-px bg-white transition-all duration-300 ease-out w-0 group-hover:w-full"
                  aria-hidden="true"
                />
              </motion.a>
            ))}
          </nav> */}
        </div>

        {/* Divider — wipes in from left */}
        <div ref={dividerRef} className="mt-10">
          <motion.div
            className="border-t border-white"
            variants={dividerVariant}
            initial="hidden"
            animate={dividerInView ? "visible" : "hidden"}
          />
        </div>
      </footer>
    </section>
  );
}
