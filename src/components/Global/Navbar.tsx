"use client";

import { useState, useEffect, useRef } from "react";
import IntakeModal from "../Home/IntakeModal";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Why this works", href: "#why-this-works" },
  { label: "Scope", href: "#scope" },
  { label: "Deliverables", href: "#deliverables" },
  { label: "Plans", href: "#plans" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // State for modal
  const navRef = useRef<HTMLElement>(null);
  const [navHeight, setNavHeight] = useState(64);

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      const href = target.closest("a")?.getAttribute("href");
      if (!href?.startsWith("#")) return;

      e.preventDefault();
      const el = document.querySelector(href);
      if (!el) return;

      const offset = navRef.current?.offsetHeight ?? 64;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  // Function to open modal
  const openModal = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default link behavior
    setMenuOpen(false); // Close mobile menu if open
    setModalOpen(true);
  };

  return (
    <>
      <style>{`
        .shivorik-nav-link {
          position: relative;
          display: inline-block;
          padding: 8px 14px;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.7);
          font-size: 16px;
          font-weight: 500;
          transition: color 0.3s;
          z-index: 1;
          text-decoration: none;
        }

        .shivorik-nav-link::before {
          content: "";
          position: absolute;
          inset: 0;
          border-top: 2px solid #14EC5C;
          border-bottom: 2px solid #14EC5C;
          transform: scaleY(2);
          opacity: 0;
          transition: 0.3s;
        }

        .shivorik-nav-link::after {
          content: "";
          position: absolute;
          inset: 2px 0;
          background-color: #14EC5C;
          transform: scaleY(0);
          opacity: 0;
          transition: 0.3s;
          z-index: -1;
        }

        .shivorik-nav-link:hover { color: #05050A; }

        .shivorik-nav-link:hover::before,
        .shivorik-nav-link:hover::after {
          transform: scaleY(1);
          opacity: 1;
        }

        .shivorik-mobile-link {
          display: block;
          padding: 10px 12px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          border-radius: 6px;
          transition: background-color 0.25s, color 0.25s;
        }

        .shivorik-mobile-link:hover {
          background-color: #14EC5C;
          color: #05050A;
        }

        /* ── CTA ── */
        .cta-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          padding: 2px;
          text-decoration: none;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
          background: transparent;
          border: none;
        }

        .cta-wrapper::before {
          content: "";
          position: absolute;
          width: 250%;
          height: 600%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 110deg,
            rgba(255,255,255,0.15) 140deg,
            rgba(255,255,255,0.7) 170deg,
            white 180deg,
            rgba(255,255,255,0.7) 190deg,
            rgba(255,255,255,0.15) 220deg,
            transparent 250deg,
            transparent 360deg
          );
          animation: cta-spin 2.4s linear infinite;
          z-index: 0;
          top: 50%;
          left: 50%;
          transform-origin: center center;
          transform: translate(-50%, -50%) rotate(0deg);
        }

        @keyframes cta-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .cta-inner {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          padding: 8px 20px;
          border-radius: 9999px;
          background-color: #14EC5C;
          color: #05050A;
          font-size: 0.875rem;
          font-weight: 600;
          white-space: nowrap;
          border: none;
        }

        .cta-wrapper:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(20, 236, 92, 0.45);
        }

        .cta-wrapper:active { transform: scale(0.96); }

        /* ── Navbar: always fixed, spacer holds layout ── */
        .shivorik-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition:
            background-color 0.45s ease,
            box-shadow 0.45s ease,
            backdrop-filter 0.45s ease;
          will-change: background-color;
        }

        .shivorik-header--top {
          background-color: transparent;
          box-shadow: none;
        }

        .shivorik-header--scrolled {
          background-color: #05050A;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 4px 32px rgba(0,0,0,0.5);
        }
      `}</style>

      {/*
        Spacer — always rendered, always exactly navbar height.
        Since the navbar is always fixed (never in flow), this prevents
        content from jumping under the bar.
      */}
      <div style={{ height: navHeight }} aria-hidden="true" />

      <header
        ref={navRef}
        className={`shivorik-header ${scrolled ? "shivorik-header--scrolled" : "shivorik-header--top"}`}
      >
        <div className="max-w-[1440px] mx-auto px-10 sm:px-10 lg:px-20 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7B5CF0] via-[#3B8BFF] to-[#14EC5C] flex items-center justify-center shadow-lg" />
            <div className="flex flex-col leading-tight">
              <span className="text-white font-semibold text-base tracking-wide">
                Shivorik
              </span>
              <span className="text-white/40 text-sm font-normal">
                72-Hour Security Rescue
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="shivorik-nav-link"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA - Desktop */}
          <div className="hidden lg:block shrink-0">
            <button
              onClick={openModal}
              className="cta-wrapper"
              aria-label="Start intake"
            >
              <span className="cta-inner">Start – 2 minute intake</span>
            </button>
          </div>

          {/* Hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2 text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96" : "max-h-0"}`}
        >
          <div className="max-w-[1920px] mx-auto px-4 pb-4 flex flex-col gap-1 border-t border-white/5 pt-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="shivorik-mobile-link"
              >
                {link.label}
              </a>
            ))}

            {/* CTA - Mobile */}
            <button
              onClick={openModal}
              className="mt-2 inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold border-none cursor-pointer"
              style={{ backgroundColor: "#14EC5C", color: "#05050A" }}
            >
              Start – 2 minute intake
            </button>
          </div>
        </div>
      </header>

      {/* Modal */}
      <IntakeModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
