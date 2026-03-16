import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

const LAUNCH_DATE = new Date("2026-04-07T00:00:00");

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

* { box-sizing: border-box; }

/* Logo */
.cs-logo-img {
  height: 120px;
}
@media (max-width: 768px) {
  .cs-logo-img { height: 80px; }
}
@media (max-width: 480px) {
  .cs-logo-img { height: 56px; }
}
@media (max-width: 360px) {
  .cs-logo-img { height: 44px; }
}

.cs-header, .cs-footer {
  padding: 18px 44px;
}
@media (max-width: 600px) {
  .cs-header, .cs-footer { padding: 14px 18px; }
}

.cs-logo {
  font-size: 1.55rem;
  letter-spacing: 0.14em;
}
@media (max-width: 400px) {
  .cs-logo { font-size: 1.2rem; }
}

.cs-status-text {
  display: inline;
}
@media (max-width: 360px) {
  .cs-status-text { display: none; }
}

.cs-main {
  padding: 120px 24px 100px;
}
@media (max-width: 768px) {
  .cs-main { padding: 100px 20px 90px; }
}
@media (max-width: 480px) {
  .cs-main { padding: 90px 16px 80px; }
}

.cs-eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.28em;
}
@media (max-width: 480px) {
  .cs-eyebrow { font-size: 0.58rem; letter-spacing: 0.18em; }
}

.cs-hero-title {
  font-size: clamp(4.5rem, 18vw, 13.5rem);
}
@media (max-width: 480px) {
  .cs-hero-title { font-size: clamp(3.8rem, 20vw, 4rem); letter-spacing: 0.03em; }
}

.cs-tagline {
  font-size: clamp(0.8rem, 1.4vw, 1rem);
  max-width: 520px;
}
@media (max-width: 480px) {
  .cs-tagline { font-size: 0.82rem; max-width: 100%; padding: 0 4px; }
}

.cs-flip-row {
  font-size: clamp(0.78rem, 2.2vw, 1.3rem);
  letter-spacing: 0.18em;
}
@media (max-width: 480px) {
  .cs-flip-row { font-size: clamp(0.68rem, 3.5vw, 0.95rem); letter-spacing: 0.12em; }
}

.cs-countdown {
  gap: 10px;
  margin-top: 52px;
}
@media (max-width: 480px) {
  .cs-countdown { gap: 6px; margin-top: 40px; }
}

.cs-block-card {
  padding: 18px 26px;
  min-width: 88px;
  border-radius: 12px;
}
@media (max-width: 768px) {
  .cs-block-card { padding: 14px 18px; min-width: 72px; border-radius: 10px; }
}
@media (max-width: 480px) {
  .cs-block-card { padding: 10px 12px; min-width: 58px; border-radius: 8px; }
}

.cs-count-num {
  font-size: clamp(2.4rem, 5vw, 3.6rem);
}
@media (max-width: 768px) {
  .cs-count-num { font-size: clamp(2rem, 6vw, 2.8rem); }
}
@media (max-width: 480px) {
  .cs-count-num { font-size: clamp(1.6rem, 7vw, 2.2rem); }
}

.cs-colon {
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  padding-top: 18px;
}
@media (max-width: 768px) {
  .cs-colon { font-size: clamp(1.8rem, 5vw, 2.6rem); padding-top: 14px; }
}
@media (max-width: 480px) {
  .cs-colon { font-size: clamp(1.4rem, 5.5vw, 2rem); padding-top: 10px; }
}

.cs-unit-label {
  font-size: 0.6rem;
  letter-spacing: 0.22em;
}
@media (max-width: 480px) {
  .cs-unit-label { font-size: 0.48rem; letter-spacing: 0.12em; }
}

.cs-notify-row {
  flex-direction: row;
  gap: 12px;
}
@media (max-width: 540px) {
  .cs-notify-row { flex-direction: column; align-items: stretch; gap: 10px; }
}

.cs-email-input {
  width: 280px;
}
@media (max-width: 540px) {
  .cs-email-input { width: 100%; max-width: 360px; }
}

.cs-notify-btn {
  padding: 14px 30px;
}
@media (max-width: 540px) {
  .cs-notify-btn { width: 100%; max-width: 360px; padding: 14px 20px; }
}

.cs-footer-text {
  font-size: 0.62rem;
}
@media (max-width: 480px) {
  .cs-footer-text { font-size: 0.52rem; letter-spacing: 0.08em; }
}
`;

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
        className="cs-block-card"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
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
        <span
          key={value}
          className="cs-count-num"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
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
        className="cs-unit-label"
        style={{
          fontFamily: "monospace",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function ComingSoon() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft);
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: 9 + Math.random() * 14,
      delay: Math.random() * 14,
    })),
  );

  useEffect(() => {
    const tag = document.createElement("style");
    tag.innerHTML = KEYFRAMES;
    document.head.appendChild(tag);
    return () => {
      document.head.removeChild(tag);
    };
  }, []);

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
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
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
            "radial-gradient(ellipse 65% 45% at 50% 62%, rgba(20,236,92,0.09) 0%, transparent 70%),radial-gradient(ellipse 50% 40% at 15% 15%, rgba(20,236,92,0.04) 0%, transparent 60%)",
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

      {/* Header */}
      <header
        className="cs-header"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "#060606",
          animation: "fadeDown 0.8s 0.2s ease both",
        }}
      >
        <img
          src={logo}
          alt={BRAND}
          className="cs-logo-img"
          style={{ width: "auto", objectFit: "contain" }}
        />
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
              flexShrink: 0,
              animation: "blink 2s ease-in-out infinite",
            }}
          />
          <span className="cs-status-text">In Development</span>
        </span>
      </header>

      {/* Main */}
      <main
        className="cs-main"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          width: "100%",
          maxWidth: 920,
        }}
      >
        {/* Eyebrow */}
        <p
          className="cs-eyebrow"
          style={{
            fontFamily: "monospace",
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
          <h1
            aria-hidden="true"
            className="cs-hero-title"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
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
          <h1
            className="cs-hero-title"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: "0.05em",
              lineHeight: 0.9,
              color: "#ffffff",
              display: "flex",
              margin: 0,
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
          className="cs-tagline"
          style={{
            color: "rgba(255,255,255,0.38)",
            letterSpacing: "0.04em",
            lineHeight: 1.75,
            marginTop: 22,
            animation: "fadeUp 0.8s 1.9s ease both",
          }}
        >
          We're crafting something bold, refined, and unlike anything you've
          seen. The future is being built — one detail at a time.
        </p>

        {/* COMING SOON flip */}
        <div style={{ marginTop: 44, animation: "fadeUp 0.6s 2.0s ease both" }}>
          <div
            className="cs-flip-row"
            style={{
              fontFamily: "monospace",
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
          className="cs-countdown"
          style={{
            display: "flex",
            alignItems: "flex-start",
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeUp 0.8s 3.6s ease both",
          }}
        >
          {(["days", "hours", "minutes", "seconds"] as const).map((unit, i) => (
            <div
              key={unit}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "inherit",
              }}
            >
              <CountBlock value={timeLeft[unit]} label={unit} />
              {i < 3 && (
                <span
                  className="cs-colon"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    color: "rgba(255,255,255,0.18)",
                    lineHeight: 1,
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
            maxWidth: 560,
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
              className="cs-notify-row"
              style={{
                display: "flex",
                alignItems: "center",
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
                className="cs-email-input"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${emailError ? "#ff4444" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 8,
                  padding: "14px 20px",
                  color: "#ffffff",
                  fontSize: "0.88rem",
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
                className="cs-notify-btn"
                style={{
                  background: GREEN,
                  color: "#000000",
                  border: "none",
                  borderRadius: 8,
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
        className="cs-header cs-footer cs-footer-text"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "#060606",
          fontFamily: "monospace",
          color: "rgba(255,255,255,0.18)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          animation: "fadeUp 0.7s 4.4s ease both",
        }}
      >
        <span>© 2026 Shivorik</span>
        <span>All Rights Reserved</span>
      </footer>
    </div>
  );
}
