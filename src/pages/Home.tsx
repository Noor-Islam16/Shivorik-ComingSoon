import Footer from "@/components/Global/Footer";
import Navbar from "@/components/Global/Navbar";
import FAQSection from "@/components/Home/FAQSection";
import HeroSection from "@/components/Home/HeroSection";
import HowItWorks from "@/components/Home/HowItWorks";
import OperatorSection from "@/components/Home/OperatorSection";
import PlansSection from "@/components/Home/PlansSection";
import RedactedSampleSection from "@/components/Home/RedactedSampleSection";
import ScopeDefinition from "@/components/Home/ScopeDefinition";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { FaClipboardCheck, FaFileAlt, FaUserShield } from "react-icons/fa";
import { IoDocumentTextOutline, IoLayers } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";

const myCustomFeatures = [
  {
    icon: <FaClipboardCheck size={22} color="#14EC5C" strokeWidth={2} />,
    title: "Scope‑controlled engagement",
    description:
      "We define what’s in / out up front so delivery stays fast and reliable. No surprise “extra projects” inside the rescue.",
  },
  {
    icon: <FaUserShield size={22} color="#14EC5C" strokeWidth={2} />,
    title: "Security handling",
    description:
      "Least‑privilege access, minimal data intake, and controlled artifact sharing. We can work via secure links, time‑boxed access, or redacted exports — you choose the sharing method.",
  },
  {
    icon: <FaFileAlt size={22} color="#14EC5C" strokeWidth={2} />,
    title: "Clean deliverables",
    description:
      "Draft answers + an evidence map that links each answer to the right policy / control / document — easy to review internally.",
  },
];

const myFeatures = [
  {
    icon: <IoDocumentTextOutline size={22} color="#14EC5C" strokeWidth={2} />,
    title: "Questionnaire draft",
    description:
      "Review‑ready answers with consistent tone, minimal ambiguity, and clear references to your controls.",
  },
  {
    icon: <IoLayers size={22} color="#14EC5C" strokeWidth={2} />,
    title: "Evidence map",
    description:
      "A lightweight index connecting answers → documents. Makes internal review fast and defensible.",
  },
  {
    icon: <MdOutlineDashboard size={22} color="#14EC5C" strokeWidth={2} />,
    title: "Gap flags",
    description:
      "Where evidence is missing, we mark it clearly so you can decide: add proof, soften language, or scope out.",
  },
];

// const plans = [
//   {
//     badge: "72‑Hour Rescue",
//     title: "One case • 72 hours",
//     price: "$3,850",
//     period: "/case",
//     description: "For deal‑cycle urgency when you don’t need monthly coverage.",
//     features: [
//       { text: "Priority drafting + evidence map" },
//       { text: "Up to two clarification rounds" },
//       { text: "Best for: one urgent deal" },
//     ],
//     primaryCTA: "Start intake",
//     highlighted: false,
//   },
//   {
//     badge: "Emergency",
//     title: "24‑Hour Emergency",
//     price: "$6,499",
//     period: "/case",
//     description: "Limited slots. We confirm feasibility before you pay.",
//     features: [
//       { text: "Max priority scheduling" },
//       { text: "Rapid clarification loop" },
//       { text: "Best for: “tomorrow” deadlines" },
//     ],
//     primaryCTA: "Check emergency slot",
//     // secondaryCTA: "Learn more",
//     highlighted: true, // ← this one gets the taller card
//   },
//   {
//     badge: "7‑Day Clean Draft",
//     title: "One case • 7 days",
//     price: "$1,850",
//     period: "/case",
//     description:
//       "For non‑urgent questionnaires where you want a strong baseline draft.",
//     features: [
//       { text: "Draft responses + evidence map" },
//       { text: "One clarification round" },
//       { text: "Best for: internal review cycles" },
//     ],
//     primaryCTA: "Start intake",
//     highlighted: false,
//   },
// ];

function Home() {
  return (
    <div className="relative bg-[linear-gradient(to_bottom,_#0A0A0A_6%,_#0F1025_56%,_#151644_100%)]">
      <ShootingStars />
      <StarsBackground starDensity={0.00025} />
      <div className="relative z-50">
        <Navbar />
        <HeroSection />
        <OperatorSection
          heading="Built for trust, not hype"
          subheading="We win by being precise: scope clarity, security handling, consistent structure, and fast delivery—packaged as monthly coverage so your pipeline stays predictable."
          badge="Security‑first handling • NDA‑compatible"
          features={myCustomFeatures}
          // trustNote="Custom trust message"
        />
        <OperatorSection
          badge="Built for SaaS, IT, and platform teams"
          trustNote="If you need extra reassurance, request a redacted walkthrough of the deliverable format and evidence map before you commit."
          hoverVariant="liquid"
        />
        <HowItWorks />
        <ScopeDefinition />
        <OperatorSection
          id="deliverables"
          heading="What we deliver"
          // subheading="Everything is structured for speed: clean answers, consistent language, and proof mapping for review."
          badge="Security‑first handling • NDA‑compatible"
          features={myFeatures}
          trustLabel="NDA note:"
          trustNote="We do not publish client work. If you want to see structure and approach, you can request a redacted walkthrough."
          hoverVariant="tilt"
        />
        <RedactedSampleSection />
        <PlansSection />
        {/* <PlansSection
          heading="One‑off rescue (non‑subscribers)"
          subheading="Prefer a single urgent case? Use the one‑off rescue. Many teams start here, then move to monthly coverage."
          badge="Fixed‑price urgent handling"
          plans={plans}
          showFootnotes={false}
        /> */}
        <FAQSection />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
