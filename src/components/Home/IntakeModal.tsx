"use client";

import { useState, useEffect, useRef } from "react";

const packages = [
  { value: "coverage-8", label: "Coverage — 8 Units / Month", price: "$5,000" },
  { value: "coverage-4", label: "Coverage — 4 Units / Month", price: "$2,900" },
  {
    value: "coverage-16",
    label: "Coverage — 16 Units / Month",
    price: "$8,500",
  },
];

const addOns = [
  {
    value: "clean-draft",
    label: "7-Day Clean Draft Unit",
    price: "$500 / unit",
  },
  {
    value: "extra-unit-72h",
    label: "72h Extra Unit (Overage)",
    price: "$750 / unit",
  },
  {
    value: "emergency-rush",
    label: "24h Emergency Rush Upgrade",
    price: "+$1,250 / unit",
  },
];

const unitOptions = ["1 unit", "2", "3", "4", "5+ units"];

const deliveryFormats = [
  { value: "excel", label: "Excel / Sheet draft" },
  { value: "word", label: "Word / Doc" },
  { value: "portal", label: "Portal Copy ready" },
];

const STEPS = [
  { id: 1, title: "Who are you?", subtitle: "Tell us about yourself" },
  { id: 2, title: "Your situation", subtitle: "Help us understand the scope" },
  { id: 3, title: "Ready to launch", subtitle: "Confirm and submit" },
];

// ── Change this to your actual backend URL ──────────────────────────────────
const API_URL = import.meta.env.VITE_PUBLIC_API_URL || "http://localhost:5000";
// ────────────────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  email: string;
  company: string;
  package: string;
  selectedAddOns: string[];
  questionnaireLink: string;
  unitsNeeded: string;
  rushHandling: string;
  deadline: string;
  deliveryFormat: string;
  evidenceFolder: string;
  additionalNotes: string;
  phone: string;
  consent: boolean;
}

const defaultForm: FormData = {
  name: "",
  email: "",
  company: "",
  package: "",
  selectedAddOns: [],
  questionnaireLink: "",
  unitsNeeded: "",
  rushHandling: "No",
  deadline: "",
  deliveryFormat: "excel",
  evidenceFolder: "",
  additionalNotes: "",
  phone: "",
  consent: false,
};

export default function IntakeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [addOnsOpen, setAddOnsOpen] = useState(false);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setTimeout(() => {
        setStep(1);
        setSubmitted(false);
        setSubmitError(null);
        setErrors({});
        setAddOnsOpen(false);
        setForm(defaultForm);
      }, 400);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const set = (field: keyof FormData, value: string | boolean | string[]) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const toggleAddOn = (value: string) => {
    const current = form.selectedAddOns;
    if (current.includes(value)) {
      set(
        "selectedAddOns",
        current.filter((v) => v !== value),
      );
    } else {
      set("selectedAddOns", [...current, value]);
    }
  };

  const validateStep = (s: number): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (s === 1) {
      if (!form.name.trim()) errs.name = "Name is required";
      if (!form.email.trim()) errs.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        errs.email = "Enter a valid email";
      if (!form.company.trim()) errs.company = "Company is required";
      if (!form.package) errs.package = "Please select a package";
    }
    if (s === 3) {
      if (!form.consent) errs.consent = "You must agree to continue";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API_URL}/api/intake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Something went wrong. Please try again.",
        );
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Network error. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        .im-root * { box-sizing: border-box; }

        .im-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(5, 5, 10, 0.88);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: im-fadein 0.35s ease;
          overflow-y: auto;
        }

        @keyframes im-fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .im-card {
          position: relative;
          width: 100%;
          max-width: 780px;
          max-height: calc(100vh - 32px);
          background: #0E1424;
          border: 1px solid rgba(88, 101, 242, 0.18);
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: im-slidein 0.38s cubic-bezier(0.16,1,0.3,1);
          font-family: 'DM Sans', sans-serif;
        }

        .im-scrollable {
          overflow-y: auto;
          flex: 1;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .im-scrollable::-webkit-scrollbar { width: 4px; }
        .im-scrollable::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        @keyframes im-slidein {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .im-glow-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #7B5CF0, #3B8BFF, #14EC5C, #3B8BFF, #7B5CF0);
          background-size: 200%;
          animation: im-shimmer 3s linear infinite;
        }

        @keyframes im-shimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        .im-header {
          padding: 20px 32px 0;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-shrink: 0;
        }

        .im-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(20, 236, 92, 0.1);
          border: 1px solid rgba(20, 236, 92, 0.25);
          border-radius: 9999px;
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 600;
          color: #14EC5C;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .im-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #14EC5C;
          animation: im-pulse 1.6s ease infinite;
        }

        @keyframes im-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }

        .im-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
          margin: 0 0 3px;
        }

        .im-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          margin: 0;
        }

        .im-close {
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
          font-size: 18px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s, color 0.2s;
          margin-top: 4px;
        }
        .im-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

        .im-progress-wrap {
          padding: 16px 32px 0;
          flex-shrink: 0;
        }

        .im-steps {
          display: flex;
          gap: 0;
          margin-bottom: 8px;
        }

        .im-step-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          position: relative;
        }

        .im-step-item:not(:last-child)::after {
          content: "";
          position: absolute;
          top: 15px;
          left: calc(50% + 16px);
          right: calc(-50% + 16px);
          height: 1px;
          background: rgba(255,255,255,0.1);
          transition: background 0.4s;
        }

        .im-step-item.done:not(:last-child)::after,
        .im-step-item.active:not(:last-child)::after {
          background: linear-gradient(90deg, #14EC5C, rgba(255,255,255,0.1));
        }

        .im-step-circle {
          width: 30px; height: 30px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          transition: all 0.3s;
          border: 1.5px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.04);
          position: relative;
          z-index: 1;
        }

        .im-step-item.active .im-step-circle {
          border-color: #14EC5C;
          color: #14EC5C;
          background: rgba(20,236,92,0.1);
          box-shadow: 0 0 16px rgba(20,236,92,0.3);
        }

        .im-step-item.done .im-step-circle {
          border-color: #14EC5C;
          background: #14EC5C;
          color: #05050A;
        }

        .im-step-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          transition: color 0.3s;
          text-align: center;
        }

        .im-step-item.active .im-step-label { color: #14EC5C; }
        .im-step-item.done .im-step-label   { color: rgba(255,255,255,0.5); }

        .im-body {
          padding: 20px 32px 24px;
        }

        .im-step-heading {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 2px;
        }

        .im-step-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          margin: 0 0 14px;
        }

        .im-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .im-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .im-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }

        .im-input, .im-select, .im-textarea {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 10px 14px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          width: 100%;
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
          -webkit-appearance: none;
        }

        .im-input::placeholder, .im-textarea::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .im-input:focus, .im-select:focus, .im-textarea:focus {
          border-color: #14EC5C;
          background: rgba(20,236,92,0.04);
          box-shadow: 0 0 0 3px rgba(20,236,92,0.1);
        }

        .im-input.err, .im-select.err, .im-textarea.err {
          border-color: rgba(255, 80, 80, 0.6);
          box-shadow: 0 0 0 3px rgba(255,80,80,0.08);
        }

        .im-select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.3)' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }

        .im-select option {
          background: #0F0F1A;
          color: #fff;
        }

        .im-textarea {
          resize: vertical;
          min-height: 72px;
        }

        .im-error {
          font-size: 11px;
          color: #ff6b6b;
          margin-top: -2px;
        }

        /* Submit error banner */
        .im-submit-error {
          background: rgba(255,80,80,0.08);
          border: 1px solid rgba(255,80,80,0.25);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #ff6b6b;
          margin-bottom: 4px;
        }

        .im-addons-wrap {
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          overflow: hidden;
        }

        .im-addons-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 16px;
          cursor: pointer;
          background: rgba(255,255,255,0.03);
          transition: background 0.2s;
          user-select: none;
        }

        .im-addons-header:hover {
          background: rgba(255,255,255,0.06);
        }

        .im-addons-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .im-addons-icon {
          width: 22px; height: 22px;
          border-radius: 6px;
          background: rgba(59,139,255,0.15);
          border: 1px solid rgba(59,139,255,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
        }

        .im-addons-title {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          font-family: 'Syne', sans-serif;
        }

        .im-addons-badge {
          font-size: 10px;
          font-weight: 700;
          color: #3B8BFF;
          background: rgba(59,139,255,0.12);
          border: 1px solid rgba(59,139,255,0.25);
          border-radius: 9999px;
          padding: 2px 8px;
          letter-spacing: 0.06em;
        }

        .im-addons-chevron {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          transition: transform 0.25s;
        }

        .im-addons-chevron.open {
          transform: rotate(180deg);
        }

        .im-addons-body {
          display: none;
          flex-direction: column;
          gap: 0;
          border-top: 1px solid rgba(255,255,255,0.07);
        }

        .im-addons-body.open {
          display: flex;
        }

        .im-addon-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: background 0.15s;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .im-addon-row:last-child { border-bottom: none; }
        .im-addon-row:hover { background: rgba(255,255,255,0.03); }
        .im-addon-row.sel { background: rgba(20,236,92,0.04); }

        .im-addon-left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }

        .im-addon-check {
          width: 18px; height: 18px;
          flex-shrink: 0;
          border-radius: 5px;
          border: 1.5px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.18s;
        }

        .im-addon-row.sel .im-addon-check {
          background: #14EC5C;
          border-color: #14EC5C;
        }

        .im-addon-name { font-size: 13px; color: rgba(255,255,255,0.7); }
        .im-addon-row.sel .im-addon-name { color: #fff; }

        .im-addon-price {
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          font-family: 'Syne', sans-serif;
          white-space: nowrap;
        }

        .im-addon-row.sel .im-addon-price { color: #14EC5C; }

        .im-addons-count {
          font-size: 10px;
          font-weight: 700;
          color: #14EC5C;
          background: rgba(20,236,92,0.12);
          border: 1px solid rgba(20,236,92,0.3);
          border-radius: 9999px;
          padding: 2px 8px;
          letter-spacing: 0.06em;
          margin-left: 6px;
        }

        .im-unit-row { display: flex; gap: 6px; flex-wrap: wrap; }

        .im-unit-pill {
          flex: 1;
          min-width: 44px;
          padding: 8px 6px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
        }

        .im-unit-pill:hover { border-color: rgba(20,236,92,0.3); background: rgba(20,236,92,0.05); }
        .im-unit-pill.sel { border-color: #14EC5C; background: rgba(20,236,92,0.1); box-shadow: 0 0 12px rgba(20,236,92,0.15); }

        .im-unit-label { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.6); font-family: 'Syne', sans-serif; }
        .im-unit-pill.sel .im-unit-label { color: #14EC5C; }

        .im-rush-row { display: flex; gap: 6px; }

        .im-rush-pill {
          flex: 1;
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
        }

        .im-rush-pill:hover { border-color: rgba(20,236,92,0.3); background: rgba(20,236,92,0.05); }
        .im-rush-pill.sel { border-color: #14EC5C; background: rgba(20,236,92,0.1); box-shadow: 0 0 12px rgba(20,236,92,0.15); }

        .im-rush-label { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.6); font-family: 'Syne', sans-serif; }
        .im-rush-pill.sel .im-rush-label { color: #14EC5C; }

        .im-format-row { display: flex; gap: 6px; flex-wrap: wrap; }

        .im-format-pill {
          flex: 1;
          min-width: 100px;
          padding: 8px 8px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
        }

        .im-format-pill:hover { border-color: rgba(20,236,92,0.3); background: rgba(20,236,92,0.05); }
        .im-format-pill.sel { border-color: #14EC5C; background: rgba(20,236,92,0.1); box-shadow: 0 0 12px rgba(20,236,92,0.15); }

        .im-format-label { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.6); font-family: 'Syne', sans-serif; }
        .im-format-pill.sel .im-format-label { color: #14EC5C; }

        .im-queue-note { font-size: 12px; color: rgba(255,255,255,0.35); line-height: 1.6; padding: 0; }

        .im-info-box {
          background: rgba(59, 139, 255, 0.08);
          border: 1px solid rgba(59, 139, 255, 0.2);
          border-radius: 14px;
          padding: 16px 18px;
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
        }

        .im-checkbox-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          cursor: pointer;
          margin-top: 4px;
        }

        .im-checkbox-box {
          width: 20px; height: 20px;
          flex-shrink: 0;
          border-radius: 6px;
          border: 1.5px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          margin-top: 1px;
        }

        .im-checkbox-box.checked { background: #14EC5C; border-color: #14EC5C; }

        .im-checkbox-text { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.5; }

        .im-footer {
          padding: 16px 32px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
          background: #0E1424;
          flex-direction: column;
        }

        .im-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 16px;
        }

        .im-btn-back {
          padding: 12px 22px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .im-btn-back:hover { border-color: rgba(255,255,255,0.25); color: #fff; }

        .im-btn-next {
          position: relative;
          padding: 12px 28px;
          border-radius: 12px;
          border: none;
          background: #14EC5C;
          color: #05050A;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          overflow: hidden;
          letter-spacing: 0.02em;
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 130px;
          justify-content: center;
        }

        .im-btn-next:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        .im-btn-next::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transform: translateX(-100%);
          transition: transform 0.5s;
        }

        .im-btn-next:hover:not(:disabled) { box-shadow: 0 0 24px rgba(20,236,92,0.45); transform: translateY(-1px); }
        .im-btn-next:hover:not(:disabled)::before { transform: translateX(100%); }
        .im-btn-next:active:not(:disabled) { transform: translateY(0); }

        /* Spinner */
        .im-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(5,5,10,0.3);
          border-top-color: #05050A;
          border-radius: 50%;
          animation: im-spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        @keyframes im-spin {
          to { transform: rotate(360deg); }
        }

        .im-step-counter { font-size: 12px; color: rgba(255,255,255,0.25); font-family: 'Syne', sans-serif; }

        .im-success {
          padding: 60px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
        }

        .im-success-icon {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: rgba(20,236,92,0.12);
          border: 2px solid rgba(20,236,92,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 32px;
          box-shadow: 0 0 32px rgba(20,236,92,0.25);
          animation: im-pop 0.5s cubic-bezier(0.16,1,0.3,1);
        }

        @keyframes im-pop {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        .im-success-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #fff; margin: 0; }
        .im-success-sub { font-size: 15px; color: rgba(255,255,255,0.45); max-width: 360px; line-height: 1.6; margin: 0; }

        .im-success-close {
          margin-top: 8px;
          padding: 12px 32px;
          border-radius: 12px;
          border: none;
          background: #14EC5C;
          color: #05050A;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.02em;
        }
        .im-success-close:hover { box-shadow: 0 0 24px rgba(20,236,92,0.45); transform: translateY(-1px); }

        @media (max-width: 600px) {
          .im-header { padding: 16px 18px 0; }
          .im-body { padding: 16px 18px 20px; }
          .im-footer { padding: 14px 18px 18px; }
          .im-progress-wrap { padding: 14px 18px 0; }
          .im-grid-2 { grid-template-columns: 1fr; }
          .im-title { font-size: 18px; }
          .im-unit-row { gap: 4px; }
          .im-format-row { gap: 4px; }
        }
      `}</style>

      <div className="im-root">
        <div
          className="im-overlay"
          ref={overlayRef}
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
        >
          <div className="im-card">
            <div className="im-glow-bar" />

            {submitted ? (
              <div className="im-success">
                <div className="im-success-icon">✓</div>
                <p className="im-success-title">You're in the queue.</p>
                <p className="im-success-sub">
                  We've received your intake. A Shivorik specialist will reach
                  out within 2 hours to confirm scope and next steps.
                </p>
                <button className="im-success-close" onClick={onClose}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="im-header">
                  <div className="im-title-block">
                    <div className="im-badge">
                      <div className="im-badge-dot" />
                      2-minute intake
                    </div>
                    <p className="im-title">{STEPS[step - 1].title}</p>
                    <p className="im-subtitle">{STEPS[step - 1].subtitle}</p>
                  </div>
                  <button
                    className="im-close"
                    onClick={onClose}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <div className="im-progress-wrap">
                  <div className="im-steps">
                    {STEPS.map((s) => (
                      <div
                        key={s.id}
                        className={`im-step-item ${step === s.id ? "active" : step > s.id ? "done" : ""}`}
                      >
                        <div className="im-step-circle">
                          {step > s.id ? "✓" : s.id}
                        </div>
                        <span className="im-step-label">
                          {s.id === 1
                            ? "You"
                            : s.id === 2
                              ? "Situation"
                              : "Confirm"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="im-scrollable">
                  <div className="im-body">
                    {/* STEP 1 */}
                    {step === 1 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 14,
                        }}
                      >
                        <p className="im-step-heading">
                          Let's start with the basics
                        </p>
                        <p className="im-step-sub">
                          All fields required to proceed
                        </p>

                        <div className="im-grid-2">
                          <div className="im-field">
                            <label className="im-label">Name</label>
                            <input
                              className={`im-input${errors.name ? " err" : ""}`}
                              placeholder="Your full name"
                              value={form.name}
                              onChange={(e) => set("name", e.target.value)}
                            />
                            {errors.name && (
                              <span className="im-error">{errors.name}</span>
                            )}
                          </div>
                          <div className="im-field">
                            <label className="im-label">Work Email</label>
                            <input
                              className={`im-input${errors.email ? " err" : ""}`}
                              placeholder="name@company.com"
                              type="email"
                              value={form.email}
                              onChange={(e) => set("email", e.target.value)}
                            />
                            {errors.email && (
                              <span className="im-error">{errors.email}</span>
                            )}
                          </div>
                        </div>

                        <div className="im-grid-2">
                          <div className="im-field">
                            <label className="im-label">Company</label>
                            <input
                              className={`im-input${errors.company ? " err" : ""}`}
                              placeholder="Company Inc."
                              value={form.company}
                              onChange={(e) => set("company", e.target.value)}
                            />
                            {errors.company && (
                              <span className="im-error">{errors.company}</span>
                            )}
                          </div>
                          <div className="im-field">
                            <label className="im-label">Phone (optional)</label>
                            <input
                              className="im-input"
                              placeholder="+1 (555) 000-0000"
                              type="tel"
                              value={form.phone}
                              onChange={(e) => set("phone", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="im-field">
                          <label className="im-label">Package</label>
                          <select
                            className={`im-select${errors.package ? " err" : ""}`}
                            value={form.package}
                            onChange={(e) => set("package", e.target.value)}
                          >
                            <option value="">Select a package…</option>
                            {packages.map((p) => (
                              <option key={p.value} value={p.value}>
                                {p.label} — {p.price}
                              </option>
                            ))}
                          </select>
                          {errors.package && (
                            <span className="im-error">{errors.package}</span>
                          )}
                        </div>

                        <div className="im-field">
                          <label className="im-label">
                            Add-ons
                            {form.selectedAddOns.length > 0 && (
                              <span className="im-addons-count">
                                {form.selectedAddOns.length} selected
                              </span>
                            )}
                          </label>
                          <div className="im-addons-wrap">
                            <div
                              className="im-addons-header"
                              onClick={() => setAddOnsOpen((v) => !v)}
                            >
                              <div className="im-addons-header-left">
                                <div className="im-addons-icon">＋</div>
                                <span className="im-addons-title">
                                  Optional Add-ons
                                </span>
                                <span className="im-addons-badge">
                                  Per unit pricing
                                </span>
                              </div>
                              <span
                                className={`im-addons-chevron${addOnsOpen ? " open" : ""}`}
                              >
                                ▼
                              </span>
                            </div>
                            <div
                              className={`im-addons-body${addOnsOpen ? " open" : ""}`}
                            >
                              {addOns.map((a) => {
                                const selected = form.selectedAddOns.includes(
                                  a.value,
                                );
                                return (
                                  <div
                                    key={a.value}
                                    className={`im-addon-row${selected ? " sel" : ""}`}
                                    onClick={() => toggleAddOn(a.value)}
                                  >
                                    <div className="im-addon-left">
                                      <div className="im-addon-check">
                                        {selected && (
                                          <svg
                                            width="10"
                                            height="8"
                                            viewBox="0 0 10 8"
                                            fill="none"
                                          >
                                            <path
                                              d="M1 4L3.5 6.5L9 1"
                                              stroke="#05050A"
                                              strokeWidth="1.8"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                        )}
                                      </div>
                                      <span className="im-addon-name">
                                        {a.label}
                                      </span>
                                    </div>
                                    <span className="im-addon-price">
                                      {a.price}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 18,
                        }}
                      >
                        <p className="im-step-heading">Scope & delivery</p>
                        <p className="im-step-sub">
                          Help us prepare the right team
                        </p>

                        <div className="im-field">
                          <label className="im-label">
                            Questionnaire Link (or notes)
                          </label>
                          <input
                            className="im-input"
                            placeholder="Paste a link to the questionnaire file / portal"
                            value={form.questionnaireLink}
                            onChange={(e) =>
                              set("questionnaireLink", e.target.value)
                            }
                          />
                        </div>

                        <div className="im-grid-2">
                          <div className="im-field">
                            <label className="im-label">
                              Units needed now (optional)
                            </label>
                            <div className="im-unit-row">
                              {unitOptions.map((u) => (
                                <div
                                  key={u}
                                  className={`im-unit-pill${form.unitsNeeded === u ? " sel" : ""}`}
                                  onClick={() => set("unitsNeeded", u)}
                                >
                                  <span className="im-unit-label">{u}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="im-field">
                            <label className="im-label">
                              Rush handling (if available)
                            </label>
                            <div className="im-rush-row">
                              <div
                                className={`im-rush-pill${form.rushHandling === "No" ? " sel" : ""}`}
                                onClick={() => set("rushHandling", "No")}
                              >
                                <span className="im-rush-label">No</span>
                              </div>
                              <div
                                className={`im-rush-pill${form.rushHandling === "Yes" ? " sel" : ""}`}
                                onClick={() => set("rushHandling", "Yes")}
                              >
                                <span className="im-rush-label">
                                  Yes — 24hr rush
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="im-grid-2">
                          <div className="im-field">
                            <label className="im-label">Deadline</label>
                            <input
                              className="im-input"
                              placeholder="e.g., Friday 5pm"
                              value={form.deadline}
                              onChange={(e) => set("deadline", e.target.value)}
                            />
                          </div>

                          <div className="im-field">
                            <label className="im-label">
                              Preferred delivery format
                            </label>
                            <div className="im-format-row">
                              {deliveryFormats.map((f) => (
                                <div
                                  key={f.value}
                                  className={`im-format-pill${form.deliveryFormat === f.value ? " sel" : ""}`}
                                  onClick={() => set("deliveryFormat", f.value)}
                                >
                                  <span className="im-format-label">
                                    {f.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="im-field">
                          <label className="im-label">
                            Evidence folder link (optional)
                          </label>
                          <input
                            className="im-input"
                            placeholder="Share a secure folder link (optional)"
                            value={form.evidenceFolder}
                            onChange={(e) =>
                              set("evidenceFolder", e.target.value)
                            }
                          />
                        </div>

                        <p className="im-queue-note">
                          Queue note: We process up to 2 units in parallel.
                          Additional units enter the queue. If evidence is not
                          ready, that's okay — we'll flag what's missing.
                        </p>
                      </div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 18,
                        }}
                      >
                        <p className="im-step-heading">
                          Anything we should know?
                        </p>
                        <p className="im-step-sub">
                          Final details before we get started
                        </p>

                        <div className="im-field">
                          <textarea
                            className="im-textarea"
                            style={{ minHeight: 120 }}
                            placeholder="Any exclusions, prior approvals, sensitive areas, or must-use wording…"
                            value={form.additionalNotes}
                            onChange={(e) =>
                              set("additionalNotes", e.target.value)
                            }
                          />
                        </div>

                        <div className="im-info-box">
                          After you submit, you'll receive a confirmation and a
                          Shivorik specialist will reach out within 2 hours to
                          confirm scope and next steps.
                        </div>

                        <label
                          className="im-checkbox-row"
                          onClick={() => set("consent", !form.consent)}
                        >
                          <div
                            className={`im-checkbox-box${form.consent ? " checked" : ""}`}
                          >
                            {form.consent && (
                              <svg
                                width="12"
                                height="10"
                                viewBox="0 0 12 10"
                                fill="none"
                              >
                                <path
                                  d="M1 5L4.5 8.5L11 1"
                                  stroke="#05050A"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="im-checkbox-text">
                            I agree to Shivorik's terms of service and authorize
                            the team to contact me regarding this submission.
                          </span>
                        </label>
                        {errors.consent && (
                          <span className="im-error" style={{ marginTop: -8 }}>
                            {errors.consent}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="im-footer">
                  {/* Error banner */}
                  {submitError && (
                    <div className="im-submit-error" style={{ width: "100%" }}>
                      ⚠ {submitError}
                    </div>
                  )}

                  <div className="im-footer-row">
                    <button
                      className="im-btn-back"
                      onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
                      disabled={isSubmitting}
                    >
                      {step === 1 ? "Cancel" : "← Back"}
                    </button>

                    <span className="im-step-counter">Step {step} of 3</span>

                    <button
                      className="im-btn-next"
                      onClick={next}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="im-spinner" />
                          Sending…
                        </>
                      ) : step === 3 ? (
                        "Submit →"
                      ) : (
                        "Next →"
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
