import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  HiBriefcase,
  HiOfficeBuilding,
  HiCurrencyDollar,
  HiAcademicCap,
  HiLightningBolt,
  HiCode,
  HiDocumentText,
  HiLink,
  HiPhotograph,
  HiChevronDown,
  HiX,
  HiPlus,
  HiCheck,
  HiExclamation,
  HiClipboardList,
  HiCalendar,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiTag,
  HiInformationCircle,
  HiSave,
  HiPaperAirplane,
  HiArrowLeft,
} from "react-icons/hi";

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────────────── */
const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Temporary",
];
const SENIORITY_LEVELS = [
  "Intern",
  "Junior (0–2 yrs)",
  "Mid-Level (2–5 yrs)",
  "Senior (5–8 yrs)",
  "Lead (8–12 yrs)",
  "Principal / Staff (12+ yrs)",
  "Director",
  "VP / C-Level",
];
const WORK_ARRANGEMENTS = ["On-site", "Remote", "Hybrid", "Flexible"];
const CONTRACT_TYPES = [
  "Permanent",
  "Fixed-term",
  "Project-based",
  "Zero-hours",
];
const DEGREE_TYPES = [
  "No Requirement",
  "High School",
  "Associate",
  "Bachelor's",
  "Master's",
  "PhD",
  "Professional Certification",
];
const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Marketing",
  "Engineering",
  "Design",
  "Legal",
  "Retail",
  "Hospitality",
  "Manufacturing",
  "Media",
  "Non-profit",
  "Government",
];
const CATEGORIES = [
  "Software Engineering",
  "Data Science",
  "Product Management",
  "UX/UI Design",
  "DevOps",
  "Cybersecurity",
  "Marketing",
  "Sales",
  "Customer Support",
  "HR",
  "Finance",
  "Operations",
  "Legal",
  "Content",
];
const COUNTRIES = [
  "Bangladesh",
  "Greece",
  "United States",
  "United Kingdom",
  "Germany",
  "Canada",
  "Australia",
  "India",
  "Singapore",
  "UAE",
];
const CITIES_BY_COUNTRY = {
  Bangladesh: ["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Sylhet"],
  Greece: ["Athens", "Thessaloniki", "Patras", "Heraklion", "Larissa"],
  "United States": [
    "New York",
    "San Francisco",
    "Austin",
    "Seattle",
    "Chicago",
  ],
  default: ["Capital City", "Main City", "Port City"],
};

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

  * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
  h1,h2,h3,h4,h5 { font-family: 'Sora', sans-serif; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideIn  { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
  @keyframes pulse2   { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes spin     { to{transform:rotate(360deg)} }

  .fade-up   { animation: fadeUp  .35s cubic-bezier(.22,1,.36,1) forwards; opacity:0; }
  .slide-in  { animation: slideIn .28s cubic-bezier(.22,1,.36,1) forwards; opacity:0; }

  /* Rich text editor base */
  .rte-content { min-height: 180px; outline:none; }
  .rte-content:empty:before { content: attr(data-placeholder); color:#94a3b8; pointer-events:none; }
  .rte-content a { color:#1e2558; text-decoration:underline; }
  .rte-content img { max-width:100%; border-radius:10px; margin:6px 0; }
  .rte-content ul  { list-style:disc; padding-left:1.4rem; }
  .rte-content ol  { list-style:decimal; padding-left:1.4rem; }
  .rte-content blockquote { border-left:3px solid #4eb956; padding-left:12px; color:#64748b; margin:6px 0; }

  /* Custom scrollbar */
  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:#f1f5f9; }
  ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:99px; }
  ::-webkit-scrollbar-thumb:hover { background:#94a3b8; }

  /* Select arrow */
  select { -webkit-appearance:none; appearance:none; background-image:none; }

  .field-focus:focus-within { border-color:#1e2558 !important; box-shadow: 0 0 0 3px rgba(30,37,88,.07); }
  .err-field { border-color:#ef4444 !important; }
  .err-field:focus-within { box-shadow: 0 0 0 3px rgba(239,68,68,.08) !important; }

  /* Step nav */
  .step-active  { background:#1e2558; color:#fff; }
  .step-done    { background:#4eb956; color:#fff; }
  .step-idle    { background:#f1f5f9; color:#94a3b8; }

  /* Tag chip */
  .chip { transition: all .15s; }
  .chip:hover { transform:translateY(-1px); }

  /* toggle */
  input[type=checkbox].toggle-check:checked + .toggle-track { background:#4eb956; }
  .toggle-thumb { transition: transform .2s; }
  input[type=checkbox].toggle-check:checked + .toggle-track .toggle-thumb { transform:translateX(18px); }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   RICH TEXT EDITOR  (no third-party)
───────────────────────────────────────────────────────────────────────────── */
const RTE_TOOLS = [
  { cmd: "bold", icon: "B", title: "Bold", style: "font-bold" },
  { cmd: "italic", icon: "I", title: "Italic", style: "italic" },
  { cmd: "underline", icon: "U", title: "Underline", style: "underline" },
  { cmd: "insertUnorderedList", icon: "• —", title: "Bullet List", style: "" },
  { cmd: "insertOrderedList", icon: "1.", title: "Numbered List", style: "" },
  { cmd: "formatBlock", icon: "❝", title: "Blockquote", val: "blockquote" },
];

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Start typing…",
  error,
}) => {
  const ref = useRef(null);
  const linkRef = useRef(null);
  const fileRef = useRef(null);
  const [showLink, setShowLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [linkText, setLinkText] = useState("");
  const savedRange = useRef(null);

  // Sync external → DOM only on mount
  useEffect(() => {
    if (ref.current && value !== undefined && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, []); // eslint-disable-line

  const exec = (cmd, val) => {
    ref.current?.focus();
    document.execCommand(cmd, false, val ?? null);
    onChange(ref.current?.innerHTML || "");
  };

  const saveRange = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount)
      savedRange.current = sel.getRangeAt(0).cloneRange();
  };

  const restoreRange = () => {
    const sel = window.getSelection();
    if (savedRange.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  };

  const insertLink = () => {
    ref.current?.focus();
    restoreRange();
    const url = linkUrl.trim();
    const text = linkText.trim() || url;
    if (!url || url === "https://") return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount && !sel.isCollapsed) {
      document.execCommand("createLink", false, url);
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = text;
      const range = savedRange.current || document.createRange();
      range.collapse(true);
      range.insertNode(a);
    }
    setShowLink(false);
    setLinkUrl("https://");
    setLinkText("");
    onChange(ref.current?.innerHTML || "");
  };

  const insertImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      ref.current?.focus();
      restoreRange();
      const img = document.createElement("img");
      img.src = ev.target.result;
      img.style.maxWidth = "100%";
      img.style.borderRadius = "10px";
      const range = savedRange.current || document.createRange();
      range.collapse(false);
      range.insertNode(img);
      range.setStartAfter(img);
      range.collapse(true);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      onChange(ref.current?.innerHTML || "");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div
      className={`rounded-2xl border bg-white overflow-hidden transition-all duration-150 field-focus ${error ? "err-field" : "border-slate-200"}`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-slate-100 bg-slate-50">
        {RTE_TOOLS.map((t) => (
          <button
            key={t.cmd}
            type="button"
            title={t.title}
            onMouseDown={(e) => {
              e.preventDefault();
              exec(t.cmd, t.val);
            }}
            className={`px-2.5 py-1 rounded-lg text-[12px] text-[#1e2558] hover:bg-[#1e2558]/10 transition-colors duration-100 select-none ${t.style}`}
          >
            {t.icon}
          </button>
        ))}

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Link button */}
        <button
          type="button"
          title="Insert link"
          onMouseDown={(e) => {
            e.preventDefault();
            saveRange();
            setShowLink((v) => !v);
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] text-[#1e2558] hover:bg-[#1e2558]/10 transition-colors duration-100"
        >
          <HiLink className="text-sm" /> Link
        </button>

        {/* Image button */}
        <button
          type="button"
          title="Insert image"
          onMouseDown={(e) => {
            e.preventDefault();
            saveRange();
            fileRef.current?.click();
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] text-[#1e2558] hover:bg-[#1e2558]/10 transition-colors duration-100"
        >
          <HiPhotograph className="text-sm" /> Image
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={insertImage}
        />

        {/* Heading sizes */}
        {["H1", "H2", "H3"].map((h) => (
          <button
            key={h}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("formatBlock", h.toLowerCase());
            }}
            className="px-2.5 py-1 rounded-lg text-[12px] font-bold text-[#1e2558] hover:bg-[#1e2558]/10 transition-colors duration-100"
          >
            {h}
          </button>
        ))}
      </div>

      {/* Link popover */}
      {showLink && (
        <div className="px-4 py-3 border-b border-slate-100 bg-blue-50/40 flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              URL
            </label>
            <input
              ref={linkRef}
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-[12px] text-[#1e2558] outline-none focus:border-[#1e2558]"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Display Text (optional)
            </label>
            <input
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Click here"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-[12px] text-[#1e2558] outline-none focus:border-[#1e2558]"
            />
          </div>
          <button
            type="button"
            onClick={insertLink}
            className="px-4 py-2 rounded-xl bg-[#1e2558] text-white text-[12px] font-bold hover:bg-[#1e2558]/90"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => setShowLink(false)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-[12px] text-slate-500"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Editable area */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={() => onChange(ref.current?.innerHTML || "")}
        onMouseUp={saveRange}
        onKeyUp={saveRange}
        className="rte-content px-4 py-3 text-[14px] text-[#1e2558] leading-relaxed focus:outline-none"
        style={{ minHeight: 180 }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────────────────────── */

// Field wrapper
const Field = ({ label, required, hint, error, children, className = "" }) => (
  <div className={`space-y-1.5 ${className}`}>
    {label && (
      <label className="flex items-center gap-1.5 text-[12px] font-bold text-slate-600 uppercase tracking-wider">
        {label}
        {required && (
          <span className="text-[#4eb956] text-base leading-none">*</span>
        )}
        {hint && (
          <span className="group relative ml-1 cursor-help">
            <HiInformationCircle className="text-slate-300 text-sm" />
            <span className="pointer-events-none absolute left-5 top-0 z-20 w-48 rounded-xl bg-[#1e2558] text-white text-[11px] px-3 py-2 font-normal normal-case tracking-normal opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xl">
              {hint}
            </span>
          </span>
        )}
      </label>
    )}
    {children}
    {error && (
      <p className="flex items-center gap-1 text-[11px] text-red-500 font-medium">
        <HiExclamation className="flex-shrink-0" /> {error}
      </p>
    )}
  </div>
);

// Input
const Input = ({ error, className = "", ...props }) => (
  <input
    {...props}
    className={`w-full px-4 py-3 rounded-xl border text-[13px] text-[#1e2558] font-medium bg-slate-50 placeholder-slate-400 outline-none transition-all duration-150
      focus:bg-white focus:border-[#1e2558] focus:shadow-[0_0_0_3px_rgba(30,37,88,.07)]
      ${error ? "border-red-400 bg-red-50/30" : "border-slate-200"}
      ${className}`}
  />
);

// Select
const Select = ({ error, children, className = "", ...props }) => (
  <div className={`relative ${className}`}>
    <select
      {...props}
      className={`w-full px-4 py-3 pr-10 rounded-xl border text-[13px] font-medium bg-slate-50 outline-none transition-all duration-150 cursor-pointer
        focus:bg-white focus:border-[#1e2558] focus:shadow-[0_0_0_3px_rgba(30,37,88,.07)]
        ${error ? "border-red-400 bg-red-50/30 text-red-500" : "border-slate-200 text-[#1e2558]"}`}
    >
      {children}
    </select>
    <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
  </div>
);

// Tag chip
const Chip = ({ label, onRemove, color = "navy" }) => (
  <span
    className={`chip inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold border
    ${
      color === "green"
        ? "bg-[#4eb956]/10 text-[#4eb956] border-[#4eb956]/25"
        : "bg-[#1e2558]/8 text-[#1e2558] border-[#1e2558]/15"
    }`}
  >
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="hover:opacity-60 transition-opacity"
    >
      <HiX className="text-[10px]" />
    </button>
  </span>
);

// Skill input
const SkillInput = ({ skills, setSkills, placeholder }) => {
  const [val, setVal] = useState("");
  const add = () => {
    const v = val.trim();
    if (v && !skills.includes(v)) setSkills([...skills, v]);
    setVal("");
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={add}
          className="px-4 py-3 rounded-xl bg-[#1e2558] text-[#4eb956] font-bold text-sm hover:bg-[#1e2558]/90 transition-all duration-150 flex-shrink-0"
        >
          <HiPlus className="text-lg" />
        </button>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <Chip
              key={s}
              label={s}
              onRemove={() => setSkills(skills.filter((x) => x !== s))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Multi-select checkbox dropdown
const MultiSelect = ({ options, selected, onChange, placeholder, error }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const toggle = (v) =>
    onChange(
      selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v],
    );
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-[13px] font-medium bg-slate-50 text-left transition-all duration-150
          ${error ? "border-red-400" : "border-slate-200"}
          ${open ? "border-[#1e2558] bg-white shadow-[0_0_0_3px_rgba(30,37,88,.07)]" : ""}
        `}
      >
        <span className={selected.length ? "text-[#1e2558]" : "text-slate-400"}>
          {selected.length ? `${selected.length} selected` : placeholder}
        </span>
        <HiChevronDown
          className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selected.map((s) => (
            <Chip key={s} label={s} color="green" onRemove={() => toggle(s)} />
          ))}
        </div>
      )}
      {open && (
        <div className="relative z-30 mt-1.5 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
          <div className="max-h-52 overflow-y-auto p-2 space-y-0.5">
            {options.map((opt) => {
              const sel = selected.includes(opt);
              return (
                <label
                  key={opt}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-100
                  ${sel ? "bg-[#1e2558]/5" : "hover:bg-slate-50"}`}
                >
                  <span
                    className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all duration-150
                    ${sel ? "bg-[#4eb956] border-[#4eb956]" : "border-slate-300 bg-white"}`}
                    style={{ width: 18, height: 18 }}
                  >
                    {sel && <HiCheck className="text-white text-[10px]" />}
                  </span>
                  <span
                    className={`text-[13px] font-medium ${sel ? "text-[#1e2558] font-semibold" : "text-slate-600"}`}
                  >
                    {opt}
                  </span>
                  <input
                    type="checkbox"
                    checked={sel}
                    onChange={() => toggle(opt)}
                    className="sr-only"
                  />
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Section card
const Section = ({
  icon,
  title,
  subtitle,
  children,
  delay = 0,
  accent = false,
}) => (
  <div
    className="fade-up bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div
      className={`flex items-center gap-3 px-6 py-4 border-b border-slate-100 ${accent ? "bg-gradient-to-r from-[#1e2558]/5 to-transparent" : ""}`}
    >
      <div className="w-9 h-9 rounded-xl bg-[#1e2558] flex items-center justify-center flex-shrink-0">
        <span className="text-[#4eb956] text-base">{icon}</span>
      </div>
      <div>
        <h3 className="text-[14px] font-bold text-[#1e2558]">{title}</h3>
        {subtitle && (
          <p className="text-[11px] text-slate-400 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
    <div className="px-6 py-5 space-y-5">{children}</div>
  </div>
);

// Toggle switch
const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center justify-between cursor-pointer py-1">
    <span className="text-[13px] font-semibold text-[#1e2558]">{label}</span>
    <div className="relative flex-shrink-0">
      <input
        type="checkbox"
        className="sr-only toggle-check"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div
        onClick={() => onChange(!checked)}
        className="w-11 h-6 rounded-full border transition-all duration-200 cursor-pointer flex items-center px-0.5"
        style={{
          background: checked ? "#4eb956" : "#e2e8f0",
          borderColor: checked ? "#4eb956" : "#e2e8f0",
        }}
      >
        <div
          className="w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200"
          style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
        />
      </div>
    </div>
  </label>
);

/* ─────────────────────────────────────────────────────────────────────────────
   STEP INDICATOR
───────────────────────────────────────────────────────────────────────────── */
const STEPS = ["Position", "Details", "Skills", "Content", "Settings"];

const StepBar = ({ current }) => (
  <div className="flex items-center gap-0">
    {STEPS.map((s, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-extrabold transition-all duration-300
              ${done ? "bg-[#4eb956] text-white" : active ? "bg-[#1e2558] text-white" : "bg-slate-100 text-slate-400"}`}
            >
              {done ? <HiCheck className="text-sm" /> : i + 1}
            </div>
            <span
              className={`hidden sm:block text-[10px] font-bold uppercase tracking-wider transition-colors duration-200
              ${active ? "text-[#1e2558]" : done ? "text-[#4eb956]" : "text-slate-400"}`}
            >
              {s}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-1 transition-all duration-300 ${done ? "bg-[#4eb956]" : "bg-slate-200"}`}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
const JobPost = () => {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* ── form state ── */
  const [form, setForm] = useState({
    jobTitle: "",
    jobOverview: "",
    employmentType: "",
    seniorityLevel: "",
    workArrangement: "",
    contractType: "",
    yearsMin: "",
    yearsMax: "",
    email: "",
    phone: "",
    country: "Bangladesh",
    cities: [],
    startDate: "",
    endDate: "",
    salaryMin: "",
    salaryMax: "",
    degreeType: "",
    softSkills: [],
    techSkills: [],
    jobDescription: "",
    howToApply: "",
    categories: [],
    industries: [],
    enableEApply: false,
    postOnFacebook: false,
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const cities = CITIES_BY_COUNTRY[form.country] || CITIES_BY_COUNTRY.default;

  /* ── validation per step ── */
  const validate = useCallback(
    (s) => {
      const e = {};
      if (s === 0) {
        if (!form.jobTitle.trim()) e.jobTitle = "Job title is required";
        if (!form.jobOverview.trim())
          e.jobOverview = "Job overview is required";
        if (!form.employmentType) e.employmentType = "Select employment type";
        if (!form.seniorityLevel) e.seniorityLevel = "Select seniority level";
      }
      if (s === 1) {
        if (!form.email.trim()) e.email = "Email is required";
        if (!form.salaryMin) e.salaryMin = "Salary from is required";
        if (!form.salaryMax) e.salaryMax = "Salary to is required";
        if (!form.cities.length) e.cities = "Select at least one city";
      }
      if (s === 3) {
        if (!form.jobDescription.trim() || form.jobDescription === "<br>")
          e.jobDescription = "Job description is required";
        if (!form.categories.length)
          e.categories = "Select at least one category";
        if (!form.industries.length)
          e.industries = "Select at least one industry";
      }
      return e;
    },
    [form],
  );

  const goNext = () => {
    const e = validate(step);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async (asDraft = false) => {
    const e = validate(step);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1600));
    setSubmitting(false);
    setSubmitted(true);
  };

  /* ── submitted state ── */
  if (submitted) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="fade-up text-center max-w-sm">
            <div className="w-20 h-20 rounded-full bg-[#4eb956]/15 border-2 border-[#4eb956]/30 flex items-center justify-center mx-auto mb-5">
              <HiCheck className="text-[#4eb956] text-4xl" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#1e2558] mb-2">
              Job Posted!
            </h2>
            <p className="text-[14px] text-slate-500 mb-6">
              Your job post has been submitted for review. You'll receive a
              notification once it's approved.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setStep(0);
                setForm({ ...form });
              }}
              className="px-6 py-3 bg-[#1e2558] text-white font-bold rounded-xl hover:bg-[#1e2558]/90 transition-all"
            >
              Post Another Job
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ── render ── */
  return (
    <>
      <style>{STYLES}</style>
      <div className="min-h-screen bg-slate-50">
        {/* ── Top bar ── */}
        <div className="relative top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
          <div className="h-[3px] w-full bg-gradient-to-r from-[#1e2558] to-[#4eb956]" />
          <div className="max-w-4xl mx-auto px-5 h-[60px] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg border border-slate-200 text-[#1e2558] hover:bg-slate-50 transition-all">
                <HiArrowLeft className="text-lg" />
              </button>
              <div>
                <h1 className="text-[15px] font-extrabold text-[#1e2558] leading-tight">
                  Add New Job Post
                </h1>
                <p className="text-[11px] text-slate-400 font-medium leading-tight">
                  Fill in the details to create a new listing
                </p>
              </div>
            </div>
            <div className="hidden md:block text-[11px] text-slate-400 font-medium">
              Required fields marked with{" "}
              <span className="text-[#4eb956] font-extrabold text-base leading-none">
                *
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* ── Step bar ── */}
          <div className="fade-up bg-white border border-slate-200 rounded-2xl px-6 py-5 shadow-sm">
            <StepBar current={step} />
          </div>

          {/* ══════════════ STEP 0 — Position ══════════════ */}
          {step === 0 && (
            <>
              <Section
                icon={<HiBriefcase />}
                title="Job Position Details"
                subtitle="Basic information about the role"
                delay={50}
                accent
              >
                <Field label="Job Title" required error={errors.jobTitle}>
                  <Input
                    value={form.jobTitle}
                    onChange={(e) => set("jobTitle", e.target.value)}
                    placeholder="e.g. Senior React Developer"
                    error={errors.jobTitle}
                  />
                </Field>

                <Field
                  label="Job Overview"
                  required
                  error={errors.jobOverview}
                  hint="A short summary shown in search results (max 150 chars)"
                >
                  <div
                    className={`relative rounded-xl border bg-slate-50 transition-all duration-150 focus-within:border-[#1e2558] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(30,37,88,.07)] ${errors.jobOverview ? "border-red-400" : "border-slate-200"}`}
                  >
                    <textarea
                      value={form.jobOverview}
                      onChange={(e) => {
                        if (e.target.value.length <= 150)
                          set("jobOverview", e.target.value);
                      }}
                      rows={3}
                      placeholder="Brief description of the role and company…"
                      className="w-full px-4 py-3 bg-transparent text-[13px] text-[#1e2558] font-medium placeholder-slate-400 outline-none resize-none"
                    />
                    <div className="flex justify-end px-4 pb-2">
                      <span
                        className={`text-[11px] font-bold ${form.jobOverview.length >= 140 ? "text-amber-500" : "text-slate-400"}`}
                      >
                        {form.jobOverview.length}/150
                      </span>
                    </div>
                  </div>
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Employment Type"
                    required
                    error={errors.employmentType}
                  >
                    <Select
                      value={form.employmentType}
                      onChange={(e) => set("employmentType", e.target.value)}
                      error={errors.employmentType}
                    >
                      <option value="">Select employment type</option>
                      {EMPLOYMENT_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </Select>
                  </Field>

                  <Field
                    label="Seniority Level"
                    required
                    error={errors.seniorityLevel}
                  >
                    <Select
                      value={form.seniorityLevel}
                      onChange={(e) => set("seniorityLevel", e.target.value)}
                      error={errors.seniorityLevel}
                    >
                      <option value="">Select seniority level</option>
                      {SENIORITY_LEVELS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </Select>
                  </Field>

                  <Field label="Work Arrangement">
                    <Select
                      value={form.workArrangement}
                      onChange={(e) => set("workArrangement", e.target.value)}
                    >
                      <option value="">Select arrangement</option>
                      {WORK_ARRANGEMENTS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </Select>
                  </Field>

                  <Field label="Contract Type">
                    <Select
                      value={form.contractType}
                      onChange={(e) => set("contractType", e.target.value)}
                    >
                      <option value="">Select contract type</option>
                      {CONTRACT_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </Select>
                  </Field>
                </div>

                {/* Experience range */}
                <Field
                  label="Years of Experience"
                  hint="Leave blank if not required"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        value={form.yearsMin}
                        onChange={(e) => set("yearsMin", e.target.value)}
                        placeholder="Min (e.g. 2)"
                      />
                    </div>
                    <span className="text-slate-400 font-bold text-sm flex-shrink-0">
                      to
                    </span>
                    <div className="flex-1">
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        value={form.yearsMax}
                        onChange={(e) => set("yearsMax", e.target.value)}
                        placeholder="Max (e.g. 5)"
                      />
                    </div>
                    <span className="text-[12px] font-bold text-slate-500 flex-shrink-0">
                      yrs
                    </span>
                  </div>
                  {form.yearsMin && form.yearsMax && (
                    <p className="text-[11px] text-[#4eb956] font-bold mt-1">
                      ✓ {form.yearsMin}–{form.yearsMax} years of experience
                      required
                    </p>
                  )}
                </Field>
              </Section>
            </>
          )}

          {/* ══════════════ STEP 1 — Details ══════════════ */}
          {step === 1 && (
            <>
              <Section
                icon={<HiOfficeBuilding />}
                title="Contact & Location"
                delay={50}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Email Address" required error={errors.email}>
                    <div
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border bg-slate-50 transition-all duration-150 field-focus ${errors.email ? "err-field" : "border-slate-200"}`}
                    >
                      <HiMail className="text-slate-400 text-base flex-shrink-0" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="hr@company.com"
                        className="flex-1 bg-transparent text-[13px] text-[#1e2558] font-medium placeholder-slate-400 outline-none"
                      />
                    </div>
                  </Field>

                  <Field label="Phone Number">
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 transition-all duration-150 field-focus">
                      <HiPhone className="text-slate-400 text-base flex-shrink-0" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+880 1X XX XXXXXX"
                        className="flex-1 bg-transparent text-[13px] text-[#1e2558] font-medium placeholder-slate-400 outline-none"
                      />
                    </div>
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Country">
                    <Select
                      value={form.country}
                      onChange={(e) => {
                        set("country", e.target.value);
                        set("cities", []);
                      }}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </Select>
                  </Field>

                  <Field label="Cities" required error={errors.cities}>
                    <MultiSelect
                      options={cities}
                      selected={form.cities}
                      onChange={(v) => set("cities", v)}
                      placeholder="Select cities"
                      error={errors.cities}
                    />
                  </Field>
                </div>
              </Section>

              <Section
                icon={<HiCalendar />}
                title="Schedule & Salary"
                delay={100}
              >
                {/* No credits warning */}
                <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-amber-200 bg-amber-50">
                  <HiExclamation className="text-amber-500 text-lg flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-bold text-amber-700">
                      No job post credits available
                    </p>
                    <p className="text-[12px] text-amber-600 mt-0.5">
                      You can save this post as a draft and publish it after
                      purchasing credits.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Start Date">
                    <Input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => set("startDate", e.target.value)}
                    />
                  </Field>
                  <Field label="Expiry Date">
                    <Input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => set("endDate", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Monthly Salary From"
                    required
                    error={errors.salaryMin}
                  >
                    <div
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border bg-slate-50 field-focus ${errors.salaryMin ? "err-field" : "border-slate-200"}`}
                    >
                      <HiCurrencyDollar className="text-slate-400 flex-shrink-0" />
                      <input
                        type="number"
                        value={form.salaryMin}
                        onChange={(e) => set("salaryMin", e.target.value)}
                        placeholder="30,000"
                        className="flex-1 bg-transparent text-[13px] text-[#1e2558] font-medium placeholder-slate-400 outline-none"
                      />
                      <span className="text-[11px] font-bold text-slate-400">
                        BDT
                      </span>
                    </div>
                  </Field>

                  <Field
                    label="Monthly Salary To"
                    required
                    error={errors.salaryMax}
                  >
                    <div
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border bg-slate-50 field-focus ${errors.salaryMax ? "err-field" : "border-slate-200"}`}
                    >
                      <HiCurrencyDollar className="text-slate-400 flex-shrink-0" />
                      <input
                        type="number"
                        value={form.salaryMax}
                        onChange={(e) => set("salaryMax", e.target.value)}
                        placeholder="60,000"
                        className="flex-1 bg-transparent text-[13px] text-[#1e2558] font-medium placeholder-slate-400 outline-none"
                      />
                      <span className="text-[11px] font-bold text-slate-400">
                        BDT
                      </span>
                    </div>
                  </Field>
                </div>

                <Field label="Required Degree Type">
                  <Select
                    value={form.degreeType}
                    onChange={(e) => set("degreeType", e.target.value)}
                  >
                    <option value="">Select degree type</option>
                    {DEGREE_TYPES.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </Select>
                </Field>
              </Section>
            </>
          )}

          {/* ══════════════ STEP 2 — Skills ══════════════ */}
          {step === 2 && (
            <>
              <Section
                icon={<HiLightningBolt />}
                title="Soft Skills"
                subtitle="Communication, teamwork, adaptability…"
                delay={50}
              >
                <SkillInput
                  skills={form.softSkills}
                  setSkills={(v) => set("softSkills", v)}
                  placeholder="e.g. Leadership, Communication…"
                />
              </Section>

              <Section
                icon={<HiCode />}
                title="Technical Skills"
                subtitle="Tools, frameworks, languages…"
                delay={100}
              >
                <SkillInput
                  skills={form.techSkills}
                  setSkills={(v) => set("techSkills", v)}
                  placeholder="e.g. React, Python, AWS…"
                />
              </Section>
            </>
          )}

          {/* ══════════════ STEP 3 — Content ══════════════ */}
          {step === 3 && (
            <>
              <Section
                icon={<HiDocumentText />}
                title="Job Description"
                subtitle="Detailed role description with rich formatting"
                delay={50}
              >
                <Field
                  label="Description"
                  required
                  error={errors.jobDescription}
                >
                  <RichTextEditor
                    value={form.jobDescription}
                    onChange={(v) => set("jobDescription", v)}
                    placeholder="Describe responsibilities, requirements, and what makes this role exciting…"
                    error={errors.jobDescription}
                  />
                </Field>
              </Section>

              <Section
                icon={<HiClipboardList />}
                title="How to Apply"
                subtitle="Instructions for candidates — links and details"
                delay={100}
              >
                <Field label="Application Instructions">
                  <RichTextEditor
                    value={form.howToApply}
                    onChange={(v) => set("howToApply", v)}
                    placeholder="Describe how to apply — include portfolio links, application email, or form URL…"
                  />
                </Field>
              </Section>

              <Section icon={<HiTag />} title="Classification" delay={150}>
                <Field
                  label="Job Categories"
                  required
                  error={errors.categories}
                >
                  <MultiSelect
                    options={CATEGORIES}
                    selected={form.categories}
                    onChange={(v) => set("categories", v)}
                    placeholder="Choose categories"
                    error={errors.categories}
                  />
                </Field>

                <Field label="Industry" required error={errors.industries}>
                  <MultiSelect
                    options={INDUSTRIES}
                    selected={form.industries}
                    onChange={(v) => set("industries", v)}
                    placeholder="Select industries"
                    error={errors.industries}
                  />
                </Field>
              </Section>
            </>
          )}

          {/* ══════════════ STEP 4 — Settings ══════════════ */}
          {step === 4 && (
            <>
              <Section
                icon={<HiLightningBolt />}
                title="Publishing Settings"
                subtitle="Control how and where your job is posted"
                delay={50}
                accent
              >
                <div className="space-y-4 divide-y divide-slate-100">
                  <Toggle
                    checked={form.enableEApply}
                    onChange={(v) => set("enableEApply", v)}
                    label="Enable eApply (candidates apply directly on platform)"
                  />
                  <div className="pt-4">
                    <Toggle
                      checked={form.postOnFacebook}
                      onChange={(v) => set("postOnFacebook", v)}
                      label="Post on Facebook once job is approved"
                    />
                  </div>
                </div>
              </Section>

              {/* Summary card */}
              <div
                className="fade-up bg-gradient-to-br from-[#1e2558] to-[#1e2558]/90 rounded-2xl p-6 text-white"
                style={{ animationDelay: "100ms" }}
              >
                <h3 className="text-[15px] font-extrabold mb-4 flex items-center gap-2">
                  <HiClipboardList className="text-[#4eb956]" /> Review Summary
                </h3>
                <div className="grid grid-cols-2 gap-3 text-[12px]">
                  {[
                    ["Title", form.jobTitle || "—"],
                    ["Type", form.employmentType || "—"],
                    ["Seniority", form.seniorityLevel || "—"],
                    ["Arrangement", form.workArrangement || "—"],
                    [
                      "Experience",
                      form.yearsMin && form.yearsMax
                        ? `${form.yearsMin}–${form.yearsMax} yrs`
                        : "—",
                    ],
                    ["Country", form.country],
                    ["Cities", form.cities.join(", ") || "—"],
                    [
                      "Salary",
                      form.salaryMin && form.salaryMax
                        ? `${Number(form.salaryMin).toLocaleString()}–${Number(form.salaryMax).toLocaleString()} BDT`
                        : "—",
                    ],
                    [
                      "Soft Skills",
                      form.softSkills.length
                        ? form.softSkills.slice(0, 3).join(", ") +
                          (form.softSkills.length > 3 ? "…" : "")
                        : "—",
                    ],
                    [
                      "Tech Skills",
                      form.techSkills.length
                        ? form.techSkills.slice(0, 3).join(", ") +
                          (form.techSkills.length > 3 ? "…" : "")
                        : "—",
                    ],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-white/10 rounded-xl px-3 py-2.5">
                      <div className="text-[#4eb956] font-bold text-[10px] uppercase tracking-wider mb-0.5">
                        {k}
                      </div>
                      <div className="text-white font-semibold truncate">
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Navigation buttons ── */}
          <div
            className="fade-up flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 pb-8"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex gap-2">
              {step > 0 && (
                <button
                  type="button"
                  onClick={goPrev}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-[13px] font-bold text-slate-500 bg-white hover:border-[#1e2558]/30 hover:text-[#1e2558] transition-all duration-150"
                >
                  <HiArrowLeft /> Back
                </button>
              )}

              {/* Save as draft — always visible */}
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-[13px] font-bold text-slate-500 bg-white hover:bg-slate-50 transition-all duration-150"
              >
                <HiSave className="text-base" /> Save Draft
              </button>
            </div>

            <div className="flex gap-2 sm:ml-auto">
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#1e2558] text-white text-[13px] font-bold hover:bg-[#1e2558]/90 transition-all duration-150 shadow-md shadow-[#1e2558]/20"
                >
                  Continue
                  <span className="text-[#4eb956] text-lg font-extrabold leading-none">
                    →
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#4eb956] text-white text-[13px] font-bold hover:bg-[#4eb956]/90 transition-all duration-150 shadow-md shadow-[#4eb956]/25 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    <>
                      <HiPaperAirplane className="rotate-90" /> Submit Job
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobPost;
