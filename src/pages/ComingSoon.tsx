import { useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────────
//  🚀 SET YOUR FIXED LAUNCH DATE HERE — never resets on page reload
//     Change this to your real launch date before deploying.
//     Format: new Date("YYYY-MM-DDTHH:MM:SS")  ← local time
//     OR UTC:  new Date(Date.UTC(2025, 8, 5, 0, 0, 0))  ← Sep 5 2025
// ─────────────────────────────────────────────────────────────────
const LAUNCH_DATE = new Date("2026-04-07T00:00:00");

// ─── Config ──────────────────────────────────────────────────────
const BRAND = "SHIVORIK";
const GREEN = "#14EC5C";
const COMING_SOON_CHARS = [
  "C",
  "O",
  "M",
  "I",
  "N",
  "G",
  " ",
  "S",
  "O",
  "O",
  "N",
];
const RANDOM_NUMS = ["3", "0", "8", "1", "4", "6", " ", "5", "9", "2", "7"];

// ─── Types ───────────────────────────────────────────────────────
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
interface Particle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

// ─── Pure helper — called every tick, always reads live Date.now() ─
function pad(n: number) {
  return String(n).padStart(2, "0");
}

function calcTimeLeft(): TimeLeft {
  const diff = LAUNCH_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

// ─── Keyframes injected into <head> once ─────────────────────────
const KEYFRAMES = `
@keyframes charReveal {
  from { opacity:0; transform:translateY(70px) rotateX(-45deg); }
  to   { opacity:1; transform:translateY(0)    rotateX(0deg); }
}
@keyframes numOut {
  0%   { transform:translateY(0);     opacity:1; }
  100% { transform:translateY(-110%); opacity:0; }
}
@keyframes ltrIn {
  0%   { transform:translateY(110%);  opacity:0; }
  100% { transform:translateY(0);     opacity:1; }
}
@keyframes shimmer {
  from { background-position: 220% center; }
  to   { background-position:-220% center; }
}
@keyframes fadeUp {
  from { opacity:0; transform:translateY(28px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes fadeDown {
  from { opacity:0; transform:translateY(-16px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
@keyframes blink    { 0%,100%{ opacity:1; } 50%{ opacity:0.15; } }
@keyframes glowPulse{ from { opacity:0.6; } to { opacity:1; } }
@keyframes floatUp {
  0%   { opacity:0;   transform:translateY(0)       scale(1);   }
  10%  { opacity:0.7; }
  90%  { opacity:0.2; }
  100% { opacity:0;   transform:translateY(-105vh)  scale(0.3); }
}
@keyframes gridMove {
  from { background-position:0 0; }
  to   { background-position:80px 80px; }
}
@keyframes numFlip {
  0%   { opacity:1; transform:translateY(0);    }
  40%  { opacity:0; transform:translateY(-55%); }
  60%  { opacity:0; transform:translateY(55%);  }
  100% { opacity:1; transform:translateY(0);    }
}
`;

// ─── FlipChar — COMING SOON entrance (number → letter) ───────────
function FlipChar({
  num,
  ltr,
  delay,
}: {
  num: string;
  ltr: string;
  delay: number;
}) {
  if (ltr === " ")
    return <span style={{ display: "inline-block", width: "0.45em" }} />;
  return (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        height: "1.4em",
        overflow: "hidden",
        position: "relative",
        minWidth: ltr === "M" || ltr === "W" ? "1.1em" : "0.75em",
      }}
    >
      {/* number slides up and out */}
      <span
        style={{
          display: "block",
          lineHeight: 1.4,
          color: GREEN,
          animation: `numOut 0.42s ${delay}s ease forwards`,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        {num}
      </span>
      {/* letter slides in from below */}
      <span
        style={{
          display: "block",
          lineHeight: 1.4,
          color: "#ffffff",
          transform: "translateY(110%)",
          animation: `ltrIn 0.42s ${delay}s ease forwards`,
          textAlign: "center",
        }}
      >
        {ltr}
      </span>
    </span>
  );
}

// ─── CountBlock — exact HTML version style ────────────────────────
//   gradient white number, monospace label, colon handled outside
function CountBlock({ value, label }: { value: number; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: "18px 26px",
          minWidth: 88,
          textAlign: "center",
          transition: "border-color 0.3s, box-shadow 0.3s",
          cursor: "default",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = GREEN;
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 0 24px rgba(20,236,92,0.18)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor =
            "rgba(255,255,255,0.08)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        {/*
          key={value} forces React to remount this <span> every time
          the number changes → CSS animation restarts from scratch every second
        */}
        <span
          key={value}
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
            lineHeight: 1,
            display: "block",
            letterSpacing: "0.04em",
            background:
              "linear-gradient(180deg, #ffffff 40%, rgba(255,255,255,0.35) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "numFlip 0.38s ease",
          }}
        >
          {pad(value)}
        </span>
      </div>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────
export default function ComingSoon() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft);
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState(false);
  const [emailError, setEmailError] = useState(false);

  // Stable random particles — never recalculated
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: 9 + Math.random() * 14,
      delay: Math.random() * 14,
    })),
  );

  // Inject keyframes once on mount
  useEffect(() => {
    const tag = document.createElement("style");
    tag.innerHTML = KEYFRAMES;
    document.head.appendChild(tag);
    return () => {
      document.head.removeChild(tag);
    };
  }, []);

  // ── Accurate countdown: recalculates from real Date.now() every tick
  //    Never drifts — even if tab is backgrounded or system clock changes
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  function handleNotify() {
    if (!email.trim() || !email.includes("@")) {
      setEmailError(true);
      setTimeout(() => setEmailError(false), 1800);
      return;
    }
    setNotified(true);
    setEmail("");
  }

  // ─── Render ────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060606",
        color: "#ffffff",
        position: "relative",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          animation: "gridMove 20s linear infinite",
        }}
      />

      {/* Glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 65% 45% at 50% 62%, rgba(20,236,92,0.09) 0%, transparent 70%)," +
            "radial-gradient(ellipse 50% 40% at 15% 15%, rgba(20,236,92,0.04) 0%, transparent 60%)",
          animation: "glowPulse 6s ease-in-out infinite alternate",
        }}
      />

      {/* Particles */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              bottom: -10,
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: GREEN,
              opacity: 0,
              animation: `floatUp ${p.duration}s ${p.delay}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Top bar */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 44px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(6,6,6,0.65)",
          backdropFilter: "blur(24px)",
          animation: "fadeDown 0.8s 0.2s ease both",
        }}
      >
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1.55rem",
            letterSpacing: "0.14em",
          }}
        >
          SHIV<span style={{ color: GREEN }}>.</span>ORIK
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "monospace",
            fontSize: "0.68rem",
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: GREEN,
              display: "inline-block",
              animation: "blink 2s ease-in-out infinite",
            }}
          />
          In Development
        </span>
      </header>

      {/* Content */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "120px 24px 100px",
          width: "100%",
          maxWidth: 920,
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: GREEN,
            marginBottom: 28,
            animation: "fadeUp 0.7s 0.5s ease both",
          }}
        >
          Something extraordinary is arriving
        </p>

        {/* Hero title */}
        <div style={{ position: "relative", perspective: 600 }}>
          {/* shimmer overlay */}
          <h1
            aria-hidden="true"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(5.5rem, 15vw, 13.5rem)",
              letterSpacing: "0.05em",
              lineHeight: 0.9,
              position: "absolute",
              inset: 0,
              color: "transparent",
              backgroundImage: `linear-gradient(90deg, transparent 0%, ${GREEN}66 50%, transparent 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              backgroundSize: "220% 100%",
              animation: "shimmer 4s 2.4s linear infinite",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {BRAND}
          </h1>

          {/* staggered character reveal */}
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(5.5rem, 15vw, 13.5rem)",
              letterSpacing: "0.05em",
              lineHeight: 0.9,
              color: "#ffffff",
              display: "flex",
            }}
          >
            {BRAND.split("").map((ch, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: 0,
                  transform: "translateY(70px) rotateX(-45deg)",
                  animation: `charReveal 0.6s ${0.7 + i * 0.12}s ease forwards`,
                }}
              >
                {ch}
              </span>
            ))}
          </h1>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: "clamp(0.82rem, 1.4vw, 1rem)",
            color: "rgba(255,255,255,0.38)",
            letterSpacing: "0.04em",
            lineHeight: 1.75,
            marginTop: 22,
            maxWidth: 520,
            animation: "fadeUp 0.8s 1.9s ease both",
          }}
        >
          We're crafting something bold, refined, and unlike anything you've
          seen. The future is being built — one detail at a time.
        </p>

        {/* COMING SOON flip */}
        <div style={{ marginTop: 44, animation: "fadeUp 0.6s 2.0s ease both" }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "clamp(0.95rem, 2.2vw, 1.3rem)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {COMING_SOON_CHARS.map((ltr, i) => (
              <FlipChar
                key={i}
                ltr={ltr}
                num={RANDOM_NUMS[i]}
                delay={2.2 + i * 0.13}
              />
            ))}
          </div>
        </div>

        {/* Countdown */}
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
            marginTop: 64,
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeUp 0.8s 3.6s ease both",
          }}
        >
          {(["days", "hours", "minutes", "seconds"] as const).map((unit, i) => (
            <div
              key={unit}
              style={{ display: "flex", alignItems: "flex-start", gap: 16 }}
            >
              <CountBlock value={timeLeft[unit]} label={unit} />
              {i < 3 && (
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                    color: "rgba(255,255,255,0.18)",
                    lineHeight: 1,
                    paddingTop: 18,
                  }}
                >
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            maxWidth: 560,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${GREEN}55, transparent)`,
            margin: "60px auto 0",
            animation: "fadeIn 1s 4s ease both",
          }}
        />

        {/* Notify */}
        <div
          style={{
            marginTop: 48,
            animation: "fadeUp 0.8s 4.1s ease both",
            width: "100%",
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              marginBottom: 20,
            }}
          >
            Be the first to know when we launch
          </p>

          {notified ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(20,236,92,0.1)",
                border: `1px solid ${GREEN}55`,
                borderRadius: 8,
                padding: "14px 28px",
                color: GREEN,
                fontFamily: "monospace",
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
                animation: "fadeIn 0.4s ease",
              }}
            >
              <span>✓</span>
              <span>You're on the list — we'll be in touch!</span>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNotify()}
                placeholder="Enter your email address"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${emailError ? "#ff4444" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 8,
                  padding: "14px 20px",
                  color: "#ffffff",
                  fontSize: "0.88rem",
                  width: 280,
                  outline: "none",
                  fontFamily: "inherit",
                  letterSpacing: "0.02em",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  boxShadow: emailError
                    ? "0 0 0 3px rgba(255,68,68,0.15)"
                    : "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = GREEN;
                  e.target.style.boxShadow = "0 0 0 3px rgba(20,236,92,0.1)";
                }}
                onBlur={(e) => {
                  if (!emailError) {
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                    e.target.style.boxShadow = "none";
                  }
                }}
              />
              <button
                onClick={handleNotify}
                style={{
                  background: GREEN,
                  color: "#000000",
                  border: "none",
                  borderRadius: 8,
                  padding: "14px 30px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition:
                    "background 0.25s, transform 0.2s, box-shadow 0.25s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "#0ec44d";
                  el.style.transform = "translateY(-2px)";
                  el.style.boxShadow = "0 8px 28px rgba(20,236,92,0.35)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = GREEN;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(1px)";
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(-2px)";
                }}
              >
                Notify Me
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 44px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(6,6,6,0.65)",
          backdropFilter: "blur(24px)",
          fontFamily: "monospace",
          fontSize: "0.62rem",
          color: "rgba(255,255,255,0.18)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          animation: "fadeUp 0.7s 4.4s ease both",
        }}
      >
        <span>© 2025 Shivorik</span>
        <span>All Rights Reserved</span>
      </footer>
    </div>
  );
}
