import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InlineWidget } from "react-calendly";

interface CalendlyModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CalendlyModal({ open, onClose }: CalendlyModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      <style>{`
        /* The only scrollbar allowed — slim, dark, branded */
        .cly-inner::-webkit-scrollbar { width: 4px; }
        .cly-inner::-webkit-scrollbar-track { background: #0d0d0d; border-radius: 999px; }
        .cly-inner::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 999px; }
        .cly-inner::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.22); }
        .cly-inner { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.12) #0d0d0d; }

        /* Kill ALL other scrollbars — the centering shell, the iframe */
        .cly-shell::-webkit-scrollbar { display: none; }
        .cly-shell { overflow: hidden !important; scrollbar-width: none; -ms-overflow-style: none; }
        .cly-inner iframe { overflow: hidden !important; }
      `}</style>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 999,
                background: "rgba(0,0,0,0.8)",
                backdropFilter: "blur(10px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={onClose}
            />

            {/* Centering shell — overflow:hidden, NO scrollbar ever */}
            <div
              className="cly-shell"
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                overflow: "hidden", // this div must NEVER scroll
              }}
            >
              {/* Modal card */}
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 24 }}
                transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  width: "100%",
                  maxWidth: "1120px",
                  maxHeight: "calc(100dvh - 32px)",
                  display: "flex",
                  flexDirection: "column",
                  background: "#0d0d0d",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  boxShadow: "0 40px 120px rgba(0,0,0,0.95)",
                  overflow: "hidden", // clips border-radius — must NOT scroll
                }}
              >
                {/* Header — pinned, never scrolls */}
                <div
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 24px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#14EC5C",
                        boxShadow: "0 0 8px #14EC5C88",
                      }}
                    />
                    <span
                      style={{
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 500,
                        letterSpacing: "0.03em",
                      }}
                    >
                      Book a Call
                    </span>
                  </div>

                  <button
                    onClick={onClose}
                    aria-label="Close"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(255,255,255,0.4)",
                      transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(255,255,255,0.1)";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "#fff";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "rgba(255,255,255,0.4)";
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path
                        d="M1 1L12 12M12 1L1 12"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                {/*
                  Scrollable body — ONLY this div scrolls, with our custom slim scrollbar.
                  flex:1 + minHeight:0 lets it shrink to fit the modal card.
                  The iframe is fixed at 660px; on short screens this div scrolls invisibly.
                */}
                <div
                  className="cly-inner"
                  style={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  <InlineWidget
                    url="https://calendly.com/sonaliasrtech/30min"
                    styles={{
                      width: "100%",
                      height: "660px",
                      border: "none",
                      display: "block",
                    }}
                    pageSettings={{
                      backgroundColor: "0d0d0d",
                      hideEventTypeDetails: false,
                      hideLandingPageDetails: false,
                      primaryColor: "14EC5C",
                      textColor: "ffffff",
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
