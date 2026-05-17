import { useState, useRef, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────
   GLOBAL CSS INJECTION
───────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; -webkit-font-smoothing: antialiased; }

/* ── LIGHT ── */
:root {
  --font-display: 'DM Serif Display', Georgia, serif;
  --font-body:    'DM Sans', system-ui, sans-serif;

  --bg:           #fef9f3;
  --bg2:          #eee5d8;
  --bg3:          #e2d5c3;
  --surface:      #fffcf7;
  --line:         rgba(139,111,71,0.12);
  --line2:        rgba(139,111,71,0.22);

  --ink:          #2a2420;
  --ink2:         #4e433b;
  --ink3:         #7a6a5e;
  --ink4:         #a8998e;

  --red:          #C8102E;
  --red-dark:     #9E0C24;
  --red-glow:     rgba(200,16,46,0.09);
  --red-glow2:    rgba(200,16,46,0.16);

  --gold:         #8B6F47;
  --success:      #2A7A4A;

  --shadow-sm:    0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:    0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
  --shadow-lg:    0 12px 32px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.05);
  --shadow-red:   0 4px 16px rgba(200,16,46,0.28);
  --r-sm: 8px; --r-md: 14px; --r-lg: 20px; --r-xl: 28px; --r-full: 9999px;
}

/* ── DARK ── */
html[data-theme="dark"] {
  --bg:           #1f1612;
  --bg2:          #332b25;
  --bg3:          #3f342c;
  --surface:      #2a2118;
  --line:         rgba(212,165,116,0.10);
  --line2:        rgba(212,165,116,0.18);

  --ink:          #fef9f3;
  --ink2:         #d4c9bc;
  --ink3:         #9a8b7c;
  --ink4:         #6a5d50;

  --red:          #E8384F;
  --red-dark:     #C8102E;
  --red-glow:     rgba(232,56,79,0.12);
  --red-glow2:    rgba(232,56,79,0.22);

  --gold:         #d4a574;
  --success:      #3A9A5A;

  --shadow-sm:    0 1px 3px rgba(0,0,0,0.3);
  --shadow-md:    0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg:    0 12px 32px rgba(0,0,0,0.5);
  --shadow-red:   0 4px 16px rgba(232,56,79,0.30);
}

body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  transition: background 0.35s ease, color 0.35s ease;
}

::selection { background: var(--red-glow2); color: var(--red-dark); }

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--bg3); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: var(--ink4); }

@keyframes slideUp   { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
@keyframes popIn     { from { opacity:0; transform:scale(.94); } to { opacity:1; transform:scale(1); } }
@keyframes dotBlink  { 0%,100%{ opacity:.25; } 50%{ opacity:1; } }
@keyframes spin      { to { transform:rotate(360deg); } }
@keyframes checkDraw { from { stroke-dashoffset: 30; } to { stroke-dashoffset: 0; } }
@keyframes shimmerIn { from { opacity:0; transform:translateX(-6px); } to { opacity:1; transform:translateX(0); } }

.msg-anim   { animation: slideUp 0.32s cubic-bezier(.16,1,.3,1) both; }
.fade-anim  { animation: fadeIn 0.4s ease both; }
.pop-anim   { animation: popIn 0.35s cubic-bezier(.16,1,.3,1) both; }

/* bot message typography */
.bot-prose p { margin: 0 0 10px; line-height: 1.78; color: var(--ink2); }
.bot-prose p:last-child { margin-bottom: 0; }
.bot-prose strong { font-weight: 600; color: var(--ink); }
.bot-prose em     { font-style: italic; color: var(--ink3); }
.bot-prose ul     { margin: 8px 0 10px 0; padding-left: 18px; }
.bot-prose li     { line-height: 1.72; margin-bottom: 5px; color: var(--ink2); }
.bot-prose code   { background: var(--bg3); color: var(--red); padding: 1px 5px; border-radius: 5px; font-size:.88em; font-family:monospace; }
`;

function injectCSS() {
  if (document.getElementById("jg2-css")) return;
  const s = document.createElement("style");
  s.id = "jg2-css";
  s.textContent = GLOBAL_CSS;
  document.head.appendChild(s);
}

/* ─────────────────────────────────────────────
   JECRC LOGO SVG  (traced from provided image)
───────────────────────────────────────────── */
function JECRCLogo({ size = 36 }) {
  return (
    <svg width={size * 2.6} height={size} viewBox="0 0 120 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block" }}>
      {/* Shield */}
      <rect x="0" y="0" width="38" height="46" rx="3" fill="#C8102E"/>
      {/* Shield outline symbol — simplified crest */}
      <path d="M19 5 L31 10 L31 26 Q31 36 19 41 Q7 36 7 26 L7 10 Z" fill="none" stroke="white" strokeWidth="1.2"/>
      {/* Book icon */}
      <rect x="12" y="19" width="14" height="9" rx="1" fill="none" stroke="white" strokeWidth="1"/>
      <line x1="19" y1="19" x2="19" y2="28" stroke="white" strokeWidth="0.8"/>
      {/* Laurel dots */}
      <circle cx="10" cy="15" r="1" fill="white"/>
      <circle cx="28" cy="15" r="1" fill="white"/>
      <circle cx="9"  cy="23" r="1" fill="white"/>
      <circle cx="29" cy="23" r="1" fill="white"/>
      {/* Flame / torch top */}
      <path d="M19 7 Q21 10 19 12 Q17 10 19 7Z" fill="white"/>

      {/* Wordmark */}
      <text x="44" y="20" fontFamily="'DM Serif Display',Georgia,serif" fontSize="16" fontWeight="400" fill="currentColor" letterSpacing="1.5">JECRC</text>
      <text x="44" y="32" fontFamily="'DM Sans',system-ui,sans-serif" fontSize="8.5" fontWeight="500" fill="currentColor" letterSpacing="3.5">UNIVERSITY</text>
      <text x="44" y="42" fontFamily="'DM Sans',system-ui,sans-serif" fontSize="6" fontWeight="400" fill="var(--ink3)" letterSpacing="1.8">BUILD YOUR WORLD</text>
    </svg>
  );
}

function JECRCMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="38" height="46" rx="4" fill="#C8102E"/>
      <path d="M19 5 L31 10 L31 26 Q31 36 19 41 Q7 36 7 26 L7 10 Z" fill="none" stroke="white" strokeWidth="1.4"/>
      <rect x="12" y="19" width="14" height="9" rx="1" fill="none" stroke="white" strokeWidth="1.1"/>
      <line x1="19" y1="19" x2="19" y2="28" stroke="white" strokeWidth="0.9"/>
      <circle cx="10" cy="15" r="1.1" fill="white"/>
      <circle cx="28" cy="15" r="1.1" fill="white"/>
      <circle cx="9"  cy="23" r="1.1" fill="white"/>
      <circle cx="29" cy="23" r="1.1" fill="white"/>
      <path d="M19 7 Q21 10 19 12 Q17 10 19 7Z" fill="white"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const WELCOME_TEXT =
  "**Hello! I'm JECRC GPT.**\n\nYour dedicated campus intelligence assistant — ask me anything about JECRC University.\n\n**I can help with:**\n- 📋 Admissions & Application Process\n- 💼 Placements & Career Opportunities\n- 🏛️ Campus Life & Hostel Information\n- 🎓 Scholarships & Financial Aid\n- 📚 Academic Programs & Courses\n- 📞 Contact & General University Info";

const CHIPS = [
  { icon: "🎓", label: "Admissions",   q: "Tell me about B.Tech admission requirements and the application process at JECRC University" },
  { icon: "💼", label: "Placements",   q: "What are the latest placement statistics and top recruiters at JECRC University?" },
  { icon: "🏛️", label: "Campus Life",  q: "Tell me about campus facilities, hostel fees, and living on campus at JECRC" },
  { icon: "🏅", label: "Scholarships", q: "What scholarship and financial aid options are available at JECRC University?" },
  { icon: "📚", label: "Programs",     q: "What academic programs and courses does JECRC University offer?" },
  { icon: "📍", label: "Contact",      q: "What are the contact details, address and office timings for JECRC University?" },
  { icon: "🗓️", label: "Events",       q: "What upcoming events, fests or activities are happening at JECRC University?" },
];

const ABOUT_LINKS = [
  { label: "Official Website",    url: "https://www.jecrcuniversity.edu.in", icon: "🌐" },
  { label: "Admissions Portal",   url: "https://admissions.jecrcuniversity.edu.in", icon: "📋" },
  { label: "Placement Cell",      url: "https://www.jecrcuniversity.edu.in/placements", icon: "💼" },
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function fmt(d) {
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function parseMd(text) {
  const blocks = [];
  let listItems = [], paraLines = [];
  const flushP = () => {
    const c = paraLines.join(" ").trim();
    if (c) blocks.push({ type: "p", c });
    paraLines = [];
  };
  const flushL = () => {
    if (listItems.length) { blocks.push({ type: "ul", items: [...listItems] }); listItems = []; }
  };
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t) { flushP(); flushL(); continue; }
    if (t.match(/^[-•*]\s+/)) { flushP(); listItems.push(t.replace(/^[-•*]\s+/, "")); continue; }
    if (listItems.length) flushL();
    paraLines.push(t);
  }
  flushP(); flushL();
  return blocks;
}

function Bold({ text }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return <>{parts.map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>)}</>;
}

function BotProse({ text }) {
  return (
    <div className="bot-prose">
      {parseMd(text).map((b, i) =>
        b.type === "ul"
          ? <ul key={i}>{b.items.map((it, j) => <li key={j}><Bold text={it} /></li>)}</ul>
          : <p key={i}><Bold text={b.c} /></p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   AVATARS
───────────────────────────────────────────── */
function BotAvatarSmall() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
      background: "#C8102E", display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 3px 10px rgba(200,16,46,.30)",
    }}>
      <svg width="18" height="20" viewBox="0 0 38 46" fill="none">
        <path d="M19 2 L33 8 L33 27 Q33 38 19 44 Q5 38 5 27 L5 8 Z" fill="none" stroke="white" strokeWidth="1.8"/>
        <rect x="12" y="20" width="14" height="9" rx="1" fill="none" stroke="white" strokeWidth="1.2"/>
        <line x1="19" y1="20" x2="19" y2="29" stroke="white" strokeWidth="1"/>
        <path d="M19 6 Q21.5 10 19 13 Q16.5 10 19 6Z" fill="white"/>
      </svg>
    </div>
  );
}

function UserAvatarSmall() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
      background: "var(--bg3)", border: "1.5px solid var(--line2)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
      color: "var(--ink3)",
    }}>
      U
    </div>
  );
}

/* ─────────────────────────────────────────────
   TYPING DOTS
───────────────────────────────────────────── */
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "4px 2px", alignItems: "center" }}>
      {[0, 0.18, 0.36].map((d, i) => (
        <span key={i} style={{
          display: "block", width: 7, height: 7, borderRadius: "50%",
          background: "var(--red)", opacity: 0.4,
          animation: `dotBlink 1.3s ease-in-out ${d}s infinite`,
        }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   COPY BUTTON
───────────────────────────────────────────── */
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      title="Copy"
      style={{
        background: "none", border: "1px solid var(--line2)", borderRadius: 7,
        padding: "4px 8px", cursor: "pointer", color: copied ? "var(--success)" : "var(--ink3)",
        fontSize: 11, fontFamily: "var(--font-body)", fontWeight: 500,
        display: "flex", alignItems: "center", gap: 4,
        transition: "all 0.2s", whiteSpace: "nowrap",
        opacity: 0, // revealed by parent :hover via JS
      }}
    >
      {copied
        ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 30, strokeDashoffset: 0 }}><polyline points="20 6 9 17 4 12"/></svg> Copied</>
        : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</>
      }
    </button>
  );
}

/* ─────────────────────────────────────────────
   MESSAGE
───────────────────────────────────────────── */
function Message({ msg, prev }) {
  const isUser = msg.role === "user";
  const isError = !!msg.isError;
  const sameRole = prev?.role === msg.role;
  const [hovered, setHovered] = useState(false);

  // plain text for copy
  const plainText = msg.text.replace(/\*\*(.*?)\*\*/g, "$1");

  return (
    <div
      className="msg-anim"
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 10,
        marginTop: sameRole ? 3 : 18,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar */}
      <div style={{ flexShrink: 0, width: 32 }}>
        {!sameRole && (isUser ? <UserAvatarSmall /> : <BotAvatarSmall />)}
      </div>

      <div style={{
        maxWidth: "62%", display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        gap: 5,
      }}>
        {/* Bubble */}
        <div style={{
          padding: "11px 16px",
          borderRadius: isUser
            ? "18px 4px 18px 18px"
            : "4px 18px 18px 18px",
          background: isError
            ? "rgba(200,16,46,0.08)"
            : isUser
            ? "var(--red)"
            : "var(--surface)",
          color: isError ? "var(--red)" : isUser ? "#fff" : "var(--ink2)",
          fontSize: 14,
          lineHeight: 1.75,
          fontWeight: 400,
          border: isUser || isError ? "none" : "1px solid var(--line2)",
          boxShadow: isUser
            ? "var(--shadow-red)"
            : "var(--shadow-sm)",
          wordBreak: "break-word",
          transition: "box-shadow 0.2s",
        }}>
          {isUser ? <span style={{ fontFamily: "var(--font-body)" }}>{msg.text}</span>
            : <BotProse text={msg.text} />}
        </div>

        {/* Meta row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          flexDirection: isUser ? "row-reverse" : "row",
        }}>
          <span style={{
            fontSize: 11, color: "var(--ink4)",
            opacity: hovered ? 1 : 0, transition: "opacity 0.2s",
          }}>
            {fmt(msg.ts)}
          </span>
          {!isUser && !isError && (
            <div style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.2s" }}>
              <CopyBtn text={plainText} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SEND BUTTON STATES
───────────────────────────────────────────── */
function SendBtn({ loading, canSend, onClick, justSent }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || !canSend}
      style={{
        width: 40, height: 40, borderRadius: "var(--r-lg)",
        border: "none", flexShrink: 0, cursor: canSend && !loading ? "pointer" : "default",
        background: canSend || loading ? "var(--red)" : "var(--bg3)",
        color: canSend || loading ? "#fff" : "var(--ink4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.22s cubic-bezier(.16,1,.3,1)",
        boxShadow: canSend && !loading ? "var(--shadow-red)" : "none",
        transform: "scale(1)",
      }}
      onMouseEnter={e => { if (canSend && !loading) e.currentTarget.style.transform = "scale(1.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {justSent ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" style={{ strokeDasharray: 30, strokeDashoffset: 0, animation: "checkDraw 0.35s ease-out" }} />
        </svg>
      ) : loading ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <circle cx="12" cy="12" r="9" strokeOpacity=".25"/>
          <path d="M12 3 A9 9 0 0 1 21 12" style={{ animation: "spin 0.9s linear infinite", transformOrigin: "center" }}/>
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────
   WELCOME / EMPTY STATE HERO
───────────────────────────────────────────── */
function EmptyHero({ onChip, loading }) {
  return (
    <div className="fade-anim" style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "32px 24px 24px", textAlign: "center",
    }}>
      {/* Decorative shield */}
      <div style={{
        width: 80, height: 80, borderRadius: 22,
        background: "linear-gradient(145deg, #C8102E 0%, #8E0B1F 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 24, boxShadow: "0 16px 48px rgba(200,16,46,.3), 0 4px 12px rgba(200,16,46,.15)",
      }}>
        <svg width="42" height="50" viewBox="0 0 38 46" fill="none">
          <path d="M19 3 L33 9 L33 27 Q33 38 19 44 Q5 38 5 27 L5 9 Z" fill="none" stroke="white" strokeWidth="1.8"/>
          <rect x="12" y="20" width="14" height="9" rx="1.5" fill="none" stroke="white" strokeWidth="1.3"/>
          <line x1="19" y1="20" x2="19" y2="29" stroke="white" strokeWidth="1.1"/>
          <path d="M19 6 Q22 10 19 14 Q16 10 19 6Z" fill="white"/>
          <circle cx="9" cy="16" r="1.2" fill="white"/>
          <circle cx="29" cy="16" r="1.2" fill="white"/>
        </svg>
      </div>

      <h1 style={{
        fontFamily: "var(--font-display)", fontWeight: 400,
        fontSize: 30, lineHeight: 1.2, color: "var(--ink)",
        marginBottom: 10, letterSpacing: "-.3px",
      }}>
        What can I help you<br />
        <em style={{ color: "var(--red)" }}>discover today?</em>
      </h1>

      <p style={{
        fontSize: 14, color: "var(--ink3)", maxWidth: 340,
        lineHeight: 1.75, marginBottom: 32,
      }}>
        Your AI-powered campus guide for JECRC University — admissions, placements, programs, and more.
      </p>

      {/* Horizontal scrollable chips */}
      <div style={{
        display: "flex", gap: 10, overflowX: "auto", width: "100%",
        paddingBottom: 4, justifyContent: "center", flexWrap: "wrap",
      }}>
        {CHIPS.map((c, i) => (
          <button
            key={c.label}
            onClick={() => onChip(c.q)}
            disabled={loading}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 16px",
              borderRadius: "var(--r-full)",
              border: "1.5px solid var(--line2)",
              background: "var(--surface)",
              color: "var(--ink2)", fontSize: 13, fontWeight: 500,
              cursor: "pointer", whiteSpace: "nowrap",
              fontFamily: "var(--font-body)",
              transition: "all 0.22s cubic-bezier(.16,1,.3,1)",
              boxShadow: "var(--shadow-sm)",
              animation: `slideUp 0.35s cubic-bezier(.16,1,.3,1) ${i * 0.05}s both`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--red)";
              e.currentTarget.style.color = "var(--red)";
              e.currentTarget.style.background = "var(--red-glow)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(200,16,46,.14)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--line2)";
              e.currentTarget.style.color = "var(--ink2)";
              e.currentTarget.style.background = "var(--surface)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            }}
          >
            <span style={{ fontSize: 16 }}>{c.icon}</span>
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ABOUT PAGE
───────────────────────────────────────────── */
function AboutPage() {
  return (
    <div className="fade-anim" style={{
      flex: 1, overflowY: "auto", padding: "32px 28px 40px",
    }}>
      {/* Hero band */}
      <div style={{
        background: "linear-gradient(135deg, var(--red) 0%, #8E0B1F 100%)",
        borderRadius: "var(--r-lg)", padding: "32px 28px", marginBottom: 28,
        position: "relative", overflow: "hidden",
      }}>
        {/* BG texture lines */}
        <svg style={{ position:"absolute", right:0, top:0, opacity:.08 }} width="200" height="140" viewBox="0 0 200 140">
          {[0,1,2,3,4,5,6,7].map(i => <line key={i} x1={i*30-40} y1="0" x2={i*30+80} y2="140" stroke="white" strokeWidth="1.5"/>)}
        </svg>
        <JECRCLogo size={28} />
        <p style={{
          fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400,
          color: "white", marginTop: 16, marginBottom: 8, lineHeight: 1.3,
        }}>
          Your Campus Intelligence<br />Assistant
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,.75)", lineHeight: 1.7, maxWidth: 380 }}>
          JECRC GPT is an AI-powered chatbot built to answer every question prospective and current students have about JECRC University — instantly, accurately, 24/7.
        </p>
      </div>

      {/* What I know */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 20,
          color: "var(--ink)", marginBottom: 16, letterSpacing: "-.2px",
        }}>What I know</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            ["🎓","Admissions","Eligibility, dates, process, documents"],
            ["💼","Placements","Stats, recruiters, packages, cell contacts"],
            ["🏛️","Campus","Facilities, hostels, food, sports, clubs"],
            ["📚","Programs","B.Tech, MBA, MCA, M.Tech courses & fees"],
            ["🏅","Scholarships","Merit, need-based, sports, government schemes"],
            ["📞","Contact","Offices, faculty, departments, map"],
          ].map(([icon, title, sub]) => (
            <div key={title} style={{
              background: "var(--surface)", border: "1px solid var(--line2)",
              borderRadius: "var(--r-md)", padding: "14px 16px",
              boxShadow: "var(--shadow-sm)",
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 2 }}>{title}</div>
              <div style={{ fontSize: 12, color: "var(--ink3)", lineHeight: 1.55 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 20,
          color: "var(--ink)", marginBottom: 16,
        }}>Official links</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ABOUT_LINKS.map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px", background: "var(--surface)",
                border: "1px solid var(--line2)", borderRadius: "var(--r-md)",
                color: "var(--ink2)", fontSize: 13, fontWeight: 500,
                textDecoration: "none", boxShadow: "var(--shadow-sm)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--red)";
                e.currentTarget.style.color = "var(--red)";
                e.currentTarget.style.background = "var(--red-glow)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--line2)";
                e.currentTarget.style.color = "var(--ink2)";
                e.currentTarget.style.background = "var(--surface)";
              }}
            >
              <span>{l.icon} &nbsp; {l.label}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          ))}
        </div>
      </div>

      {/* Address */}
      <div style={{
        background: "var(--bg2)", border: "1px solid var(--line)",
        borderRadius: "var(--r-md)", padding: "16px 18px",
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--red)", marginBottom: 6, letterSpacing: ".5px", textTransform: "uppercase" }}>Campus Address</div>
        <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.7 }}>
          Plot No. IS-2036 to IS-2039, Ramchandrapura Industrial Area<br />
          Vidhani, Sitapura Extension, Jaipur, Rajasthan 303905<br />
          📞 +91-141-2770070 &nbsp;|&nbsp; 📧 info@jecrcuniversity.edu.in
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────── */
function Sidebar({ open, sessions, activeId, onSelect, onNew, onClose, page, onPage }) {
  return (
    <>
      {/* Backdrop on mobile */}
      {open && (
        <div onClick={onClose} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.35)",
          zIndex: 40, display: "none",
        }} />
      )}

      <aside style={{
        width: open ? 252 : 0,
        flexShrink: 0,
        overflow: "hidden",
        transition: "width 0.32s cubic-bezier(.16,1,.3,1)",
        background: "var(--bg2)",
        borderRight: "1px solid var(--line)",
        display: "flex",
        flexDirection: "column",
        zIndex: 10,
      }}>
        <div style={{ minWidth: 252, display: "flex", flexDirection: "column", height: "100%", padding: "16px 0" }}>

          {/* Logo in sidebar */}
          <div style={{ padding: "0 16px 16px", borderBottom: "1px solid var(--line)" }}>
            <JECRCLogo size={26} />
          </div>

          {/* New chat */}
          <div style={{ padding: "12px 12px 8px" }}>
            <button
              onClick={onNew}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 9,
                padding: "10px 14px", borderRadius: "var(--r-md)",
                border: "1.5px solid var(--red)", background: "var(--red-glow)",
                color: "var(--red)", fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "var(--font-body)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--red)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--red-glow)"; e.currentTarget.style.color = "var(--red)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Chat
            </button>
          </div>

          {/* Nav items */}
          <div style={{ padding: "0 12px 8px" }}>
            {[
              { id: "chat",  label: "Chat",  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
              { id: "about", label: "About", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> },
            ].map(nav => (
              <button key={nav.id} onClick={() => onPage(nav.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 9,
                  padding: "9px 12px", borderRadius: 9,
                  border: "none",
                  background: page === nav.id ? "var(--red-glow2)" : "transparent",
                  color: page === nav.id ? "var(--red)" : "var(--ink3)",
                  fontSize: 13, fontWeight: 500, cursor: "pointer",
                  fontFamily: "var(--font-body)", transition: "all 0.18s",
                  marginBottom: 2,
                }}
                onMouseEnter={e => { if (page !== nav.id) { e.currentTarget.style.background = "var(--bg3)"; e.currentTarget.style.color = "var(--ink2)"; } }}
                onMouseLeave={e => { if (page !== nav.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink3)"; } }}
              >
                {nav.icon} {nav.label}
              </button>
            ))}
          </div>

          {/* History */}
          {sessions.length > 0 && (
            <div style={{ flex: 1, overflowY: "auto", padding: "0 12px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ink4)", letterSpacing: "1px", textTransform: "uppercase", padding: "8px 4px 6px" }}>History</div>
              {sessions.map(s => (
                <button key={s.id} onClick={() => onSelect(s.id)}
                  style={{
                    width: "100%", textAlign: "left",
                    padding: "8px 10px", borderRadius: 9,
                    border: "none",
                    background: s.id === activeId ? "var(--red-glow2)" : "transparent",
                    color: s.id === activeId ? "var(--red)" : "var(--ink3)",
                    fontSize: 12.5, fontWeight: 400, cursor: "pointer",
                    fontFamily: "var(--font-body)", transition: "all 0.18s",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    marginBottom: 2,
                  }}
                  onMouseEnter={e => { if (s.id !== activeId) { e.currentTarget.style.background = "var(--bg3)"; e.currentTarget.style.color = "var(--ink2)"; } }}
                  onMouseLeave={e => { if (s.id !== activeId) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink3)"; } }}
                >
                  💬 {s.title}
                </button>
              ))}
            </div>
          )}

          {/* Footer */}
          <div style={{ padding: "12px 16px 0", borderTop: "1px solid var(--line)", marginTop: "auto" }}>
            <div style={{ fontSize: 11, color: "var(--ink4)", lineHeight: 1.6 }}>
              JECRC University · Jaipur<br />Powered by AI
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ─────────────────────────────────────────────
   AUTO-RESIZE TEXTAREA
───────────────────────────────────────────── */
function AutoTextarea({ value, onChange, onSend, disabled, focused, setFocused }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder="Ask about JECRC University…"
      disabled={disabled}
      rows={1}
      style={{
        flex: 1, background: "transparent", border: "none", outline: "none",
        color: "var(--ink)", fontSize: 14, fontFamily: "var(--font-body)",
        fontWeight: 400, lineHeight: 1.6, padding: "10px 0",
        caretColor: "var(--red)", resize: "none", overflowY: "hidden",
        minHeight: 42, maxHeight: 120,
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
const mkSession = () => ({ id: Date.now(), title: "New conversation", messages: [] });

export default function App() {
  injectCSS();

  const [dark, setDark] = useState(() => localStorage.getItem("jg-theme") === "dark");
  const [sideOpen, setSideOpen] = useState(true);
  const [page, setPage] = useState("chat");
  const [sessions, setSessions] = useState(() => [mkSession()]);
  const [activeId, setActiveId] = useState(() => sessions[0]?.id ?? null);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [justSent, setJustSent] = useState(false);
  const [focused, setFocused] = useState(false);
  const endRef = useRef(null);

  // active session
  const activeSession = sessions.find(s => s.id === activeId) ?? sessions[0];
  const msgs = activeSession?.messages ?? [];
  const hasConvo = msgs.length > 0;

  // theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("jg-theme", dark ? "dark" : "light");
  }, [dark]);

  // scroll
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  // update session messages helper
  const updateSession = (id, fn) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...fn(s) } : s));
  };

  const newChat = () => {
    const s = mkSession();
    setSessions(p => [s, ...p]);
    setActiveId(s.id);
    setPage("chat");
    setQ("");
  };

  const send = useCallback(async (text) => {
    const val = (text ?? q).trim();
    if (!val || loading) return;

    const uid = Date.now();
    const userMsg = { id: uid, role: "user", text: val, ts: new Date() };

    // update session title from first message
    setSessions(prev => prev.map(s => {
      if (s.id !== activeId) return s;
      const title = s.messages.length === 0 ? val.slice(0, 38) + (val.length > 38 ? "…" : "") : s.title;
      return { ...s, title, messages: [...s.messages, userMsg] };
    }));

    setQ("");
    setLoading(true);
    setPage("chat");

    try {
      const res = await fetch("https://jecrc-gpt.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: val }),
      });
      if (!res.ok) throw { type: "server", message: `Server error (${res.status})` };
      const data = await res.json();
      const botMsg = {
        id: uid + 1, role: "bot", ts: new Date(),
        text: Array.isArray(data.response) ? data.response.join("\n") : data.response,
      };
      updateSession(activeId, s => ({ messages: [...s.messages, botMsg] }));
      setJustSent(true);
      setTimeout(() => setJustSent(false), 1400);
    } catch (err) {
      updateSession(activeId, s => ({
        messages: [...s.messages, {
          id: uid + 1, role: "bot", isError: true, ts: new Date(),
          text: err.type ? `❌ ${err.message}` : "⚠️ Connection error — please check your network and try again.",
        }]
      }));
    } finally {
      setLoading(false);
    }
  }, [q, loading, activeId]);

  const WELCOME_MSG = { id: 0, role: "bot", text: WELCOME_TEXT, ts: new Date(0) };

  return (
    <div style={{
      display: "flex", height: "100dvh",
      maxWidth: 1080, margin: "0 auto",
      background: "var(--bg)",
      borderLeft: "1px solid var(--line)", borderRight: "1px solid var(--line)",
    }}>

      {/* SIDEBAR */}
      <Sidebar
        open={sideOpen}
        sessions={sessions.filter(s => s.messages.length > 0)}
        activeId={activeId}
        onSelect={id => { setActiveId(id); setPage("chat"); }}
        onNew={newChat}
        onClose={() => setSideOpen(false)}
        page={page}
        onPage={p => { setPage(p); }}
      />

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

        {/* ── HEADER ── */}
        <header style={{
          flexShrink: 0, height: 58,
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
          borderBottom: "1px solid var(--line)",
          background: "var(--bg)",
          position: "sticky", top: 0, zIndex: 30,
        }}>
          {/* Left: burger + logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setSideOpen(o => !o)}
              style={{
                width: 36, height: 36, borderRadius: "var(--r-sm)",
                border: "1px solid var(--line2)", background: "var(--surface)",
                cursor: "pointer", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 4,
                padding: "8px 9px", transition: "border-color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--red)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--line2)"}
              aria-label="Toggle sidebar"
            >
              {[0,1,2].map(i => (
                <span key={i} style={{ display: "block", width: 15, height: 1.5, background: "var(--ink3)", borderRadius: 2 }} />
              ))}
            </button>

            <div style={{ width: 1, height: 22, background: "var(--line2)" }} />
            <JECRCMark size={32} />
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 400, color: "var(--ink)", lineHeight: 1.2, letterSpacing: "-.2px" }}>JECRC GPT</div>
              <div style={{ fontSize: 10.5, color: "var(--ink4)", fontWeight: 400, letterSpacing: ".3px" }}>Campus Assistant</div>
            </div>
          </div>

          {/* Right: status + new chat + theme */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Status */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 11px", borderRadius: "var(--r-full)",
              border: "1px solid var(--line2)", background: "var(--surface)",
              fontSize: 12, fontWeight: 500, color: "var(--success)",
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "var(--success)", display: "block",
                boxShadow: "0 0 0 2.5px rgba(42,122,74,.18)",
              }} />
              Online
            </div>

            {/* New chat */}
            <button onClick={newChat} style={{
              height: 34, padding: "0 14px",
              borderRadius: "var(--r-md)",
              border: "1px solid var(--line2)", background: "var(--surface)",
              color: "var(--ink2)", fontSize: 12.5, fontWeight: 500,
              cursor: "pointer", fontFamily: "var(--font-body)",
              display: "flex", alignItems: "center", gap: 6,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.background = "var(--red-glow)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line2)"; e.currentTarget.style.color = "var(--ink2)"; e.currentTarget.style.background = "var(--surface)"; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New chat
            </button>

            {/* Theme toggle */}
            <button onClick={() => setDark(d => !d)} style={{
              width: 36, height: 36, borderRadius: "var(--r-sm)",
              border: "1px solid var(--line2)", background: "var(--surface)",
              cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--red)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--line2)"}
            title={dark ? "Light mode" : "Dark mode"}
            >
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {/* ── ABOUT PAGE ── */}
        {page === "about" && <AboutPage />}

        {/* ── CHAT PAGE ── */}
        {page === "chat" && (
          <>
            <main style={{
              flex: 1, overflowY: "auto", overflowX: "hidden",
              padding: "20px 24px 8px",
              display: "flex", flexDirection: "column",
            }}>
              {/* Always show welcome */}
              <Message msg={WELCOME_MSG} prev={null} />

              {/* Empty hero */}
              {!hasConvo && <EmptyHero onChip={text => send(text)} loading={loading} />}

              {/* Messages */}
              {hasConvo && (
                <div style={{ display: "flex", flexDirection: "column", marginTop: 12 }}>
                  {msgs.map((m, i) => (
                    <Message key={m.id} msg={m} prev={i === 0 ? WELCOME_MSG : msgs[i - 1]} />
                  ))}
                </div>
              )}

              {/* Typing indicator */}
              {loading && (
                <div className="msg-anim" style={{ display: "flex", alignItems: "flex-end", gap: 10, marginTop: 18 }}>
                  <BotAvatarSmall />
                  <div style={{
                    padding: "12px 16px",
                    borderRadius: "4px 18px 18px 18px",
                    background: "var(--surface)",
                    border: "1px solid var(--line2)",
                    boxShadow: "var(--shadow-sm)",
                  }}>
                    <TypingDots />
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </main>

            {/* ── INPUT AREA ── */}
            <footer style={{
              flexShrink: 0, padding: "12px 20px 20px",
              borderTop: "1px solid var(--line)", background: "var(--bg)",
            }}>
              <div style={{
                display: "flex", alignItems: "flex-end", gap: 10,
                background: "var(--surface)",
                border: `1.5px solid ${focused ? "var(--red)" : "var(--line2)"}`,
                borderRadius: "var(--r-xl)", padding: "6px 8px 6px 18px",
                transition: "border-color 0.25s, box-shadow 0.25s",
                boxShadow: focused
                  ? "0 0 0 3.5px var(--red-glow), var(--shadow-md)"
                  : "var(--shadow-sm)",
              }}>
                <AutoTextarea
                  value={q}
                  onChange={setQ}
                  onSend={() => send()}
                  disabled={loading}
                  focused={focused}
                  setFocused={setFocused}
                />
                <SendBtn
                  loading={loading}
                  canSend={!!q.trim()}
                  onClick={() => send()}
                  justSent={justSent}
                />
              </div>

              {/* hint */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, marginTop: 9,
              }}>
                <div style={{ flex: 1, height: "0.5px", background: "var(--line)" }} />
                <span style={{ fontSize: 11, color: "var(--ink4)", fontWeight: 400, whiteSpace: "nowrap" }}>
                  Enter to send · Shift+Enter for new line
                </span>
                <div style={{ flex: 1, height: "0.5px", background: "var(--line)" }} />
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
