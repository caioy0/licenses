import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check, X, ChevronDown, Search, Copy, CheckCheck,
  Menu, XIcon, ArrowRight, RefreshCw, Github, ExternalLink,
  FileText, Terminal, Plus, Minus, BarChart2,
} from "lucide-react";

type Lang = "pt" | "en";

const SECTION_IDS = ["intro", "world", "licenses", "consequences", "templates", "howto", "faq", "references"];

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const fn = () => {
      const y = window.scrollY + 90;
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, [ids]);
  return active;
}

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.08 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return v;
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref as React.RefObject<HTMLElement>);
  return (
    <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(22px)", transition: `opacity .55s ease ${delay}s, transform .55s ease ${delay}s` }}>
      {children}
    </div>
  );
}

function Expand({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.26 }} className="overflow-hidden">
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function toggleSet(set: Set<string>, key: string): Set<string> {
  const next = new Set(set);
  if (next.has(key)) next.delete(key); else next.add(key);
  return next;
}

/* ─── Tooltip ─── */
function Tip({ label, children }: { label: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span className="border-b border-dashed border-current cursor-help">{children}</span>
      <AnimatePresence>
        {show && (
          <motion.div key="tip" initial={{ opacity: 0, y: 4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.13 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none w-max max-w-[220px]">
            <div className="bg-black text-white text-[11px] font-medium leading-relaxed px-3 py-2 rounded-xl shadow-xl text-center">
              {label}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ─── Animated count-up bar for popularity ─── */
function PopBar({ d, inView }: { d: { name: string; pct: number; color: string }; inView: boolean }) {
  const [width, setWidth] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const dur = 900;
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setWidth(e * (d.pct / 50) * 100);
      setCount(parseFloat((e * d.pct).toFixed(1)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, d.pct]);
  return (
    <div className="flex items-center gap-3 group">
      <div className="w-24 flex-shrink-0 text-right">
        <span className="text-[13px] font-bold text-neutral-800 group-hover:text-black transition-colors">{d.name}</span>
      </div>
      <div className="flex-1 h-8 bg-black/[0.04] rounded-xl overflow-hidden">
        <div className="h-full rounded-xl transition-none" style={{ width: `${width}%`, background: d.color }} />
      </div>
      <div className="w-10 flex-shrink-0 text-left">
        <span className="text-[11px] font-black" style={{ color: d.color }}>{count}%</span>
      </div>
    </div>
  );
}

/* ─── GitHub Simulator ─── */
const GH_TEMPLATES = [
  { key: "mit", name: "MIT License", spdx: "MIT", preview: "MIT License\n\nCopyright (c) 2024 [your name]\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software..." },
  { key: "apache", name: "Apache License 2.0", spdx: "Apache-2.0", preview: "Apache License\nVersion 2.0, January 2004\n\nTERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION\n\n1. Definitions. \"License\" shall mean the terms and conditions for use, reproduction, and distribution as defined by Sections 1 through 9 of this document..." },
  { key: "gpl3", name: "GNU GPL v3.0", spdx: "GPL-3.0", preview: "GNU GENERAL PUBLIC LICENSE\nVersion 3, 29 June 2007\n\nCopyright (C) 2007 Free Software Foundation, Inc.\nEveryone is permitted to copy and distribute verbatim copies of this license document, but changing it is not allowed..." },
  { key: "bsd2", name: "BSD 2-Clause", spdx: "BSD-2-Clause", preview: "BSD 2-Clause License\n\nCopyright (c) 2024, [author]\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met..." },
  { key: "isc", name: "ISC License", spdx: "ISC", preview: "ISC License\n\nCopyright (c) 2024 [author]\n\nPermission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies..." },
];

function HeroEyebrow({ text }: { text: string }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0; setOut("");
    const id = setInterval(() => { setOut(text.slice(0, ++i)); if (i >= text.length) clearInterval(id); }, 45);
    return () => clearInterval(id);
  }, [text]);
  return (
    <div className="text-neutral-400 text-sm font-medium tracking-widest uppercase mb-8 min-h-[1.25rem] flex items-center justify-center gap-0">
      <span>{out}</span>
      <span className="inline-block w-px h-[1em] bg-neutral-400 ml-0.5 animate-pulse" />
    </div>
  );
}

function PopBarsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="bg-white rounded-3xl border border-black/[0.07] p-6 md:p-8">
      <div className="flex flex-col gap-3">
        {POPULARITY_DATA.map((d, i) => <PopBar key={i} d={d} inView={inView} />)}
      </div>
    </div>
  );
}

function GHSimulator({ lang }: { lang: Lang }) {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTpl, setSelectedTpl] = useState(GH_TEMPLATES[0]);
  const [commitMsg, setCommitMsg] = useState(lang === "pt" ? "Adicionar licença MIT" : "Add MIT license");
  const [hoveredFile, setHoveredFile] = useState<string | null>(null);

  useEffect(() => {
    if (step !== 1) { setTyped(""); return; }
    let i = 0;
    setTyped("");
    const id = setInterval(() => { setTyped("LICENSE".slice(0, ++i)); if (i >= 7) clearInterval(id); }, 140);
    return () => clearInterval(id);
  }, [step]);

  useEffect(() => {
    setCommitMsg(lang === "pt" ? `Adicionar licença ${selectedTpl.spdx}` : `Add ${selectedTpl.spdx} license`);
  }, [selectedTpl, lang]);

  const reset = () => { setStep(0); setTyped(""); setShowDropdown(false); setSelectedTpl(GH_TEMPLATES[0]); };

  const files = [
    { name: ".gitignore", time: lang === "pt" ? "há 2 meses" : "2 months ago", icon: "📄" },
    { name: "README.md", time: lang === "pt" ? "semana passada" : "last week", icon: "📖" },
    { name: "package.json", time: lang === "pt" ? "há 3 dias" : "3 days ago", icon: "📦" },
    { name: "src/", time: lang === "pt" ? "ontem" : "yesterday", icon: "📁" },
  ];

  const ghBg = "#0d1117"; const ghHeader = "#161b22"; const ghBorder = "#30363d";
  const ghText = "#e6edf3"; const ghMuted = "#7d8590"; const ghGreen = "#238636";
  const ghBlue = "#1f6feb"; const ghBtnBg = "#21262d";
  const s: React.CSSProperties = { fontFamily: "'Inter', -apple-system, sans-serif" };

  const stepLabels = lang === "pt"
    ? ["Repositório", "Criar arquivo", "Escolher template", "Commit"]
    : ["Repository", "Create file", "Choose template", "Commit"];

  return (
    <div style={{ ...s, background: ghBg, borderRadius: "12px", overflow: "hidden", border: `1px solid ${ghBorder}` }}>
      {/* GitHub top bar */}
      <div style={{ background: ghHeader, borderBottom: `1px solid ${ghBorder}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: "14px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill={ghText}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        <div style={{ flex: 1, background: "#2d333b", border: `1px solid ${ghBorder}`, borderRadius: "6px", padding: "4px 10px", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: ghMuted, fontSize: "12px" }}>🔍 {lang === "pt" ? "Buscar ou ir para..." : "Search or jump to..."}</span>
        </div>
        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#f78166", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: "white", fontSize: "11px", fontWeight: "bold" }}>U</span>
        </div>
      </div>

      {/* Step 0 — Repo home */}
      {step === 0 && (
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <span style={{ color: ghBlue, fontWeight: 700, fontSize: "16px", cursor: "pointer" }}>caioy0</span>
            <span style={{ color: ghMuted, fontSize: "16px" }}>/</span>
            <span style={{ color: ghText, fontWeight: 700, fontSize: "16px" }}>my-project</span>
            <span style={{ fontSize: "11px", color: ghMuted, border: `1px solid ${ghBorder}`, borderRadius: "999px", padding: "1px 8px" }}>Public</span>
          </div>
          <div style={{ display: "flex", gap: 0, marginBottom: "16px", borderBottom: `1px solid ${ghBorder}` }}>
            {["Code", "Issues 2", "Pull requests", "Actions"].map((t, i) => (
              <div key={t} style={{ padding: "8px 16px", fontSize: "13px", color: i === 0 ? ghText : ghMuted, borderBottom: i === 0 ? "2px solid #f78166" : "2px solid transparent", cursor: "pointer" }}>{t}</div>
            ))}
          </div>
          <div style={{ background: "#161b22", border: `1px solid #d29922`, borderRadius: "6px", padding: "10px 14px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px" }}>⚠️</span>
            <span style={{ color: "#d29922", fontSize: "12px", fontWeight: 600 }}>{lang === "pt" ? "Nenhum arquivo LICENSE encontrado. Adicione uma licença ao seu projeto." : "No LICENSE file found. Add a license to your project."}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ background: ghBtnBg, border: `1px solid ${ghBorder}`, borderRadius: "6px", padding: "4px 12px", fontSize: "12px", color: ghText }}>⎇ main ▾</div>
            </div>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ background: ghGreen, border: "none", borderRadius: "6px", padding: "5px 14px", fontSize: "12px", color: "white", fontWeight: 700, cursor: "pointer", animation: "ghPulse 2s ease-in-out infinite", fontFamily: "inherit" }}>
                {lang === "pt" ? "Adicionar arquivo ▾" : "Add file ▾"}
              </button>
              <AnimatePresence>
                {showDropdown && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ position: "absolute", top: "100%", right: 0, marginTop: "4px", background: "#161b22", border: `1px solid ${ghBorder}`, borderRadius: "6px", padding: "4px", zIndex: 10, minWidth: "180px" }}>
                    <div onClick={() => { setShowDropdown(false); setStep(1); }}
                      style={{ padding: "7px 12px", fontSize: "13px", color: ghText, cursor: "pointer", borderRadius: "4px", fontWeight: 600, background: "transparent" }}
                      onMouseOver={e => (e.currentTarget.style.background = "#2d333b")}
                      onMouseOut={e => (e.currentTarget.style.background = "transparent")}>
                      + {lang === "pt" ? "Criar novo arquivo" : "Create new file"}
                    </div>
                    <div style={{ padding: "7px 12px", fontSize: "13px", color: ghMuted, cursor: "pointer", borderRadius: "4px" }}>
                      {lang === "pt" ? "Fazer upload" : "Upload files"}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div style={{ border: `1px solid ${ghBorder}`, borderRadius: "6px", overflow: "hidden" }}>
            <div style={{ background: "#161b22", padding: "8px 16px", borderBottom: `1px solid ${ghBorder}`, display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#f78166", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "white", fontSize: "10px", fontWeight: "bold" }}>U</span>
              </div>
              <span style={{ color: ghText, fontSize: "12px", fontWeight: 600 }}>caioy0</span>
              <span style={{ color: ghMuted, fontSize: "12px" }}>Initial commit</span>
              <span style={{ color: ghMuted, fontSize: "12px", marginLeft: "auto" }}>{lang === "pt" ? "há 3 dias" : "3 days ago"}</span>
            </div>
            {files.map((f, i) => (
              <div key={f.name} onMouseOver={() => setHoveredFile(f.name)} onMouseOut={() => setHoveredFile(null)}
                style={{ display: "flex", alignItems: "center", padding: "8px 16px", borderBottom: i < files.length - 1 ? `1px solid ${ghBorder}` : "none", background: hoveredFile === f.name ? "#161b22" : "transparent", transition: "background 0.1s", gap: "8px" }}>
                <span style={{ fontSize: "14px" }}>{f.icon}</span>
                <span style={{ color: ghBlue, fontSize: "13px", cursor: "pointer", flex: 1 }}>{f.name}</span>
                <span style={{ color: ghMuted, fontSize: "12px" }}>{f.time}</span>
              </div>
            ))}
          </div>
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}
            style={{ textAlign: "right", marginTop: "8px", color: "#3fb950", fontSize: "12px", fontWeight: 700 }}>
            ↑ {lang === "pt" ? "Clique em 'Adicionar arquivo' para começar" : "Click 'Add file' to get started"}
          </motion.div>
        </div>
      )}

      {/* Step 1 — Create new file + typing */}
      {step === 1 && (
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px", fontSize: "13px" }}>
            <span style={{ color: ghBlue }}>caioy0</span><span style={{ color: ghMuted }}>/</span>
            <span style={{ color: ghBlue }}>my-project</span><span style={{ color: ghMuted }}>/</span>
            <div style={{ background: ghBtnBg, border: `1px solid ${ghBorder}`, borderRadius: "6px", padding: "3px 10px", display: "flex", alignItems: "center", gap: "4px", minWidth: "120px" }}>
              <span style={{ color: ghText, fontWeight: 700, fontFamily: "monospace", fontSize: "13px" }}>{typed}</span>
              <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} style={{ color: ghText, fontWeight: 100 }}>|</motion.span>
            </div>
          </div>
          <AnimatePresence>
            {typed === "LICENSE" && (
              <motion.div key="license-banner" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ background: "#1c2128", border: `1px solid ${ghBlue}`, borderRadius: "6px", padding: "10px 14px", marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px" }}>✨</span>
                  <span style={{ color: ghText, fontSize: "12px", fontWeight: 600 }}>{lang === "pt" ? "GitHub detectou que você está criando uma licença!" : "GitHub detected you're creating a license file!"}</span>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setStep(2)}
                  style={{ background: ghGreen, border: "none", borderRadius: "6px", padding: "5px 12px", fontSize: "12px", color: "white", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                  {lang === "pt" ? "Escolher template →" : "Choose a template →"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          <div style={{ background: ghBtnBg, border: `1px solid ${ghBorder}`, borderRadius: "6px", minHeight: "180px", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: ghMuted, fontSize: "13px" }}>{lang === "pt" ? "Conteúdo do arquivo aparece aqui..." : "File content appears here..."}</span>
          </div>
          {typed !== "LICENSE" && (
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.8 }}
              style={{ marginTop: "8px", color: "#3fb950", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>
              ⌨️ {lang === "pt" ? "Digitando 'LICENSE'..." : "Typing 'LICENSE'..."}
            </motion.div>
          )}
        </div>
      )}

      {/* Step 2 — Choose template */}
      {step === 2 && (
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1, padding: "16px", borderRight: `1px solid ${ghBorder}`, minWidth: 0 }}>
            <div style={{ color: ghMuted, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>LICENSE</div>
            <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#a5d6ff", lineHeight: 1.7, whiteSpace: "pre-wrap", overflowY: "auto", maxHeight: "260px", wordBreak: "break-word" }}>
              {selectedTpl.preview}
            </div>
          </div>
          <div style={{ width: "210px", background: "#161b22", padding: "12px", flexShrink: 0 }}>
            <div style={{ color: ghText, fontSize: "13px", fontWeight: 700, marginBottom: "10px" }}>{lang === "pt" ? "Escolher template" : "Choose a template"}</div>
            {GH_TEMPLATES.map((t) => (
              <motion.div key={t.key} whileHover={{ x: 2 }} onClick={() => setSelectedTpl(t)}
                style={{ padding: "8px 10px", borderRadius: "6px", cursor: "pointer", marginBottom: "2px", background: selectedTpl?.key === t.key ? "#2d333b" : "transparent", border: `1px solid ${selectedTpl?.key === t.key ? ghBorder : "transparent"}` }}>
                <div style={{ color: selectedTpl?.key === t.key ? "#3fb950" : ghText, fontSize: "12px", fontWeight: 600 }}>{t.name}</div>
                <div style={{ color: ghMuted, fontSize: "11px", fontFamily: "monospace" }}>{t.spdx}</div>
              </motion.div>
            ))}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setStep(3)}
              style={{ marginTop: "10px", width: "100%", background: ghGreen, border: "none", borderRadius: "6px", padding: "7px", fontSize: "12px", color: "white", fontWeight: 700, cursor: "pointer" }}>
              {lang === "pt" ? "Usar este template ✓" : "Use this template ✓"}
            </motion.button>
          </div>
        </div>
      )}

      {/* Step 3 — Commit */}
      {step === 3 && (
        <div style={{ padding: "20px" }}>
          <div style={{ color: ghText, fontSize: "13px", fontWeight: 700, marginBottom: "10px" }}>LICENSE <span style={{ color: "#3fb950", fontWeight: 400, fontSize: "12px" }}>· {selectedTpl.spdx}</span></div>
          <div style={{ background: ghBtnBg, border: `1px solid ${ghBorder}`, borderRadius: "6px", padding: "12px", fontFamily: "monospace", fontSize: "11px", color: "#a5d6ff", lineHeight: 1.7, height: "90px", overflow: "hidden", marginBottom: "16px" }}>
            {selectedTpl.preview}
          </div>
          <div style={{ border: `1px solid ${ghBorder}`, borderRadius: "6px", padding: "16px", background: "#161b22" }}>
            <div style={{ color: ghText, fontSize: "13px", fontWeight: 700, marginBottom: "12px" }}>{lang === "pt" ? "Fazer commit das mudanças" : "Commit changes"}</div>
            <input value={commitMsg} onChange={e => setCommitMsg(e.target.value)}
              style={{ width: "100%", background: ghBg, border: `1px solid ${ghBorder}`, borderRadius: "6px", padding: "6px 10px", fontSize: "13px", color: ghText, marginBottom: "10px", boxSizing: "border-box", outline: "none", fontFamily: "inherit" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", border: `2px solid ${ghGreen}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: ghGreen }} />
              </div>
              <span style={{ fontSize: "12px", color: ghMuted }}>{lang === "pt" ? "Fazer commit direto na branch" : "Commit directly to the"} <strong style={{ color: ghText }}>main</strong></span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setStep(4)}
                style={{ background: ghGreen, border: "none", borderRadius: "6px", padding: "7px 16px", fontSize: "13px", color: "white", fontWeight: 700, cursor: "pointer" }}>
                {lang === "pt" ? "Fazer commit das mudanças" : "Commit changes"}
              </motion.button>
              <button onClick={() => setStep(2)}
                style={{ background: "transparent", border: `1px solid ${ghBorder}`, borderRadius: "6px", padding: "7px 16px", fontSize: "13px", color: ghText, cursor: "pointer", fontFamily: "inherit" }}>
                {lang === "pt" ? "Cancelar" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4 — Success */}
      {step === 4 && (
        <div style={{ padding: "20px" }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 250, damping: 22 }}
            style={{ background: "#1c2128", border: `1px solid #3fb950`, borderRadius: "8px", padding: "14px", marginBottom: "16px", display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#238636", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <div style={{ color: "#3fb950", fontSize: "14px", fontWeight: 700 }}>{lang === "pt" ? "Licença adicionada com sucesso! 🎉" : "License added successfully! 🎉"}</div>
              <div style={{ color: ghMuted, fontSize: "12px", marginTop: "2px" }}>{commitMsg} · {lang === "pt" ? "agora · branch main" : "just now · main branch"}</div>
            </div>
          </motion.div>
          <div style={{ border: `1px solid ${ghBorder}`, borderRadius: "6px", overflow: "hidden" }}>
            <motion.div initial={{ background: "#1c4b2f" }} animate={{ background: ["#1c4b2f", "#1c4b2f", ghBg] }} transition={{ duration: 2.5, delay: 0.3 }}
              style={{ display: "flex", alignItems: "center", padding: "8px 16px", borderBottom: `1px solid ${ghBorder}`, gap: "8px" }}>
              <span style={{ fontSize: "14px" }}>📄</span>
              <span style={{ color: ghBlue, fontSize: "13px", flex: 1, fontWeight: 700 }}>LICENSE</span>
              <span style={{ color: "#3fb950", fontSize: "12px", fontWeight: 600 }}>{lang === "pt" ? "agora" : "just now"}</span>
            </motion.div>
            {files.map((f, i) => (
              <div key={f.name} style={{ display: "flex", alignItems: "center", padding: "8px 16px", borderBottom: i < files.length - 1 ? `1px solid ${ghBorder}` : "none", gap: "8px" }}>
                <span style={{ fontSize: "14px" }}>{f.icon}</span>
                <span style={{ color: ghBlue, fontSize: "13px", flex: 1 }}>{f.name}</span>
                <span style={{ color: ghMuted, fontSize: "12px" }}>{f.time}</span>
              </div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", borderRadius: "4px", overflow: "hidden", fontSize: "11px", fontWeight: 700 }}>
              <div style={{ background: "#555", color: "white", padding: "2px 8px" }}>license</div>
              <div style={{ background: "#3fb950", color: "white", padding: "2px 8px" }}>{selectedTpl.spdx}</div>
            </div>
            <span style={{ color: ghMuted, fontSize: "12px" }}>{lang === "pt" ? "Badge gerado automaticamente no GitHub" : "Badge generated automatically on GitHub"}</span>
          </motion.div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={reset}
            style={{ marginTop: "12px", background: ghBtnBg, border: `1px solid ${ghBorder}`, borderRadius: "6px", padding: "6px 14px", fontSize: "12px", color: ghText, cursor: "pointer", fontFamily: "inherit" }}>
            ↺ {lang === "pt" ? "Reiniciar simulação" : "Restart simulation"}
          </motion.button>
        </div>
      )}

      {/* Progress bar */}
      {step < 4 && (
        <div style={{ padding: "10px 20px", borderTop: `1px solid ${ghBorder}`, display: "flex", alignItems: "center", gap: "6px" }}>
          {stepLabels.map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: i <= step ? ghGreen : ghBtnBg, border: `2px solid ${i <= step ? ghGreen : ghBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s" }}>
                {i < step
                  ? <Check style={{ width: "11px", height: "11px", color: "white" }} />
                  : <span style={{ color: i === step ? "white" : ghMuted, fontSize: "10px", fontWeight: 700 }}>{i + 1}</span>}
              </div>
              <span style={{ fontSize: "10px", color: i <= step ? ghText : ghMuted, display: step === i ? "block" : "none" }}>{label}</span>
              {i < stepLabels.length - 1 && <div style={{ flex: 1, height: "2px", background: i < step ? ghGreen : ghBorder, transition: "background 0.3s", borderRadius: "1px" }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── License characteristics for modal ─── */
const LICENSE_CHARS: Record<string, {
  pros_pt: string[]; cons_pt: string[];
  pros_en: string[]; cons_en: string[];
}> = {
  "mit": {
    pros_pt: ["Extremamente simples (171 palavras)", "Compatível com quase todas as licenças", "Aceita por empresas sem restrições", "Permite uso em software proprietário"],
    cons_pt: ["Sem proteção contra patentes", "Sem proteção de marca registrada", "Não garante que derivados permaneçam abertos"],
    pros_en: ["Extremely simple (171 words)", "Compatible with almost all licenses", "Accepted by companies without restrictions", "Allows use in proprietary software"],
    cons_en: ["No patent protection", "No trademark protection", "Doesn't ensure derivatives stay open"],
  },
  "apache-2.0": {
    pros_pt: ["Proteção expressa de patentes", "Exige documentação de mudanças", "Permite uso comercial e proprietário", "Bem aceita em ambientes corporativos"],
    cons_pt: ["Mais longa e complexa que a MIT", "Incompatível com GPL v2 em alguns casos", "Exige aviso de modificações nos arquivos"],
    pros_en: ["Explicit patent protection", "Requires documentation of changes", "Allows commercial and proprietary use", "Well accepted in corporate environments"],
    cons_en: ["Longer and more complex than MIT", "Incompatible with GPL v2 in some cases", "Requires modification notices in files"],
  },
  "gpl-2.0": {
    pros_pt: ["Garante que derivados permaneçam abertos", "Protege contra fechamento do código", "Muito usada (Linux Kernel)"],
    cons_pt: ["Efeito viral pode ser problemático", "Não compatível com Apache 2.0", "Sem proteção contra tivoização"],
    pros_en: ["Ensures derivatives stay open", "Protects against code closure", "Widely used (Linux Kernel)"],
    cons_en: ["Viral effect can be problematic", "Not compatible with Apache 2.0", "No protection against tivoization"],
  },
  "gpl-3.0": {
    pros_pt: ["Proíbe tivoização (hardware lockdown)", "Proteção de patentes incluída", "Garante liberdades do usuário final"],
    cons_pt: ["Incompatível com GPL v2 em alguns casos", "Efeito viral obrigatório em derivados", "Não aceita por algumas empresas"],
    pros_en: ["Prohibits tivoization (hardware lockdown)", "Patent protection included", "Ensures end-user freedoms"],
    cons_en: ["Incompatible with GPL v2 in some cases", "Mandatory viral effect on derivatives", "Not accepted by some companies"],
  },
  "lgpl-2.1": {
    pros_pt: ["Permite linkagem em software proprietário", "Copyleft mais fraco que GPL", "Boa para bibliotecas"],
    cons_pt: ["Mais complexa que MIT/Apache", "Exige que usuários possam modificar a biblioteca", "Requer código-fonte disponível"],
    pros_en: ["Allows linking in proprietary software", "Weaker copyleft than GPL", "Good for libraries"],
    cons_en: ["More complex than MIT/Apache", "Requires users to be able to modify the library", "Requires source code availability"],
  },
  "bsd-2-clause": {
    pros_pt: ["Simples como a MIT", "Sem cláusula de publicidade", "Amplamente compatível"],
    cons_pt: ["Sem proteção de patentes", "Menos conhecida que MIT", "Não garante abertura de derivados"],
    pros_en: ["Simple like MIT", "No advertising clause", "Widely compatible"],
    cons_en: ["No patent protection", "Less known than MIT", "Doesn't ensure derivatives stay open"],
  },
  "bsd-3-clause": {
    pros_pt: ["Impede uso do nome do projeto para endosso", "Simples e permissiva", "Amplamente compatível"],
    cons_pt: ["Sem proteção de patentes", "A cláusula extra pode ser restritiva", "Não garante abertura de derivados"],
    pros_en: ["Prevents using project name for endorsement", "Simple and permissive", "Widely compatible"],
    cons_en: ["No patent protection", "Extra clause can be restrictive", "Doesn't ensure derivatives stay open"],
  },
  "mpl-2.0": {
    pros_pt: ["Copyleft fraco por arquivo", "Compatível com GPL e Apache 2.0", "Bom equilíbrio entre abertura e uso comercial"],
    cons_pt: ["Mais complexa que MIT", "Copyleft pode surpreender devs", "Menos conhecida que MIT/Apache/GPL"],
    pros_en: ["Weak file-level copyleft", "Compatible with GPL and Apache 2.0", "Good balance between openness and commercial use"],
    cons_en: ["More complex than MIT", "Copyleft can surprise devs", "Less known than MIT/Apache/GPL"],
  },
  "agpl-3.0": {
    pros_pt: ["Cobre uso via rede/SaaS (copyleft de rede)", "Garante abertura mesmo em serviços web", "Proteção máxima para software livre"],
    cons_pt: ["Muito restritiva para uso comercial", "Incompatível com muitas outras licenças", "Pode afastar colaboradores"],
    pros_en: ["Covers network/SaaS use (network copyleft)", "Ensures openness even in web services", "Maximum protection for free software"],
    cons_en: ["Very restrictive for commercial use", "Incompatible with many other licenses", "Can drive away collaborators"],
  },
  "unlicense": {
    pros_pt: ["Domínio público — sem restrições", "Mais simples que qualquer outra", "Ninguém precisa dar crédito"],
    cons_pt: ["Irrevogável — não pode desfazer", "Sem proteção de patentes", "Pode gerar problemas em algumas jurisdições"],
    pros_en: ["Public domain — no restrictions", "Simpler than anything else", "No one needs to give credit"],
    cons_en: ["Irrevocable — can't undo", "No patent protection", "Can cause issues in some jurisdictions"],
  },
};

/* ─── Popularity data ─── */
const POPULARITY_DATA = [
  { name: "MIT", pct: 44.7, color: "#22c55e" },
  { name: "Apache 2.0", pct: 25.1, color: "#3b82f6" },
  { name: "GPL v2", pct: 6.8, color: "#a855f7" },
  { name: "GPL v3", pct: 5.9, color: "#f97316" },
  { name: "BSD 2-Clause", pct: 5.3, color: "#06b6d4" },
  { name: "ISC", pct: 4.1, color: "#eab308" },
  { name: "LGPL", pct: 2.4, color: "#ec4899" },
  { name: "Outros", pct: 5.7, color: "#737373" },
];

/* ─── UI strings ─── */
const UI = {
  pt: {
    nav: ["Intro", "No mundo", "Licenças", "Consequências", "Templates", "Como usar", "FAQ", "Referências"],
    heroEyebrow: "Para quem nunca viu",
    heroTitle: "O que é uma\nlicença de software?",
    heroSub: "Uma regra que diz o que as pessoas podem fazer com o seu código.",
    heroScroll: "Descobrir",
    heroCards: [
      { id: "recipe", icon: "📖", label: "Sua receita", sub: "= seu código", detail: "Assim como uma receita de cozinha, seu código é sua criação intelectual. A lei o protege automaticamente — você decide quem pode copiá-lo, modificá-lo ou vendê-lo.", points: ["Criado por você → protegido automaticamente", "Você controla o que os outros podem fazer", "Sem licença, ninguém pode usar legalmente"] },
      { id: "rules", icon: "📋", label: "As regras", sub: "= a licença", detail: "A licença é o conjunto de regras que acompanha sua receita. 'Pode usar, mas dê crédito.' 'Pode modificar, mas compartilhe.' É o seu contrato com o mundo.", points: ["Define o que é permitido e proibido", "Pode ser longa ou ter só 171 palavras (MIT)", "Escolhida por você, de uma vez, para sempre"] },
      { id: "chefs", icon: "👨‍🍳", label: "Outros chefs", sub: "= os usuários", detail: "São devs, empresas e pesquisadores que querem usar seu código. Sem uma licença clara, eles ficam perdidos — e empresas simplesmente não usam código sem licença.", points: ["Podem ser contribuidores ou usuários finais", "Empresas exigem licença antes de usar qualquer código", "Com licença clara, a colaboração acontece naturalmente"] },
    ],
    introBadge: "Fundamentos",
    introHeading: "Tudo que você precisa saber",
    introSub: "Antes de escolher uma licença, entenda o contexto.",
    pillars: [
      { id: "what", icon: "📜", color: "bg-purple-50 border-purple-100", q: "O que é?", a: "Um contrato legal entre você e quem usa seu código.", extra: "Quando você cria software, a lei de direito autoral (copyright) protege sua obra automaticamente — sem precisar registrar nada. Uma licença é o documento que você usa para informar ao mundo o que as pessoas podem ou não podem fazer com esse código.", points: ["Protege sua obra automaticamente", "Define usos permitidos e proibidos", "Pode ser mais ou menos restritiva", "É exigida por lei em projetos colaborativos"] },
      { id: "why", icon: "🛡️", color: "bg-blue-50 border-blue-100", q: "Por que usar?", a: "Sem licença, seu código fica em uma zona cinzenta jurídica.", extra: "Sem uma licença explícita, o copyright padrão se aplica: ninguém tem permissão de usar, copiar, modificar ou distribuir seu código — nem mesmo para contribuir. Isso afasta colaboradores e pode criar problemas legais inesperados.", points: ["Sem licença = ninguém pode usar legalmente", "Evita mal-entendidos e conflitos", "Atrai contribuidores com segurança", "Empresas exigem licença para usar código externo"] },
      { id: "ctx", icon: "🌍", color: "bg-green-50 border-green-100", q: "Quem precisa?", a: "Todo dev que publica código — sem exceção.", extra: "Não importa se é um script pequeno no GitHub, uma biblioteca usada por milhares ou um produto comercial. Se você publicou código, você precisa de uma licença. E se você usa código de terceiros, precisa verificar a licença deles.", points: ["Devs publicando qualquer projeto", "Empresas usando bibliotecas open source", "Acadêmicos compartilhando pesquisa", "Startups construindo sobre OSS"] },
    ],
    reasons: [
      { id: "protect", icon: "🔒", title: "Protege você", desc: "Limita sua responsabilidade legal por bugs e danos.", extra: "A maioria das licenças inclui uma cláusula de isenção de garantia. Isso significa que, se o seu software causar danos, você não pode ser responsabilizado — desde que a licença esteja clara." },
      { id: "collab", icon: "🤝", title: "Permite colaboração", desc: "Deixa claro o que outros podem fazer.", extra: "Projetos sem licença não recebem contribuições de empresas e profissionais sérios. A licença é o contrato social que permite a colaboração segura e em escala." },
      { id: "law", icon: "⚖️", title: "É lei", desc: "Copyright existe automaticamente — a licença é como você o exerce.", extra: "Pela Convenção de Berna (assinada por 179 países), sua obra é protegida assim que criada. A licença é o instrumento legal pelo qual você decide como esse direito funciona na prática." },
    ],
    who: [
      { id: "devs", icon: "👩‍💻", label: "Desenvolvedores", sub: "publicando código", detail: "Você precisa de uma licença em todo projeto publicado — mesmo que seja pequeno. Sem licença, ninguém pode contribuir legalmente com seu repositório.", tip: "A MIT é a escolha mais comum entre devs independentes." },
      { id: "companies", icon: "🏢", label: "Empresas", sub: "usando open source", detail: "Departamentos jurídicos não aprovam uso de código sem licença. Projetos MIT e Apache 2.0 são os mais aceitos por oferecerem clareza legal.", tip: "Empresas como Google e Meta auditam licenças de cada dependência." },
      { id: "academics", icon: "🎓", label: "Acadêmicos", sub: "compartilhando pesquisa", detail: "Pesquisas precisam ser replicáveis. Licenças abertas como MIT permitem que outros pesquisadores usem e citem seu código, aumentando o impacto da pesquisa.", tip: "MIT e Apache são preferidas em publicações científicas." },
      { id: "startups", icon: "🚀", label: "Startups", sub: "construindo produtos", detail: "Startups constroem sobre open source. É essencial verificar as licenças de cada dependência para evitar surpresas jurídicas — especialmente com código GPL.", tip: "Cuidado com dependências GPL em produtos comerciais fechados." },
    ],
    licTitle: "As 3 principais licenças",
    licSub: "Selecione uma licença para explorar em detalhe",
    requireLabel: "O que exige?",
    permLabel: "Pode fazer",
    noPermLabel: "Não pode fazer",
    usedBy: "Projetos reais",
    exampleRepo: "Ver repositório",
    exampleLicense: "Ver licença",
    compTitle: "Comparação rápida",
    consTitle: "E se eu quebrar?",
    consSub: "Clique para ver casos reais — você pode abrir mais de um",
    consCase: "Caso real",
    consOutcome: "Resultado",
    tmplTitle: "Templates reais do GitHub",
    tmplSub: "Dados ao vivo da API do GitHub — clique para ver o texto completo",
    tmplSearch: "Buscar licença…",
    tmplLoading: "Carregando…",
    tmplCopy: "Copiar texto",
    tmplCopied: "Copiado!",
    tmplChars: "Características",
    tmplCharsTitle: "Vantagens e desvantagens",
    tmplPros: "Vantagens",
    tmplCons: "Desvantagens",
    tmplNoChars: "Características detalhadas não disponíveis para esta licença.",
    popTitle: "Popularidade das licenças",
    popSub: "% de repositórios públicos no GitHub · Fonte: GitHub Open Source Survey",
    popYLabel: "% dos repositórios",
    howTitle: "Como adicionar uma licença",
    howSub: "Siga os passos — é mais simples do que parece",
    howSteps: [
      { n: "01", icon: "🎯", title: "Escolha a licença", desc: "Use o site choosealicense.com para descobrir qual é a certa para você.", tip: "Para a maioria dos projetos pessoais, a MIT é a escolha mais simples.", action: "Abrir choosealicense.com →", actionUrl: "https://choosealicense.com/", visual: { type: "browser" as const, url: "choosealicense.com", content: ["🟢 MIT — Quero algo simples e permissivo", "🔵 Apache 2.0 — Quero proteção contra patentes", "🟠 GPLv3 — Quero que o código fique sempre aberto"] } },
      { n: "02", icon: "📄", title: "Crie o arquivo LICENSE", desc: "No seu repositório do GitHub, clique em 'Add file' → 'Create new file'. Digite o nome LICENSE.", tip: "O arquivo LICENSE fica na raiz do projeto — no mesmo nível do README.md e package.json. O GitHub vai sugerir templates automaticamente quando o nome for 'LICENSE'.", visual: { type: "filetree" as const, tree: ["seu-projeto/", "├── LICENSE          ← aqui!", "├── README.md", "├── package.json", "└── src/", "    ├── index.js", "    └── components/"], steps: ["Vá para a página do seu repositório", "Clique em 'Add file' → 'Create new file'", "Digite 'LICENSE' no campo do nome", "Clique em 'Choose a license template' (aparece automaticamente)", "Selecione a licença desejada e clique em 'Review and submit'"] } },
      { n: "03", icon: "📖", title: "Mencione no README", desc: "Adicione um badge no início do seu README.md para deixar claro a licença do projeto.", tip: "Badges são gerados pelo shields.io e aparecem como imagens no GitHub.", code: "[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)", visual: { type: "badge" as const, preview: "MIT" } },
      { n: "04", icon: "✅", title: "Pronto!", desc: "Seu projeto agora está protegido. Contribuidores e usuários sabem exatamente o que podem fazer.", tip: "Opcionalmente, adicione um comentário SPDX no topo dos arquivos de código:", code: "// SPDX-License-Identifier: MIT", visual: { type: "done" as const, items: ["LICENSE file criado ✓", "README.md atualizado ✓", "Proteção legal ativa ✓", "Contribuidores bem-vindos ✓"] } },
    ],
    refTitle: "Referências oficiais",
    refSub: "Fontes primárias — leitura recomendada antes de tomar decisões",
    refs: [
      { title: "MIT License", org: "Open Source Initiative", desc: "Texto legal completo e explicação oficial da licença MIT.", url: "https://opensource.org/license/mit", tag: "MIT", tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      { title: "Apache License 2.0", org: "Apache Software Foundation", desc: "Documentação completa incluindo termos de patentes.", url: "https://www.apache.org/licenses/LICENSE-2.0", tag: "Apache 2.0", tagColor: "bg-blue-50 text-blue-700 border-blue-200" },
      { title: "GNU GPL v3", org: "Free Software Foundation", desc: "Texto da GPLv3 com explicações sobre copyleft e liberdades.", url: "https://www.gnu.org/licenses/gpl-3.0.html", tag: "GPLv3", tagColor: "bg-orange-50 text-orange-700 border-orange-200" },
      { title: "Creative Commons e Software", org: "Creative Commons FAQ", desc: "Por que as licenças CC não são recomendadas para código.", url: "https://creativecommons.org/faq/#can-i-apply-a-creative-commons-license-to-software", tag: "CC FAQ", tagColor: "bg-purple-50 text-purple-700 border-purple-200" },
    ],
    faqTitle: "Dúvidas frequentes",
    faqItems: [
      { q: "Código sem licença = livre para usar?", a: "Não. Sem licença, você retém todos os direitos por lei automaticamente (Convenção de Berna). Ninguém pode usar, modificar ou distribuir sem sua permissão explícita — mesmo que o código esteja público no GitHub." },
      { q: "Posso usar código MIT em app pago?", a: "Sim. A MIT permite uso comercial pleno. Você só precisa incluir o aviso de copyright original em algum lugar do seu produto (geralmente na seção de 'sobre' ou nos créditos)." },
      { q: "Creative Commons serve para código?", a: "Não é recomendado. Falta termos essenciais sobre compilação, código-fonte e patentes. Use MIT (equivale a CC-BY) ou GPL (equivale a CC-BY-SA)." },
      { q: "Posso mudar a licença do projeto depois?", a: "Só se você for o único autor. Com contribuidores externos, precisa da permissão de todos — por isso escolha bem desde o início." },
      { q: "O que é o efeito viral da GPL?", a: "Se você distribuir software que usa código GPL, seu código também se torna GPL. Isso garante que o software permaneça sempre aberto e livre." },
      { q: "MIT vs Apache 2.0 — qual a diferença real?", a: "A Apache 2.0 adiciona proteção expressa de patentes: se alguém usar o software e processar usuários por patentes, perde o direito de usar o código. A MIT não tem esse mecanismo." },
      { q: "O que é tivoização, proibida pela GPLv3?", a: "É usar software GPL em hardware bloqueado que impede o usuário de instalar versões modificadas — como o TiVo fazia com o Linux. A GPLv3 proíbe explicitamente isso." },
      { q: "Posso ter partes do projeto com licenças diferentes?", a: "Sim, com cuidado. É comum ter código principal em GPL e plugins em MIT. Mas certifique-se de que as licenças sejam compatíveis — GPL e Apache 2.0 têm incompatibilidades conhecidas em certos usos." },
      { q: "O que é domínio público (Unlicense / CC0)?", a: "Você abre mão de todos os direitos autorais mundiais. O código pode ser usado por qualquer pessoa, de qualquer forma, sem precisar nem citar seu nome. É irreversível." },
      { q: "Qual licença o GitHub recomenda para projetos novos?", a: "O GitHub recomenda a MIT para a maioria dos projetos por ser simples, amplamente compreendida e compatível com quase todas as outras licenças." },
    ],
    footerNote: "Conteúdo educacional · Não é aconselhamento jurídico",
    footerGithub: "Ver no GitHub",
  },
  en: {
    nav: ["Intro", "In the wild", "Licenses", "Consequences", "Templates", "How to use", "FAQ", "References"],
    heroEyebrow: "For those who've never seen one",
    heroTitle: "What is a\nsoftware license?",
    heroSub: "A rule that tells people what they can do with your code.",
    heroScroll: "Discover",
    heroCards: [
      { id: "recipe", icon: "📖", label: "Your recipe", sub: "= your code", detail: "Just like a cooking recipe, your code is your intellectual creation. The law protects it automatically — you decide who can copy it, modify it, or sell it.", points: ["Created by you → protected automatically", "You control what others can do", "Without a license, nobody can use it legally"] },
      { id: "rules", icon: "📋", label: "The rules", sub: "= the license", detail: "The license is the set of rules that comes with your recipe. 'You can use it, but give credit.' 'You can modify it, but share it.' It's your contract with the world.", points: ["Defines what is allowed and prohibited", "Can be long or just 171 words (MIT)", "Chosen by you, once, forever"] },
      { id: "chefs", icon: "👨‍🍳", label: "Other chefs", sub: "= the users", detail: "They are devs, companies, and researchers who want to use your code. Without a clear license, they're lost — and companies simply won't use unlicensed code.", points: ["Can be contributors or end users", "Companies require a license before using any code", "With a clear license, collaboration happens naturally"] },
    ],
    introBadge: "Fundamentals",
    introHeading: "Everything you need to know",
    introSub: "Before choosing a license, understand the context.",
    pillars: [
      { id: "what", icon: "📜", color: "bg-purple-50 border-purple-100", q: "What is it?", a: "A legal agreement between you and anyone who uses your code.", extra: "When you create software, copyright law protects your work automatically — no registration needed. A license is the document you use to tell the world what people can or cannot do with that code.", points: ["Protects your work automatically", "Defines allowed and prohibited uses", "Can be more or less restrictive", "Required by law in collaborative projects"] },
      { id: "why", icon: "🛡️", color: "bg-blue-50 border-blue-100", q: "Why use one?", a: "Without a license, your code lives in a legal grey zone.", extra: "Without an explicit license, default copyright applies: no one has permission to use, copy, modify, or distribute your code — not even to contribute. This drives away collaborators and can create unexpected legal problems.", points: ["No license = no one can use it legally", "Avoids misunderstandings and conflicts", "Attracts contributors safely", "Companies require licenses to use external code"] },
      { id: "ctx", icon: "🌍", color: "bg-green-50 border-green-100", q: "Who needs it?", a: "Every dev who publishes code — no exceptions.", extra: "It doesn't matter if it's a small script on GitHub, a library used by thousands, or a commercial product. If you published code, you need a license. And if you use third-party code, you need to check their license.", points: ["Devs publishing any project", "Companies using open source libraries", "Academics sharing research", "Startups building on OSS"] },
    ],
    reasons: [
      { id: "protect", icon: "🔒", title: "Protects you", desc: "Limits your legal liability for bugs and damages.", extra: "Most licenses include a warranty disclaimer clause. This means that if your software causes harm, you cannot be held liable — as long as the license is clear." },
      { id: "collab", icon: "🤝", title: "Enables collaboration", desc: "Makes clear what others can do.", extra: "Projects without a license don't receive contributions from companies and serious professionals. The license is the social contract that enables safe, scalable collaboration." },
      { id: "law", icon: "⚖️", title: "It's the law", desc: "Copyright exists automatically — the license is how you exercise it.", extra: "Under the Berne Convention (signed by 179 countries), your work is protected the moment it's created. The license is the legal instrument through which you decide how that right works in practice." },
    ],
    who: [
      { id: "devs", icon: "👩‍💻", label: "Developers", sub: "publishing code", detail: "You need a license on every published project — even small ones. Without a license, no one can legally contribute to your repository.", tip: "MIT is the most common choice among independent devs." },
      { id: "companies", icon: "🏢", label: "Companies", sub: "using open source", detail: "Legal departments won't approve use of unlicensed code. MIT and Apache 2.0 projects are the most accepted by companies for their legal clarity.", tip: "Companies like Google and Meta audit licenses of every dependency." },
      { id: "academics", icon: "🎓", label: "Academics", sub: "sharing research", detail: "Research needs to be replicable. Open licenses like MIT allow other researchers to use and cite your code, increasing the impact of your research.", tip: "MIT and Apache are preferred in scientific publications." },
      { id: "startups", icon: "🚀", label: "Startups", sub: "building products", detail: "Startups build on open source. It's essential to check the licenses of every dependency to avoid legal surprises — especially with GPL code.", tip: "Watch out for GPL dependencies in closed commercial products." },
    ],
    licTitle: "The 3 main licenses",
    licSub: "Select a license to explore in detail",
    requireLabel: "What does it require?",
    permLabel: "Allowed",
    noPermLabel: "Not allowed",
    usedBy: "Real projects",
    exampleRepo: "View repo",
    exampleLicense: "View license",
    compTitle: "Quick comparison",
    consTitle: "What if I break it?",
    consSub: "Click to see real-world cases — you can open more than one",
    consCase: "Real case",
    consOutcome: "Outcome",
    tmplTitle: "Real GitHub templates",
    tmplSub: "Live data from GitHub API — click to see the full text",
    tmplSearch: "Search license…",
    tmplLoading: "Loading…",
    tmplCopy: "Copy text",
    tmplCopied: "Copied!",
    tmplChars: "Characteristics",
    tmplCharsTitle: "Advantages and disadvantages",
    tmplPros: "Advantages",
    tmplCons: "Disadvantages",
    tmplNoChars: "Detailed characteristics not available for this license.",
    popTitle: "License popularity",
    popSub: "% of public repositories on GitHub · Source: GitHub Open Source Survey",
    popYLabel: "% of repos",
    howTitle: "How to add a license",
    howSub: "Follow the steps — it's simpler than it looks",
    howSteps: [
      { n: "01", icon: "🎯", title: "Choose a license", desc: "Use choosealicense.com to find the right one for your case.", tip: "For most personal projects, MIT is the simplest choice.", action: "Open choosealicense.com →", actionUrl: "https://choosealicense.com/", visual: { type: "browser" as const, url: "choosealicense.com", content: ["🟢 MIT — I want something simple and permissive", "🔵 Apache 2.0 — I want patent protection", "🟠 GPLv3 — I want the code to always stay open"] } },
      { n: "02", icon: "📄", title: "Create the LICENSE file", desc: "In your GitHub repository, click 'Add file' → 'Create new file'. Type LICENSE as the name.", tip: "The LICENSE file lives at the root of the project — same level as README.md and package.json. GitHub will automatically suggest templates when you name the file 'LICENSE'.", visual: { type: "filetree" as const, tree: ["your-project/", "├── LICENSE          ← here!", "├── README.md", "├── package.json", "└── src/", "    ├── index.js", "    └── components/"], steps: ["Go to your repository page", "Click 'Add file' → 'Create new file'", "Type 'LICENSE' in the filename field", "Click 'Choose a license template' (appears automatically)", "Select your license and click 'Review and submit'"] } },
      { n: "03", icon: "📖", title: "Mention it in the README", desc: "Add a badge at the top of your README.md to make the license clear.", tip: "Badges are generated by shields.io and appear as images on GitHub.", code: "[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)", visual: { type: "badge" as const, preview: "MIT" } },
      { n: "04", icon: "✅", title: "Done!", desc: "Your project is now protected. Contributors and users know exactly what they can do.", tip: "Optionally, add an SPDX comment at the top of your source files:", code: "// SPDX-License-Identifier: MIT", visual: { type: "done" as const, items: ["LICENSE file created ✓", "README.md updated ✓", "Legal protection active ✓", "Contributors welcome ✓"] } },
    ],
    refTitle: "Official references",
    refSub: "Primary sources — recommended reading before making decisions",
    refs: [
      { title: "MIT License", org: "Open Source Initiative", desc: "Full legal text and official explanation of the MIT license.", url: "https://opensource.org/license/mit", tag: "MIT", tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      { title: "Apache License 2.0", org: "Apache Software Foundation", desc: "Full documentation including patent terms.", url: "https://www.apache.org/licenses/LICENSE-2.0", tag: "Apache 2.0", tagColor: "bg-blue-50 text-blue-700 border-blue-200" },
      { title: "GNU GPL v3", org: "Free Software Foundation", desc: "GPLv3 text with explanations on copyleft and freedoms.", url: "https://www.gnu.org/licenses/gpl-3.0.html", tag: "GPLv3", tagColor: "bg-orange-50 text-orange-700 border-orange-200" },
      { title: "Creative Commons & Software", org: "Creative Commons FAQ", desc: "Why CC licenses are not recommended for code.", url: "https://creativecommons.org/faq/#can-i-apply-a-creative-commons-license-to-software", tag: "CC FAQ", tagColor: "bg-purple-50 text-purple-700 border-purple-200" },
    ],
    faqTitle: "Frequently asked questions",
    faqItems: [
      { q: "No license = free to use?", a: "No. Without a license you keep all rights automatically by law (Berne Convention). No one can use, modify, or distribute it without your explicit permission — even if the code is public on GitHub." },
      { q: "Can I use MIT code in a paid app?", a: "Yes. MIT allows full commercial use. You just need to include the original copyright notice somewhere in your product (usually in the 'about' section or credits)." },
      { q: "Does Creative Commons work for code?", a: "Not recommended. Missing essential terms on compilation, source code, and patents. Use MIT (equivalent to CC-BY) or GPL (equivalent to CC-BY-SA)." },
      { q: "Can I change the license later?", a: "Only if you are the sole author. With external contributors you need everyone's permission — so choose carefully from the start." },
      { q: "What is GPL's viral effect?", a: "If you distribute software using GPL code, your code also becomes GPL. This ensures the software always stays open and free." },
      { q: "MIT vs Apache 2.0 — what's the real difference?", a: "Apache 2.0 adds explicit patent protection: if someone uses the software and then sues users over patents, they lose the right to use the Apache 2.0 code. MIT has no such mechanism." },
      { q: "What is tivoization, banned by GPLv3?", a: "Using GPL software in hardware locked to prevent users from installing modified versions — as TiVo did with Linux. GPLv3 explicitly prohibits this." },
      { q: "Can I have parts of my project under different licenses?", a: "Yes, carefully. Common to have core code in GPL and plugins in MIT. Just ensure the licenses are compatible — GPL and Apache 2.0 have known incompatibilities in certain uses." },
      { q: "What is public domain (Unlicense / CC0)?", a: "You waive all worldwide copyright. The code can be used by anyone, in any way, without even crediting you. It's irreversible." },
      { q: "Which license does GitHub recommend for new projects?", a: "GitHub recommends MIT for most projects — it's simple, widely understood, and compatible with almost every other license." },
    ],
    footerNote: "Educational content · Not legal advice",
    footerGithub: "View on GitHub",
  },
} as const;

/* ─── License data ─── */
const LICENSES = {
  pt: [
    { id: "mit", name: "MIT", emoji: "🟢", tagline: "A mais livre", color: "#22c55e", bg: "#f0fdf4", type: "Permissiva", oneLiner: "Faça o que quiser — só dê os créditos.", context: "A MIT é a licença de código aberto mais utilizada no mundo. Ela nasceu no MIT (Massachusetts Institute of Technology) na década de 1980 e se tornou popular por sua simplicidade extrema: apenas 171 palavras. Empresas como Meta, Google e Microsoft usam e publicam projetos sob MIT.", require: "Incluir o aviso de copyright em todas as cópias", can: ["Uso comercial", "Modificar o código", "Distribuir livremente", "Uso privado", "Sublicenciar"], cannot: ["Responsabilizar o autor por bugs"] },
    { id: "apache", name: "Apache 2.0", emoji: "🔵", tagline: "A corporativa", color: "#3b82f6", bg: "#eff6ff", type: "Permissiva", oneLiner: "Como a MIT, mas com proteção contra processos de patentes.", context: "Criada pela Apache Software Foundation, essa licença surgiu para resolver um problema real em ambientes corporativos: processos por violação de patentes. Se alguém usa o software e depois processa usuários por patentes relacionadas ao código, perde automaticamente o direito de usar o software Apache 2.0.", require: "Manter créditos + listar modificações nos arquivos alterados", can: ["Uso comercial", "Modificar o código", "Distribuir livremente", "Usar patentes incluídas"], cannot: ["Usar marcas registradas do projeto", "Responsabilizar o autor"] },
    { id: "gpl", name: "GNU GPLv3", emoji: "🟠", tagline: "A do código aberto", color: "#f97316", bg: "#fff7ed", type: "Copyleft", oneLiner: "Se usar o código, seu projeto também tem que ser aberto.", context: "Criada por Richard Stallman e a Free Software Foundation em 1989 (versão 3 em 2007), a GPL é a licença que define o movimento de software livre. Seu 'efeito viral' garante que nenhuma empresa possa pegar código aberto, fechar e vender sem devolver as melhorias para a comunidade.", require: "Disponibilizar código-fonte completo sob a mesma licença GPLv3", can: ["Uso comercial", "Modificar o código", "Distribuir livremente", "Uso privado"], cannot: ["Fechar o código de derivados", "Uso em software proprietário sem liberar fonte"] },
  ],
  en: [
    { id: "mit", name: "MIT", emoji: "🟢", tagline: "The freest one", color: "#22c55e", bg: "#f0fdf4", type: "Permissive", oneLiner: "Do whatever you want — just give credit.", context: "MIT is the most widely used open source license in the world. It was born at MIT (Massachusetts Institute of Technology) in the 1980s and became popular for its extreme simplicity: just 171 words. Companies like Meta, Google, and Microsoft use and publish projects under MIT.", require: "Include the copyright notice in all copies", can: ["Commercial use", "Modify the code", "Distribute freely", "Private use", "Sublicense"], cannot: ["Hold the author liable for bugs"] },
    { id: "apache", name: "Apache 2.0", emoji: "🔵", tagline: "The corporate one", color: "#3b82f6", bg: "#eff6ff", type: "Permissive", oneLiner: "Like MIT, but with patent lawsuit protection.", context: "Created by the Apache Software Foundation, this license was designed to solve a real problem in corporate environments: patent infringement lawsuits. If someone uses the software and then sues users over related patents, they automatically lose the right to use the Apache 2.0 software.", require: "Keep credits + list changes in modified files", can: ["Commercial use", "Modify the code", "Distribute freely", "Use included patents"], cannot: ["Use project trademarks", "Hold the author liable"] },
    { id: "gpl", name: "GNU GPLv3", emoji: "🟠", tagline: "The open-source guardian", color: "#f97316", bg: "#fff7ed", type: "Copyleft", oneLiner: "Use the code, your project must be open too.", context: "Created by Richard Stallman and the Free Software Foundation in 1989 (version 3 in 2007), the GPL defines the free software movement. Its 'viral effect' ensures no company can take open source code, close it, and sell it without returning improvements to the community.", require: "Release full source code under the same GPLv3 license", can: ["Commercial use", "Modify the code", "Distribute freely", "Private use"], cannot: ["Close source of derivatives", "Use in proprietary software without releasing source"] },
  ],
};

const LICENSE_EXAMPLES: Record<string, { name: string; stars: string; desc_pt: string; desc_en: string; repoUrl: string; licenseUrl: string; lang_label: string }[]> = {
  mit: [
    { name: "React", stars: "228k", desc_pt: "Biblioteca de UI criada pelo Meta. Usada em milhões de apps web.", desc_en: "UI library created by Meta. Used in millions of web apps.", repoUrl: "https://github.com/facebook/react", licenseUrl: "https://github.com/facebook/react/blob/main/LICENSE", lang_label: "JavaScript" },
    { name: "Vue.js", stars: "207k", desc_pt: "Framework progressivo para interfaces. Criado por Evan You.", desc_en: "Progressive framework for UIs. Created by Evan You.", repoUrl: "https://github.com/vuejs/core", licenseUrl: "https://github.com/vuejs/core/blob/main/LICENSE", lang_label: "TypeScript" },
    { name: "jQuery", stars: "59k", desc_pt: "Biblioteca JS clássica que dominou a web por mais de uma década.", desc_en: "Classic JS library that dominated the web for over a decade.", repoUrl: "https://github.com/jquery/jquery", licenseUrl: "https://github.com/jquery/jquery/blob/main/LICENSE.txt", lang_label: "JavaScript" },
    { name: "Rails", stars: "55k", desc_pt: "Framework web Ruby criado por DHH no Basecamp.", desc_en: "Ruby web framework created by DHH at Basecamp.", repoUrl: "https://github.com/rails/rails", licenseUrl: "https://github.com/rails/rails/blob/main/MIT-LICENSE", lang_label: "Ruby" },
  ],
  apache: [
    { name: "Kubernetes", stars: "109k", desc_pt: "Sistema de orquestração de containers criado pelo Google.", desc_en: "Container orchestration system created by Google.", repoUrl: "https://github.com/kubernetes/kubernetes", licenseUrl: "https://github.com/kubernetes/kubernetes/blob/master/LICENSE", lang_label: "Go" },
    { name: "TensorFlow", stars: "185k", desc_pt: "Framework de machine learning do Google. Base de IA moderna.", desc_en: "Google's machine learning framework. Foundation of modern AI.", repoUrl: "https://github.com/tensorflow/tensorflow", licenseUrl: "https://github.com/tensorflow/tensorflow/blob/master/LICENSE", lang_label: "C++" },
    { name: "Swift", stars: "67k", desc_pt: "Linguagem de programação da Apple para iOS e macOS.", desc_en: "Apple's programming language for iOS and macOS.", repoUrl: "https://github.com/apple/swift", licenseUrl: "https://github.com/apple/swift/blob/main/LICENSE.txt", lang_label: "C++" },
    { name: "Android", stars: "14k", desc_pt: "Framework base do sistema operacional móvel do Google.", desc_en: "Base framework of Google's mobile operating system.", repoUrl: "https://github.com/aosp-mirror/platform_frameworks_base", licenseUrl: "https://github.com/aosp-mirror/platform_frameworks_base/blob/master/LICENSE", lang_label: "Java" },
  ],
  gpl: [
    { name: "Linux Kernel", stars: "179k", desc_pt: "Núcleo do OS Linux. Base de servidores, Android e supercomputadores.", desc_en: "Linux OS kernel. Foundation of servers, Android and supercomputers.", repoUrl: "https://github.com/torvalds/linux", licenseUrl: "https://github.com/torvalds/linux/blob/master/COPYING", lang_label: "C" },
    { name: "Git", stars: "52k", desc_pt: "Sistema de controle de versão criado por Linus Torvalds em 2005.", desc_en: "Version control system created by Linus Torvalds in 2005.", repoUrl: "https://github.com/git/git", licenseUrl: "https://github.com/git/git/blob/master/COPYING", lang_label: "C" },
    { name: "WordPress", stars: "19k", desc_pt: "CMS que alimenta 43% de todos os sites da internet.", desc_en: "CMS powering 43% of all websites on the internet.", repoUrl: "https://github.com/WordPress/WordPress", licenseUrl: "https://github.com/WordPress/WordPress/blob/master/license.txt", lang_label: "PHP" },
    { name: "GIMP", stars: "4.5k", desc_pt: "Editor de imagens open source. Alternativa gratuita ao Photoshop.", desc_en: "Open source image editor. Free alternative to Photoshop.", repoUrl: "https://gitlab.gnome.org/GNOME/gimp", licenseUrl: "https://gitlab.gnome.org/GNOME/gimp/-/blob/master/LICENSE", lang_label: "C" },
  ],
};

const CONSEQUENCES = {
  pt: [
    { id: "lawsuit", severity: "Alto", icon: "💸", color: "#ef4444", bg: "#fef2f2", title: "Processo por danos", desc: "Empresas e indivíduos podem entrar com ações judiciais pedindo indenização.", detail: "Copyright existe automaticamente pela Convenção de Berna — não precisa registrar nada. Qualquer uso não autorizado já configura violação passível de processo.", caseTitle: "SCO Group vs. IBM (2003)", caseDesc: "A SCO processou a IBM por US$ 5 bilhões alegando que código proprietário da SCO foi incorporado ilegalmente ao Linux. O caso durou mais de 10 anos nos tribunais.", outcome: "SCO foi à falência em 2007 com dívidas legais. IBM venceu. O caso definiu precedentes importantes para o mundo open source." },
    { id: "removal", severity: "Alto", icon: "🚫", color: "#ef4444", bg: "#fef2f2", title: "Remoção forçada", desc: "Um tribunal pode ordenar a retirada imediata do produto do mercado.", detail: "Além de indenização, o titular dos direitos pode pedir tutela antecipada para interromper a distribuição enquanto o processo corre.", caseTitle: "Linksys / Cisco & BusyBox (2006–2009)", caseDesc: "O Linksys WRT54G usava BusyBox (GPL) em seu firmware sem liberar o código-fonte. A FSF e a Software Freedom Conservancy acionaram a Cisco legalmente.", outcome: "A Cisco foi obrigada a liberar o código-fonte, pagar indenização e implementar um programa de conformidade com GPL. O caso virou referência." },
    { id: "exposure", severity: "Médio", icon: "📢", color: "#f97316", bg: "#fff7ed", title: "Exposição pública", desc: "Comunidades de devs monitoram violações. Casos viralizaram no passado.", detail: "Organizações como a Software Freedom Conservancy e a FSF monitoram ativamente violações de licença. Redes sociais amplificam casos rapidamente.", caseTitle: "Skype e código LGPL (2007)", caseDesc: "O Skype usava a biblioteca Qt sob LGPL mas não informava adequadamente os usuários sobre seus direitos de substituir a biblioteca. A FSF apontou a violação publicamente.", outcome: "Skype foi pressionado a atualizar sua política e documentação. O caso gerou debate global sobre transparência em licenciamento." },
    { id: "opensource", severity: "Médio", icon: "🔓", color: "#f97316", bg: "#fff7ed", title: "Forçado a abrir o código", desc: "Violar a GPL pode obrigar a publicação completa do seu código-fonte.", detail: "Este é o 'efeito viral' da GPL em ação jurídica. Se um produto comercial usa código GPL sem cumprir os termos, pode ser obrigado a liberar todo o código.", caseTitle: "Best Buy / Insignia (2009)", caseDesc: "A Software Freedom Law Center descobriu que TVs Insignia da Best Buy usavam código GPL (BusyBox, Linux) sem fornecer o código-fonte aos compradores.", outcome: "Best Buy foi obrigada a publicar o código-fonte dos produtos afetados e a estabelecer um programa interno de conformidade com licenças open source." },
    { id: "dmca", severity: "Baixo", icon: "⚠️", color: "#eab308", bg: "#fefce8", title: "DMCA Takedown", desc: "O titular envia uma notificação exigindo remoção imediata do conteúdo.", detail: "O DMCA permite que titulares de direitos exijam a remoção de conteúdo de plataformas como GitHub, npm e PyPI em horas.", caseTitle: "youtube-dl no GitHub (2020)", caseDesc: "A RIAA enviou um DMCA ao GitHub exigindo remoção do repositório youtube-dl, alegando que a ferramenta facilitava pirataria de conteúdo protegido.", outcome: "GitHub removeu o repo inicialmente, mas o restaurou após revisão. O caso gerou debate sobre abuso de DMCA." },
    { id: "settlement", severity: "Baixo", icon: "🤝", color: "#eab308", bg: "#fefce8", title: "Acordo extrajudicial", desc: "Muitos casos terminam em acordos pagos antes de ir a julgamento.", detail: "Processos de copyright são caros e longos. É comum o infrator pagar uma quantia para licenciar retroativamente o uso e evitar o julgamento.", caseTitle: "Oracle vs. Google — Java e Android (2010–2021)", caseDesc: "Oracle processou o Google por US$ 9 bilhões alegando que o Android copiava APIs do Java sem licença adequada. Foi o maior caso de copyright de software da história.", outcome: "Após 11 anos, a Suprema Corte decidiu a favor do Google (fair use). O custo do processo foi estimado em centenas de milhões em honorários." },
  ],
  en: [
    { id: "lawsuit", severity: "High", icon: "💸", color: "#ef4444", bg: "#fef2f2", title: "Lawsuit for damages", desc: "Companies and individuals can file lawsuits seeking compensation.", detail: "Copyright exists automatically under the Berne Convention — no registration needed. Any unauthorized use constitutes a violation subject to lawsuit.", caseTitle: "SCO Group vs. IBM (2003)", caseDesc: "SCO sued IBM for $5 billion alleging SCO's proprietary code was illegally incorporated into Linux. The case lasted over 10 years in courts.", outcome: "SCO went bankrupt in 2007. IBM won. The case set important precedents for the open source world." },
    { id: "removal", severity: "High", icon: "🚫", color: "#ef4444", bg: "#fef2f2", title: "Forced removal", desc: "A court can order immediate removal of a product from the market.", detail: "In addition to damages, the rights holder can seek a preliminary injunction to stop distribution while the case is ongoing.", caseTitle: "Linksys / Cisco & BusyBox (2006–2009)", caseDesc: "The Linksys WRT54G used BusyBox (GPL) in its firmware without releasing source code. The FSF and Software Freedom Conservancy took legal action against Cisco.", outcome: "Cisco was forced to release source code, pay damages, and implement a GPL compliance program. The case became a landmark reference." },
    { id: "exposure", severity: "Medium", icon: "📢", color: "#f97316", bg: "#fff7ed", title: "Public exposure", desc: "Dev communities monitor violations. Cases have gone viral in the past.", detail: "Organizations like the Software Freedom Conservancy and the FSF actively monitor license violations. Social media amplifies cases rapidly.", caseTitle: "Skype and LGPL code (2007)", caseDesc: "Skype used the Qt library under LGPL but didn't properly inform users about their rights to replace the library. The FSF publicly called out the violation.", outcome: "Skype was pressured to update its policy and documentation. The case generated global debate about transparency in licensing." },
    { id: "opensource", severity: "Medium", icon: "🔓", color: "#f97316", bg: "#fff7ed", title: "Forced to open source", desc: "Violating the GPL can require publishing your full source code.", detail: "This is the GPL's 'viral effect' in legal action. If a commercial product uses GPL code without complying, it may be forced to release all code.", caseTitle: "Best Buy / Insignia (2009)", caseDesc: "The Software Freedom Law Center discovered that Best Buy's Insignia TVs used GPL code (BusyBox, Linux) without providing source code to buyers.", outcome: "Best Buy was required to publish source code for affected products and establish an internal open source license compliance program." },
    { id: "dmca", severity: "Low", icon: "⚠️", color: "#eab308", bg: "#fefce8", title: "DMCA Takedown", desc: "The rights holder sends a notice demanding immediate removal of content.", detail: "The DMCA allows rights holders to demand removal of infringing content from platforms like GitHub, npm, and PyPI within hours.", caseTitle: "youtube-dl on GitHub (2020)", caseDesc: "The RIAA sent a DMCA notice to GitHub demanding removal of the youtube-dl repository, claiming the tool facilitated piracy of protected content.", outcome: "GitHub initially removed the repo but restored it after review. The case sparked debate about DMCA abuse." },
    { id: "settlement", severity: "Low", icon: "🤝", color: "#eab308", bg: "#fefce8", title: "Out-of-court settlement", desc: "Many cases end in paid settlements before going to trial.", detail: "Copyright lawsuits are expensive and lengthy. It's common for the infringer to pay to retroactively license the use and avoid trial.", caseTitle: "Oracle vs. Google — Java and Android (2010–2021)", caseDesc: "Oracle sued Google for $9 billion alleging Android copied Java APIs without proper licensing. It was the largest software copyright case in history.", outcome: "After 11 years, the Supreme Court ruled in Google's favor (fair use). The lawsuit cost was estimated at hundreds of millions in legal fees." },
  ],
};

interface GHLicense { key: string; name: string; spdx_id: string; }
interface GHLicenseDetail extends GHLicense { body: string; }


/* ─── "In the wild" section data ─── */
const WORLD_TILES = [
  { name: "Linux Kernel", emoji: "🐧", license: "GPL v2", color: "#f97316", desc_pt: "Roda em 96% dos servidores do mundo", desc_en: "Powers 96% of the world's servers", url: "https://github.com/torvalds/linux" },
  { name: "Android", emoji: "🤖", license: "Apache 2.0", color: "#3b82f6", desc_pt: "2,5 bilhões de dispositivos ativos", desc_en: "2.5 billion active devices", url: "https://github.com/aosp-mirror/platform_frameworks_base" },
  { name: "React", emoji: "⚛️", license: "MIT", color: "#22c55e", desc_pt: "UI de Meta, Airbnb e Netflix", desc_en: "UI powering Meta, Airbnb, Netflix", url: "https://github.com/facebook/react" },
  { name: "VS Code", emoji: "💻", license: "MIT", color: "#22c55e", desc_pt: "Editor nº 1 — 73% dos devs", desc_en: "Editor #1 — used by 73% of devs", url: "https://github.com/microsoft/vscode" },
  { name: "TensorFlow", emoji: "🧠", license: "Apache 2.0", color: "#3b82f6", desc_pt: "Fundação de IA moderna do Google", desc_en: "Google's modern AI foundation", url: "https://github.com/tensorflow/tensorflow" },
  { name: "WordPress", emoji: "📝", license: "GPL v2", color: "#f97316", desc_pt: "43% de todos os sites do mundo", desc_en: "43% of all websites worldwide", url: "https://github.com/WordPress/WordPress" },
  { name: "Node.js", emoji: "🟩", license: "MIT", color: "#22c55e", desc_pt: "Runtime JS — Netflix, LinkedIn, PayPal", desc_en: "JS runtime — Netflix, LinkedIn, PayPal", url: "https://github.com/nodejs/node" },
  { name: "Kubernetes", emoji: "☸️", license: "Apache 2.0", color: "#3b82f6", desc_pt: "Containers — Google, AWS, Azure", desc_en: "Containers — Google, AWS, Azure", url: "https://github.com/kubernetes/kubernetes" },
];

const WORLD_STATS = [
  { stat: "44.7%", color: "#22c55e", bg: "bg-emerald-50", border: "border-emerald-100", label_pt: "dos repositórios GitHub usam MIT", label_en: "of GitHub repos use MIT" },
  { stat: "75%", color: "#3b82f6", bg: "bg-blue-50", border: "border-blue-100", label_pt: "do código aberto usa só 3 licenças", label_en: "of open-source uses just 3 licenses" },
  { stat: "100%", color: "#f97316", bg: "bg-orange-50", border: "border-orange-100", label_pt: "das Fortune 500 auditam licenças antes de adotar código", label_en: "of Fortune 500 audit licenses before adopting code" },
];

function WorldSection({ lang }: { lang: Lang }) {
  return (
    <section id="world" className="py-28 px-5 bg-[#f9f9f9]">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-emerald-600 mb-4 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
            {lang === "pt" ? "Você já usou hoje" : "You've already used it today"}
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            {lang === "pt" ? "Licenças estão em todo lugar" : "Licenses are everywhere"}
          </h2>
          <p className="text-neutral-500 font-medium max-w-xl mx-auto">
            {lang === "pt"
              ? "Todo npm install, todo clone, todo app que você usa rodou código com licença."
              : "Every npm install, every clone, every app you use ran code with a license."}
          </p>
        </FadeIn>

        <FadeIn className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {WORLD_TILES.map((t) => (
              <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer"
                className="bg-white rounded-2xl border border-black/[0.07] p-4 hover:shadow-md hover:border-black/20 hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{t.emoji}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0"
                    style={{ color: t.color, borderColor: t.color + "40", background: t.color + "18" }}>
                    {t.license}
                  </span>
                </div>
                <div className="font-black text-[15px] tracking-tight mb-1 text-black">{t.name}</div>
                <div className="text-[11px] text-neutral-400 leading-relaxed flex-1">
                  {lang === "pt" ? t.desc_pt : t.desc_en}
                </div>
                <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-neutral-300">
                  <Github className="w-3 h-3" /> GitHub ↗
                </div>
              </a>
            ))}
          </div>
        </FadeIn>

        <FadeIn>
          <div className="grid md:grid-cols-3 gap-3">
            {WORLD_STATS.map((s) => (
              <div key={s.stat} className={`${s.bg} rounded-2xl border ${s.border} p-6 text-center`}>
                <div className="text-4xl font-black tracking-tight mb-2" style={{ color: s.color }}>{s.stat}</div>
                <div className="text-sm font-semibold text-neutral-600 leading-snug">
                  {lang === "pt" ? s.label_pt : s.label_en}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════ MAIN ═══════════════════ */
export default function App() {
  const [lang, setLang] = useState<Lang>("pt");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useScrollSpy(SECTION_IDS);

  // hero + who + intro multi-open
  const [openHero, setOpenHero] = useState<Set<string>>(new Set());
  const [openWho, setOpenWho] = useState<Set<string>>(new Set());
  const [openPillars, setOpenPillars] = useState<Set<string>>(new Set());
  const [openReasons, setOpenReasons] = useState<Set<string>>(new Set());

  // big license card — single active tab
  const [activeLic, setActiveLic] = useState("mit");
  const [openExamples, setOpenExamples] = useState<Set<string>>(new Set());

  // consequences + faq multi-open
  const [openCons, setOpenCons] = useState<Set<string>>(new Set());
  const [openFAQ, setOpenFAQ] = useState<Set<number>>(new Set());

  // how-to step
  // github templates
  const [ghLicenses, setGhLicenses] = useState<GHLicense[]>([]);
  const [ghSearch, setGhSearch] = useState("");
  const [ghLoading, setGhLoading] = useState(false);
  const [selectedGh, setSelectedGh] = useState<GHLicenseDetail | null>(null);
  const [ghDetailLoading, setGhDetailLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [modalTab, setModalTab] = useState<"text" | "chars">("text");

  const ui = UI[lang];
  const licenses = LICENSES[lang];
  const consequences = CONSEQUENCES[lang];
  const currentLic = licenses.find((l) => l.id === activeLic) ?? licenses[0];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setGhLoading(true);
    fetch("https://api.github.com/licenses", { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => r.json()).then((d) => { setGhLicenses(d); setGhLoading(false); })
      .catch(() => setGhLoading(false));
  }, []);

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };
  const loadGhDetail = async (key: string) => {
    setSelectedGh(null); setModalTab("text"); setGhDetailLoading(true);
    try { const r = await fetch(`https://api.github.com/licenses/${key}`, { headers: { Accept: "application/vnd.github+json" } }); setSelectedGh(await r.json()); }
    finally { setGhDetailLoading(false); }
  };
  const copyText = (text: string) => { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };
  const filteredGh = ghLicenses.filter((l) => l.name.toLowerCase().includes(ghSearch.toLowerCase()) || l.spdx_id.toLowerCase().includes(ghSearch.toLowerCase()));

  const ToggleIcon = ({ open, light = false, size = "md" }: { open: boolean; light?: boolean; size?: "sm" | "md" }) => {
    const sz = size === "sm" ? "w-5 h-5" : "w-6 h-6";
    const ico = size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3";
    return (
      <div className={`${sz} rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${open ? (light ? "border-white/30 bg-white/15" : "border-black bg-black") : (light ? "border-white/20" : "border-black/15")}`}>
        {open ? <Minus className={`${ico} ${light ? "text-white" : "text-white"}`} /> : <Plus className={`${ico} ${light ? "text-white/50" : "text-neutral-400"}`} />}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* ── NAV ── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-xl border-b border-black/[0.06] shadow-[0_1px_12px_rgba(0,0,0,0.05)]" : ""}`}>
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <span className="font-bold text-[15px] tracking-tight">licenses<span className="text-blue-500">.</span></span>
          <nav className="hidden lg:flex items-center gap-0.5">
            {SECTION_IDS.map((id, i) => (
              <button key={id} onClick={() => scrollTo(id)}
                className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all ${activeSection === id ? "bg-black text-white" : "text-neutral-500 hover:text-black hover:bg-black/5"}`}>
                {ui.nav[i]}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-neutral-100 rounded-full p-0.5">
              {(["pt", "en"] as Lang[]).map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all duration-200 ${lang === l ? "bg-black text-white shadow-sm" : "text-neutral-400 hover:text-black"}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button className="lg:hidden p-1.5 rounded-lg hover:bg-black/5 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="lg:hidden bg-white border-b border-black/[0.06] px-5 py-3 flex flex-col gap-1">
              {SECTION_IDS.map((id, i) => (
                <button key={id} onClick={() => scrollTo(id)}
                  className={`text-[15px] text-left px-3 py-2.5 rounded-xl transition-colors ${activeSection === id ? "bg-black text-white font-medium" : "text-neutral-600 hover:bg-black/5"}`}>
                  {ui.nav[i]}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO ── */}
      <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <HeroEyebrow text={ui.heroEyebrow} />
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.92] mb-8 whitespace-pre-line">{ui.heroTitle}</h1>
            <p className="text-neutral-400 text-xl md:text-2xl font-light mb-14 max-w-lg mx-auto leading-snug">{ui.heroSub}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="grid grid-cols-3 gap-3 mb-14">
            {ui.heroCards.map((c) => {
              const isOpen = openHero.has(c.id);
              return (
                <div key={c.id} onClick={() => setOpenHero((p) => toggleSet(p, c.id))}
                  className={`rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden text-left ${isOpen ? "border-white/40 bg-white/[0.13]" : "border-white/[0.08] bg-white/[0.06] hover:bg-white/[0.1] hover:border-white/20"}`}>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-1 mb-3">
                      <span className="text-3xl">{c.icon}</span>
                      <ToggleIcon open={isOpen} light size="sm" />
                    </div>
                    <div className="font-bold text-white text-sm">{c.label}</div>
                    <div className="text-neutral-500 text-xs mt-0.5">{c.sub}</div>
                  </div>
                  <Expand open={isOpen}>
                    <div className="px-4 pb-4 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                      <div className="h-px bg-white/10" />
                      {c.points.map((pt) => (
                        <div key={pt} className="flex items-start gap-2 text-[11px] text-neutral-300 text-left font-medium">
                          <Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" /><span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </Expand>
                </div>
              );
            })}
          </motion.div>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            onClick={() => scrollTo("intro")}
            className="inline-flex items-center gap-2 bg-white text-black font-semibold px-7 py-3.5 rounded-full text-[15px] hover:bg-neutral-100 transition-colors">
            {ui.heroScroll} <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section id="intro" className="py-28 px-5 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-500 mb-4 px-3 py-1 bg-blue-50 rounded-full">{ui.introBadge}</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{ui.introHeading}</h2>
            <p className="text-neutral-400 font-medium">{ui.introSub}</p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {ui.pillars.map((p, i) => {
              const isOpen = openPillars.has(p.id);
              return (
                <FadeIn key={p.id} delay={i * 0.1}>
                  <div className={`rounded-3xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${isOpen ? "border-black shadow-xl" : `${p.color} border-transparent hover:shadow-md hover:border-black/10`}`}
                    style={isOpen ? { background: p.color.includes("purple") ? "#faf5ff" : p.color.includes("blue") ? "#eff6ff" : "#f0fdf4" } : undefined}
                    onClick={() => setOpenPillars((prev) => toggleSet(prev, p.id))}>
                    <div className="p-7">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-4xl">{p.icon}</span>
                        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${isOpen ? "border-black bg-black" : "border-neutral-200"}`}>
                          {isOpen ? <Minus className="w-3.5 h-3.5 text-white" /> : <Plus className="w-3.5 h-3.5 text-neutral-400" />}
                        </div>
                      </div>
                      <h3 className="font-black text-xl tracking-tight mb-2">{p.q}</h3>
                      <p className="text-neutral-600 text-[14px] leading-relaxed">{p.a}</p>
                    </div>
                    <Expand open={isOpen}>
                      <div className="px-7 pb-7 flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
                        <div className="h-px bg-black/10" />
                        {p.points.map((pt) => (
                          <div key={pt} className="flex items-center gap-2.5 text-sm font-semibold">
                            <Check className="w-4 h-4 text-black flex-shrink-0" /><span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </Expand>
                  </div>
                </FadeIn>
              );
            })}
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {ui.reasons.map((r, i) => (
              <FadeIn key={r.id} delay={i * 0.1}>
                <div className="rounded-3xl border border-black/[0.07] bg-[#f9f9f9] p-6 flex gap-4 items-center h-full">
                  <div className="w-11 h-11 rounded-2xl bg-black flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{r.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[15px] text-black mb-0.5">{r.title}</h4>
                    <p className="text-[13px] text-neutral-500 leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <div className="rounded-3xl bg-black text-white p-8">
              <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-6 text-center">{ui.pillars[2].q}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ui.who.map((w) => {
                  const isOpen = openWho.has(w.id);
                  return (
                    <div key={w.id} onClick={() => setOpenWho((p) => toggleSet(p, w.id))}
                      className={`rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${isOpen ? "border-white/40 bg-white/[0.13]" : "border-white/[0.08] bg-white/[0.05] hover:bg-white/[0.09] hover:border-white/20"}`}>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-1 mb-2">
                          <span className="text-2xl">{w.icon}</span>
                          <ToggleIcon open={isOpen} light size="sm" />
                        </div>
                        <div className="font-bold text-sm text-white">{w.label}</div>
                        <div className="text-neutral-500 text-xs mt-0.5">{w.sub}</div>
                      </div>
                      <Expand open={isOpen}>
                        <div className="px-4 pb-4" onClick={(e) => e.stopPropagation()}>
                          <div className="h-px bg-white/10 mb-3" />
                          <div className="flex items-start gap-1.5">
                            <span className="text-amber-400 text-[11px] mt-0.5">💡</span>
                            <p className="text-[12px] text-neutral-300 leading-relaxed font-medium">{w.tip}</p>
                          </div>
                        </div>
                      </Expand>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── IN THE WILD ── */}
      <WorldSection lang={lang} />

      {/* ── LICENSES — single big card ── */}
      <section id="licenses" className="py-28 px-5 bg-[#f9f9f9]">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">{ui.licTitle}</h2>
            <p className="text-neutral-400 font-medium">{ui.licSub}</p>
          </FadeIn>

          <FadeIn>
            {/* Tab selector */}
            <div className="flex gap-2 mb-0 p-2 bg-white rounded-3xl border border-black/[0.07] shadow-sm">
              {licenses.map((lic) => {
                const active = activeLic === lic.id;
                return (
                  <button key={lic.id} onClick={() => { setActiveLic(lic.id); setOpenExamples(new Set()); }}
                    className={`flex-1 flex items-center justify-center gap-2.5 py-4 px-4 rounded-2xl text-[15px] font-black tracking-tight transition-all duration-250 ${active ? "bg-black text-white shadow-md" : "text-neutral-400 hover:text-black hover:bg-black/[0.04]"}`}>
                    <span className="text-xl">{lic.emoji}</span>
                    <span className="hidden sm:inline">{lic.name}</span>
                    <span className={`hidden md:inline text-[11px] font-medium ${active ? "text-white/50" : "text-neutral-300"}`}>· {lic.tagline}</span>
                  </button>
                );
              })}
            </div>

            {/* Content panel */}
            <AnimatePresence mode="wait">
              <motion.div key={activeLic}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl border-2 border-black overflow-hidden mt-2"
                style={{ background: currentLic.bg }}>

                {/* Header */}
                <div className="p-8 md:p-10 border-b border-black/10">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-5xl">{currentLic.emoji}</span>
                        <div>
                          <div className="font-black text-3xl tracking-tight">{currentLic.name}</div>
                          <span className="text-[12px] font-bold px-3 py-1 rounded-full border inline-block mt-1"
                            style={{ color: currentLic.color, borderColor: currentLic.color + "50", background: currentLic.color + "18" }}>
                            <Tip label={lang === "pt"
                              ? (currentLic.type.includes("Copyleft") ? "Copyleft: derivados devem usar a mesma licença" : currentLic.type.includes("Permissiva") || currentLic.type.includes("Permissive") ? "Permissiva: pouquíssimas restrições, máxima liberdade" : "Domínio Público: sem direitos reservados")
                              : (currentLic.type.includes("Copyleft") ? "Copyleft: derivatives must use the same license" : currentLic.type.includes("Permissive") ? "Permissive: very few restrictions, maximum freedom" : "Public Domain: no rights reserved")}>
                              {currentLic.type}
                            </Tip>
                          </span>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-neutral-800 leading-snug max-w-lg">{currentLic.oneLiner}</p>
                    </div>
                    <div className="md:max-w-xs bg-white/60 rounded-2xl p-5 border border-black/[0.07]">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2">{ui.requireLabel}</p>
                      <p className="text-sm font-semibold text-neutral-800 leading-relaxed">{currentLic.require}</p>
                    </div>
                  </div>
                </div>

                {/* Context */}
                <div className="px-8 md:px-10 py-6 border-b border-black/10">
                  <p className="text-[14px] text-neutral-700 leading-relaxed">{currentLic.context}</p>
                </div>

                {/* Can / Cannot */}
                <div className="px-8 md:px-10 py-6 border-b border-black/10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: currentLic.color }}>{ui.permLabel}</p>
                      <div className="flex flex-col gap-3">
                        {currentLic.can.map((c) => (
                          <div key={c} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: currentLic.color + "25" }}>
                              <Check className="w-3.5 h-3.5" style={{ color: currentLic.color }} />
                            </div>
                            <span className="font-semibold text-[14px] text-neutral-800">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-red-400 mb-4">{ui.noPermLabel}</p>
                      <div className="flex flex-col gap-3">
                        {currentLic.cannot.map((c) => (
                          <div key={c} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                              <X className="w-3.5 h-3.5 text-red-400" />
                            </div>
                            <span className="font-semibold text-[14px] text-neutral-800">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real projects */}
                <div className="px-8 md:px-10 py-6">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-4">{ui.usedBy}</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {LICENSE_EXAMPLES[currentLic.id].map((ex) => {
                      const key = `${currentLic.id}-${ex.name}`;
                      const exOpen = openExamples.has(key);
                      return (
                        <div key={ex.name} className="flex flex-col">
                          <button onClick={() => setOpenExamples((p) => toggleSet(p, key))}
                            className={`flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all border-2 ${exOpen ? "bg-black text-white border-black" : "bg-white border-transparent hover:border-black/20 text-neutral-800 shadow-sm"}`}>
                            <div className="flex items-center gap-3">
                              <span className="font-black text-[15px]">{ex.name}</span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${exOpen ? "bg-white/15 text-white/70" : "bg-neutral-100 text-neutral-500"}`}>{ex.lang_label}</span>
                              <span className={`text-[11px] ${exOpen ? "text-white/50" : "text-neutral-400"}`}>⭐ {ex.stars}</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 transition-transform ${exOpen ? "rotate-180 text-white/60" : "text-neutral-300"}`} />
                          </button>
                          <Expand open={exOpen}>
                            <div className="mt-1 bg-black rounded-2xl p-4 flex flex-col gap-3">
                              <p className="text-[13px] text-neutral-400 leading-relaxed">{lang === "pt" ? ex.desc_pt : ex.desc_en}</p>
                              <div className="grid grid-cols-2 gap-2">
                                <a href={ex.repoUrl} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-[12px] font-bold text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                                  <Github className="w-3.5 h-3.5" /> {ui.exampleRepo}
                                </a>
                                <a href={ex.licenseUrl} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-[12px] font-bold text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                                  <FileText className="w-3.5 h-3.5" /> {ui.exampleLicense}
                                </a>
                              </div>
                            </div>
                          </Expand>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </FadeIn>

          {/* Quick comparison */}
          <FadeIn delay={0.2} className="mt-4">
            <div className="bg-black rounded-3xl p-6 md:p-8 text-white">
              <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-6 text-center">{ui.compTitle}</p>
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div />
                {licenses.map((l) => (
                  <button key={l.id} onClick={() => setActiveLic(l.id)}
                    className={`font-black text-base transition-all rounded-xl py-1 ${activeLic === l.id ? "text-white" : "text-neutral-500 hover:text-white"}`}>
                    {l.emoji} {l.name}
                  </button>
                ))}
                {[
                  { label: lang === "pt" ? "Uso comercial" : "Commercial use", vals: [true, true, true] },
                  { label: lang === "pt" ? "Pode fechar código" : "Can close source", vals: [true, true, false] },
                  { label: lang === "pt" ? "Patentes" : "Patents", vals: [false, true, true] },
                  { label: lang === "pt" ? "Compartilhar igual" : "Share alike", vals: [false, false, true] },
                ].map((row) => (
                  <div key={row.label} className="contents">
                    <div className="text-neutral-400 text-left font-medium py-2 flex items-center text-[12px]">{row.label}</div>
                    {row.vals.map((v, i) => (
                      <div key={i} className="flex items-center justify-center py-2">
                        {v ? <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"><Check className="w-3.5 h-3.5 text-emerald-400" /></div>
                          : <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center"><X className="w-3.5 h-3.5 text-neutral-600" /></div>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── POPULARITY CHART — right after licenses as supporting data ── */}
      <section className="py-16 px-5 bg-[#f9f9f9] border-t border-black/[0.04]">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-white border border-black/[0.07] rounded-full text-[12px] font-bold text-neutral-500">
              <BarChart2 className="w-3.5 h-3.5" /> {lang === "pt" ? "Dados" : "Data"}
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">{ui.popTitle}</h2>
            <p className="text-neutral-400 text-sm">{ui.popSub}</p>
          </FadeIn>
          <PopBarsSection />
        </div>
      </section>

      {/* ── CONSEQUENCES — dark section for visual impact ── */}
      <section id="consequences" className="py-28 px-5 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3 text-white">{ui.consTitle}</h2>
            <p className="text-neutral-500 font-medium">{ui.consSub}</p>
          </FadeIn>
          <FadeIn className="mb-8">
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] px-6 py-4">
              <p className="text-[14px] text-neutral-400 leading-relaxed text-center">
                {lang === "pt"
                  ? "Ignorar licenças tem custo real. Veja o que aconteceu com empresas que não levaram a sério."
                  : "Ignoring licenses has a real cost. See what happened to companies that didn't take it seriously."}
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {consequences.map((c, i) => {
              const isOpen = openCons.has(c.id);
              return (
                <FadeIn key={c.id} delay={i * 0.08}>
                  <div className={`rounded-3xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${isOpen ? "border-white/20 bg-white/[0.09]" : "border-white/[0.06] bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/[0.12]"}`}
                    onClick={() => setOpenCons((p) => toggleSet(p, c.id))}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-3xl">{c.icon}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ color: c.color, background: c.color + "25" }}>
                            {c.severity}
                          </span>
                          <ToggleIcon open={isOpen} light />
                        </div>
                      </div>
                      <h3 className="font-black text-[17px] tracking-tight mb-2 text-white">{c.title}</h3>
                      <p className="text-sm leading-relaxed text-neutral-500">{c.desc}</p>
                    </div>
                    <Expand open={isOpen}>
                      <div className="px-6 pb-6 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
                        <div className="h-px bg-white/[0.08]" />
                        <p className="text-[13px] text-neutral-400 leading-relaxed">{c.detail}</p>
                        <div className="bg-white/[0.05] rounded-2xl p-4 border border-white/[0.07]">
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: c.color }}>{ui.consCase}</p>
                          <p className="font-black text-[15px] text-white mb-2">{c.caseTitle}</p>
                          <p className="text-[13px] text-neutral-400 leading-relaxed mb-3">{c.caseDesc}</p>
                          <div className="border-t border-white/[0.08] pt-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-1">{ui.consOutcome}</p>
                            <p className="text-[13px] text-neutral-300 leading-relaxed">{c.outcome}</p>
                          </div>
                        </div>
                      </div>
                    </Expand>
                  </div>
                </FadeIn>
              );
            })}
          </div>
          <FadeIn delay={0.4} className="mt-8">
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="font-bold text-sm text-neutral-500">{lang === "pt" ? "Escala de severidade" : "Severity scale"}</p>
              <div className="flex items-center gap-5">
                {[{ label: lang === "pt" ? "Baixo" : "Low", c: "#eab308" }, { label: lang === "pt" ? "Médio" : "Medium", c: "#f97316" }, { label: lang === "pt" ? "Alto" : "High", c: "#ef4444" }].map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.c }} />
                    <span className="text-sm font-medium text-neutral-500">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── GITHUB TEMPLATES ── */}
      <section id="templates" className="py-28 px-5 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 bg-black rounded-full text-white text-[12px] font-bold tracking-wide">
              <Github className="w-3.5 h-3.5" /> GitHub API — {lang === "pt" ? "dados ao vivo" : "live data"}
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">{ui.tmplTitle}</h2>
            <p className="text-neutral-400 font-medium">{ui.tmplSub}</p>
          </FadeIn>
          <FadeIn className="mb-6">
            <div className="relative max-w-sm mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input value={ghSearch} onChange={(e) => setGhSearch(e.target.value)} placeholder={ui.tmplSearch}
                className="w-full bg-[#f9f9f9] border border-black/[0.08] rounded-full pl-11 pr-5 py-3 text-[14px] font-medium outline-none focus:border-black transition-colors" />
            </div>
          </FadeIn>
          {ghLoading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-neutral-400">
              <RefreshCw className="w-5 h-5 animate-spin" /><span className="font-medium">{ui.tmplLoading}</span>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredGh.map((lic, i) => (
                <FadeIn key={lic.key} delay={i * 0.03}>
                  <button onClick={() => loadGhDetail(lic.key)}
                    className="w-full text-left bg-[#f9f9f9] rounded-2xl border border-black/[0.07] p-5 hover:border-black hover:bg-white hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-[15px] tracking-tight truncate">{lic.name}</p>
                        <p className="text-xs font-mono text-neutral-400 mt-0.5">{lic.spdx_id}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-neutral-300 group-hover:text-black -rotate-90 transition-all flex-shrink-0 mt-0.5" />
                    </div>
                  </button>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HOW TO USE ── */}
      <section id="howto" className="py-28 px-5 bg-[#f9f9f9]">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">{ui.howTitle}</h2>
            <p className="text-neutral-400 font-medium">{ui.howSub}</p>
          </FadeIn>
          <FadeIn>
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <span className="text-xl flex-shrink-0">🎮</span>
              <p className="text-[14px] text-amber-800 leading-relaxed font-medium">
                {lang === "pt"
                  ? "Simulador interativo — clique nos botões para percorrer o fluxo real do GitHub, exatamente como funciona na plataforma."
                  : "Interactive simulator — click the buttons to walk through GitHub's real workflow, exactly as it works on the platform."}
              </p>
            </div>
            <GHSimulator lang={lang} />
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-28 px-5 bg-white">
        <div className="max-w-2xl mx-auto">
          <FadeIn className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">{ui.faqTitle}</h2>
          </FadeIn>
          <div className="flex flex-col gap-2">
            {ui.faqItems.map((item, i) => {
              const isOpen = openFAQ.has(i);
              return (
                <FadeIn key={i} delay={i * 0.04}>
                  <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen ? "border-black bg-black" : "border-black/[0.07] bg-[#f9f9f9] hover:border-black/20"}`}>
                    <button className="w-full flex items-center justify-between gap-4 p-5 text-left"
                      onClick={() => setOpenFAQ((p) => { const n = new Set(p); if (n.has(i)) n.delete(i); else n.add(i); return n; })}>
                      <span className={`font-semibold text-[15px] ${isOpen ? "text-white" : "text-black"}`}>{item.q}</span>
                      <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-white" : "text-neutral-400"}`} />
                    </button>
                    <Expand open={isOpen}>
                      <p className="px-5 pb-5 text-[14px] text-neutral-300 leading-relaxed">{item.a}</p>
                    </Expand>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── REFERENCES — bibliography at the end ── */}
      <section id="references" className="py-20 px-5 bg-[#f9f9f9] border-t border-black/[0.05]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">{ui.refTitle}</h2>
            <p className="text-neutral-400 font-medium text-sm">{ui.refSub}</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-3">
            {ui.refs.map((ref, i) => (
              <FadeIn key={ref.url} delay={i * 0.08}>
                <a href={ref.url} target="_blank" rel="noopener noreferrer"
                  className="group flex flex-col gap-3 p-5 bg-white rounded-2xl border border-black/[0.07] hover:border-black hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-[16px] tracking-tight group-hover:text-blue-600 transition-colors mb-0.5">{ref.title}</h3>
                      <p className="text-xs font-medium text-neutral-400">{ref.org}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${ref.tagColor}`}>{ref.tag}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-300 group-hover:text-black transition-colors" />
                    </div>
                  </div>
                  <p className="text-sm text-neutral-500 leading-relaxed">{ref.desc}</p>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-black text-white py-10 px-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-[15px]">licenses<span className="text-blue-400">.</span></span>
          <p className="text-neutral-500 text-sm">{ui.footerNote}</p>
          <div className="flex items-center gap-3">
            <a href="https://github.com/caioy0/licenses" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13px] font-semibold text-neutral-400 hover:text-white transition-colors">
              <Github className="w-4 h-4" />{ui.footerGithub}
            </a>
            <div className="w-px h-4 bg-neutral-700" />
            <div className="flex items-center gap-1">
              {(["pt", "en"] as Lang[]).map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all ${lang === l ? "bg-white text-black" : "text-neutral-500 hover:text-white"}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── LICENSE TEMPLATE MODAL ── */}
      <AnimatePresence>
        {(ghDetailLoading || selectedGh) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) { setSelectedGh(null); setGhDetailLoading(false); setModalTab("text"); } }}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
              {ghDetailLoading ? (
                <div className="flex items-center justify-center py-24 gap-3 text-neutral-400">
                  <RefreshCw className="w-5 h-5 animate-spin" /><span className="font-medium">{ui.tmplLoading}</span>
                </div>
              ) : selectedGh ? (
                <>
                  {/* Modal header */}
                  <div className="flex items-start justify-between gap-4 p-5 border-b border-black/[0.06]">
                    <div className="min-w-0">
                      <h3 className="font-black text-xl tracking-tight truncate">{selectedGh.name}</h3>
                      <p className="text-xs font-mono text-neutral-400 mt-0.5">{selectedGh.spdx_id}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {modalTab === "text" && (
                        <button onClick={() => copyText(selectedGh.body)}
                          className="flex items-center gap-1.5 text-[13px] font-semibold px-3.5 py-2 rounded-full bg-black text-white hover:bg-neutral-800 transition-colors">
                          {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copied ? ui.tmplCopied : ui.tmplCopy}
                        </button>
                      )}
                      <button onClick={() => { setSelectedGh(null); setModalTab("text"); }} className="p-2 rounded-full hover:bg-black/5 transition-colors">
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tab bar */}
                  <div className="flex gap-1 px-5 pt-3 pb-0 border-b border-black/[0.06]">
                    <button onClick={() => setModalTab("text")}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-bold rounded-t-xl border-b-2 transition-all ${modalTab === "text" ? "border-black text-black" : "border-transparent text-neutral-400 hover:text-black"}`}>
                      <FileText className="w-3.5 h-3.5" />
                      {lang === "pt" ? "Licença" : "License"}
                    </button>
                    <button onClick={() => setModalTab("chars")}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-bold rounded-t-xl border-b-2 transition-all ${modalTab === "chars" ? "border-black text-black" : "border-transparent text-neutral-400 hover:text-black"}`}>
                      <BarChart2 className="w-3.5 h-3.5" />
                      {ui.tmplChars}
                    </button>
                  </div>

                  {/* Tab content */}
                  <div className="overflow-y-auto flex-1">
                    {modalTab === "text" ? (
                      <div className="p-6">
                        <pre className="text-[12px] font-mono text-neutral-700 leading-relaxed whitespace-pre-wrap break-words bg-[#f9f9f9] rounded-2xl p-5 border border-black/[0.06]">{selectedGh.body}</pre>
                      </div>
                    ) : (
                      <div className="p-6">
                        {(() => {
                          const chars = LICENSE_CHARS[selectedGh.key];
                          const pros = lang === "pt" ? chars?.pros_pt : chars?.pros_en;
                          const cons = lang === "pt" ? chars?.cons_pt : chars?.cons_en;
                          if (!chars) return (
                            <div className="flex flex-col items-center justify-center py-16 gap-3 text-neutral-400">
                              <BarChart2 className="w-8 h-8 opacity-30" />
                              <p className="text-sm font-medium">{ui.tmplNoChars}</p>
                            </div>
                          );
                          return (
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 mb-4">{ui.tmplPros}</p>
                                <div className="flex flex-col gap-3">
                                  {pros?.map((p) => (
                                    <div key={p} className="flex items-start gap-2.5">
                                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-3 h-3 text-white" />
                                      </div>
                                      <span className="text-[13px] text-emerald-900 leading-relaxed">{p}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-red-600 mb-4">{ui.tmplCons}</p>
                                <div className="flex flex-col gap-3">
                                  {cons?.map((c) => (
                                    <div key={c} className="flex items-start gap-2.5">
                                      <div className="w-5 h-5 rounded-full bg-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <X className="w-3 h-3 text-white" />
                                      </div>
                                      <span className="text-[13px] text-red-900 leading-relaxed">{c}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}