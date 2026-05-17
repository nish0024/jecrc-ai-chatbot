import { useState, useRef, useEffect, useCallback } from 'react';

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Sora:wght@600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body, #root {
  height: 100%;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ─────────── LIGHT MODE ─────────── */
:root {
  color-scheme: light;
  --bg-primary:       #ffffff;
  --bg-secondary:     #f8fafc;
  --bg-tertiary:      #f1f5f9;
  --bg-quaternary:    #e2e8f0;
  --surface:          #ffffff;
  --surface-alt:      #f8fafc;
  --text-primary:     #0f172a;
  --text-secondary:   #475569;
  --text-tertiary:    #64748b;
  --text-inverse:     #ffffff;
  --border-default:   #e2e8f0;
  --border-light:     #f1f5f9;
  --brand-primary:    #C8102E;
  --brand-dark:       #8B0A1F;
  --brand-light:      #E8384F;
  --brand-bg:         #FDF0F2;
  --brand-bg-subtle:  #FEF5F7;
  --accent-success:   #10b981;
  --accent-warning:   #f59e0b;
  --accent-error:     #ef4444;
  --accent-info:      #3b82f6;
  --shadow-xs:        0 1px 2px rgba(15,23,42,0.04);
  --shadow-sm:        0 1px 3px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04);
  --shadow-md:        0 4px 6px rgba(15,23,42,0.1), 0 2px 4px rgba(15,23,42,0.06);
  --shadow-lg:        0 10px 15px rgba(15,23,42,0.1), 0 4px 6px rgba(15,23,42,0.05);
  --shadow-xl:        0 20px 25px rgba(15,23,42,0.1), 0 8px 10px rgba(15,23,42,0.04);
  --shadow-brand:     0 4px 20px rgba(200,16,46,0.2);
  --radius-sm:        6px;
  --radius-md:        12px;
  --radius-lg:        16px;
  --radius-xl:        24px;
  --radius-full:      9999px;
}

/* ─────────── DARK MODE ─────────── */
html[data-theme="dark"] {
  color-scheme: dark;
  --bg-primary:       #0f172a;
  --bg-secondary:     #1a2540;
  --bg-tertiary:      #243553;
  --bg-quaternary:    #334155;
  --surface:          #1a2540;
  --surface-alt:      #0f172a;
  --text-primary:     #f8fafc;
  --text-secondary:   #cbd5e1;
  --text-tertiary:    #94a3b8;
  --text-inverse:     #0f172a;
  --border-default:   #334155;
  --border-light:     #243553;
  --brand-primary:    #E8384F;
  --brand-dark:       #C8102E;
  --brand-light:      #F25C7A;
  --brand-bg:         #3A0F1A;
  --brand-bg-subtle:  #2D0B14;
  --accent-success:   #34d399;
  --accent-warning:   #fbbf24;
  --accent-error:     #f87171;
  --accent-info:      #60a5fa;
  --shadow-xs:        0 1px 2px rgba(0,0,0,0.3);
  --shadow-sm:        0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.2);
  --shadow-md:        0 4px 6px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2);
  --shadow-lg:        0 10px 15px rgba(0,0,0,0.4), 0 4px 6px rgba(0,0,0,0.2);
  --shadow-xl:        0 20px 25px rgba(0,0,0,0.4), 0 8px 10px rgba(0,0,0,0.2);
  --shadow-brand:     0 4px 20px rgba(232,56,79,0.25);
}

body, html, #root {
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

::selection { background: var(--brand-bg); color: var(--brand-dark); }
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { 
  background: var(--border-default); 
  border-radius: var(--radius-full);
  border: 2px solid var(--bg-primary);
}
::-webkit-scrollbar-thumb:hover { background: var(--text-tertiary); }

@keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes pop { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
@keyframes shimmer { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }

.message-enter { animation: slideIn 0.3s ease-out; }
.quick-action-enter { animation: slideIn 0.2s ease-out; }

.bot-message p { margin: 0 0 12px 0; line-height: 1.7; }
.bot-message p:last-child { margin-bottom: 0; }
.bot-message strong { font-weight: 700; color: var(--brand-primary); }
.bot-message em { font-style: italic; color: var(--text-secondary); }
.bot-message ul, .bot-message ol { margin: 12px 0; padding-left: 24px; }
.bot-message li { line-height: 1.7; margin-bottom: 6px; color: var(--text-secondary); }
.bot-message code {
  background: var(--bg-tertiary);
  color: var(--brand-primary);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
}

.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
`;

function injectCSS() {
  if (document.getElementById('jecrc-theme-css')) return;
  const style = document.createElement('style');
  style.id = 'jecrc-theme-css';
  style.textContent = GLOBAL_CSS;
  document.head.appendChild(style);
}

const WELCOME_MESSAGE = {
  id: 0,
  role: 'bot',
  text: "👋 **Welcome to JECRC GPT!**\n\nI'm your AI-powered campus assistant, here to help with everything JECRC University.\n\n**What I can help with:**\n- 📋 Admissions & Application Process\n- 💼 Placements & Career Opportunities\n- 🏢 Campus Life & Hostel Information\n- 🎓 Scholarships & Financial Aid\n- 📚 Academic Programs & Courses\n- 📞 General University Information\n\nJust ask me anything — I'm here 24/7!",
  ts: new Date(),
};

const QUICK_ACTIONS = [
  { emoji: '🎓', label: 'Admissions', query: 'Tell me about B.Tech admission requirements and the application process at JECRC University' },
  { emoji: '💼', label: 'Placements', query: 'What are the latest placement statistics and top recruiters at JECRC University?' },
  { emoji: '🏢', label: 'Campus Life', query: 'Tell me about campus facilities, hostel fees, and living on campus at JECRC' },
  { emoji: '🎁', label: 'Scholarships', query: 'What scholarship and financial aid options are available at JECRC University?' },
];

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function parseMarkdown(text) {
  const blocks = [];
  const lines = text.split('\n');
  let listItems = [];
  let paraLines = [];

  function flushPara() {
    if (paraLines.length === 0) return;
    const content = paraLines.join(' ').trim();
    if (content) blocks.push({ type: 'p', content });
    paraLines = [];
  }

  function flushList() {
    if (listItems.length === 0) return;
    blocks.push({ type: 'ul', items: [...listItems] });
    listItems = [];
  }

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed === '') { flushPara(); flushList(); return; }
    if (trimmed.match(/^[-•*]\s+/)) {
      flushPara();
      listItems.push(trimmed.replace(/^[-•*]\s+/, ''));
      return;
    }
    if (listItems.length > 0) flushList();
    paraLines.push(trimmed);
  });

  flushPara();
  flushList();
  return blocks;
}

function BoldText({ text }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>
      )}
    </>
  );
}

function BotMessageContent({ text }) {
  const blocks = parseMarkdown(text);
  return (
    <div className="bot-message">
      {blocks.map((block, i) => {
        if (block.type === 'ul') {
          return (
            <ul key={i}>
              {block.items.map((item, j) => (
                <li key={j}><BoldText text={item} /></li>
              ))}
            </ul>
          );
        }
        return <p key={i}><BoldText text={block.content} /></p>;
      })}
    </div>
  );
}

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 40,
        height: 40,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-default)',
        background: 'var(--bg-secondary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        color: 'var(--text-primary)',
      }}
      onMouseEnter={(e) => {
        e.target.style.background = 'var(--bg-tertiary)';
        e.target.style.borderColor = 'var(--brand-primary)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'var(--bg-secondary)';
        e.target.style.borderColor = 'var(--border-default)';
      }}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}

function Logo({ isDark }) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 'var(--radius-lg)',
        background: `linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-dark) 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        fontWeight: 800,
        color: 'white',
        boxShadow: 'var(--shadow-brand)',
        flexShrink: 0,
      }}
    >
      J
    </div>
  );
}

function BotAvatar() {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: 'var(--brand-bg-subtle)',
        border: '2px solid var(--brand-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: 18,
      }}
    >
      🤖
    </div>
  );
}

function UserAvatar() {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: `linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-light) 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: 'white',
        fontSize: 16,
        fontWeight: 700,
      }}
    >
      👤
    </div>
  );
}

function TypingIndicator() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        padding: '10px 14px',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        width: 'fit-content',
        border: '1px solid var(--border-light)',
      }}
    >
      {[0, 0.2, 0.4].map((delay, i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'var(--brand-primary)',
            animation: `pulse 1.2s ease-in-out ${delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Message({ msg, hideAvatar, prevRole }) {
  const isUser = msg.role === 'user';
  const isError = msg.isError === true;

  return (
    <div
      className="message-enter"
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 12,
        marginTop: prevRole && prevRole !== msg.role ? 16 : 8,
      }}
    >
      <div style={{ flexShrink: 0 }}>
        {hideAvatar ? <div style={{ width: 36 }} /> : isUser ? <UserAvatar /> : <BotAvatar />}
      </div>

      <div
        style={{
          maxWidth: '65%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isUser ? 'flex-end' : 'flex-start',
          gap: 6,
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            borderRadius: isUser
              ? 'var(--radius-lg) var(--radius-sm) var(--radius-lg) var(--radius-lg)'
              : 'var(--radius-sm) var(--radius-lg) var(--radius-lg) var(--radius-lg)',
            background: isError
              ? 'var(--accent-error)'
              : isUser
              ? 'var(--brand-primary)'
              : 'var(--bg-secondary)',
            color: isError
              ? 'white'
              : isUser
              ? 'white'
              : 'var(--text-secondary)',
            fontSize: 14,
            lineHeight: 1.7,
            fontWeight: 400,
            border: isError ? 'none' : isUser ? 'none' : '1px solid var(--border-default)',
            boxShadow: isUser ? 'var(--shadow-brand)' : isError ? 'var(--shadow-md)' : 'var(--shadow-sm)',
            wordBreak: 'break-word',
            transition: 'all 0.2s ease',
          }}
        >
          {isUser ? (
            <span>{msg.text}</span>
          ) : isError ? (
            <span>{msg.text}</span>
          ) : (
            <BotMessageContent text={msg.text} />
          )}
        </div>

        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginRight: isUser ? 0 : 4 }}>
          {formatTime(msg.ts)}
        </span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 32px 40px',
        textAlign: 'center',
        animation: 'fadeIn 0.5s ease-out',
      }}
    >
      <div
        style={{
          width: 90,
          height: 90,
          borderRadius: 'var(--radius-lg)',
          background: `linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-dark) 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 48,
          marginBottom: 28,
          boxShadow: 'var(--shadow-xl)',
          animation: 'float 3s ease-in-out infinite',
        }}
      >
        🎓
      </div>

      <h2
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 12,
          fontFamily: "'Sora', sans-serif",
          letterSpacing: '-0.5px',
        }}
      >
        Welcome to JECRC GPT
      </h2>

      <p
        style={{
          fontSize: 14,
          color: 'var(--text-tertiary)',
          marginBottom: 32,
          maxWidth: 380,
          lineHeight: 1.8,
        }}
      >
        Your AI-powered assistant for admissions, placements, campus life, and everything about JECRC University.
      </p>

      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {['🎓', '💼', '🏢', '📚'].map((emoji, i) => (
          <div
            key={i}
            style={{
              width: 50,
              height: 50,
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              animation: `slideIn 0.4s ease-out ${i * 0.1}s both`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  injectCSS();

  const [isDark, setIsDark] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const hasConvo = messages.length > 1;

  // Theme management
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('jecrc-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const saved = localStorage.getItem('jecrc-theme');
    if (saved === 'dark') setIsDark(true);
  }, []);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = useCallback(
    async (text) => {
      const q = (text ?? query).trim();
      if (!q || loading) return;

      const uid = Date.now();
      setMessages((p) => [...p, { id: uid, role: 'user', text: q, ts: new Date() }]);
      setQuery('');
      setLoading(true);

      try {
        const res = await fetch('http://localhost:5000/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw {
            type: 'server',
            message: errData.error || `Server error (${res.status})`,
          };
        }

        const data = await res.json();
        setMessages((p) => [
          ...p,
          {
            id: uid + 1,
            role: 'bot',
            text: Array.isArray(data.response) ? data.response.join('\n') : data.response,
            ts: new Date(),
          },
        ]);
      } catch (err) {
        const isNetwork = !err.type;
        setMessages((p) => [
          ...p,
          {
            id: uid + 1,
            role: 'bot',
            isError: true,
            text: isNetwork
              ? "⚠️ Connection error — Please check your network and try again."
              : `❌ ${err.message}`,
            ts: new Date(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [query, loading]
  );

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        maxWidth: 900,
        margin: '0 auto',
        background: 'var(--bg-primary)',
        borderLeft: '1px solid var(--border-light)',
        borderRight: '1px solid var(--border-light)',
        position: 'relative',
      }}
    >
      {/* ════════════════════ HEADER ════════════════════ */}
      <header
        style={{
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-light)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Logo isDark={isDark} />
            <div>
              <h1
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: 0,
                  fontFamily: "'Sora', sans-serif",
                  letterSpacing: '-0.3px',
                }}
              >
                JECRC GPT
              </h1>
              <p
                style={{
                  fontSize: 11,
                  color: 'var(--text-tertiary)',
                  margin: '3px 0 0 0',
                  fontWeight: 500,
                }}
              >
                Campus Assistant
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '6px 12px',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-full)',
                fontSize: 12,
                color: 'var(--accent-success)',
                fontWeight: 600,
                border: '1px solid var(--border-default)',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--accent-success)',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
              Online
            </div>

            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </div>
      </header>

      {/* ════════════════════ CHAT AREA ════════════════════ */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '24px 24px 16px',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-primary)',
        }}
      >
        {/* Welcome Message */}
        <div style={{ marginBottom: 20 }}>
          <Message msg={messages[0]} hideAvatar={false} prevRole={null} />
        </div>

        {/* Empty State */}
        {!hasConvo && <EmptyState />}

        {/* Conversation */}
        {hasConvo && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
            {messages.slice(1).map((msg, i, arr) => {
              const prev = i === 0 ? messages[0] : arr[i - 1];
              const hideAvatar = prev.role === msg.role;
              return (
                <Message
                  key={msg.id}
                  msg={msg}
                  hideAvatar={hideAvatar}
                  prevRole={prev.role}
                />
              );
            })}
          </div>
        )}

        {/* Typing Indicator */}
        {loading && (
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-end',
              marginTop: 16,
            }}
          >
            <div style={{ flexShrink: 0 }}>
              <BotAvatar />
            </div>
            <TypingIndicator />
          </div>
        )}

        <div ref={endRef} />
      </main>

      {/* ════════════════════ QUICK ACTIONS ════════════════════ */}
      {!hasConvo && (
        <div
          style={{
            padding: '0 24px 16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10,
            zIndex: 1,
          }}
        >
          {QUICK_ACTIONS.map((action, i) => (
            <button
              key={action.query}
              onClick={() => send(action.query)}
              disabled={loading}
              className="quick-action-enter"
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                animation: `slideIn 0.3s ease-out ${i * 0.08}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--brand-bg-subtle)';
                e.currentTarget.style.borderColor = 'var(--brand-primary)';
                e.currentTarget.style.color = 'var(--brand-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: 24 }}>{action.emoji}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ════════════════════ INPUT AREA ════════════════════ */}
      <footer
        style={{
          flexShrink: 0,
          padding: '16px 24px 24px',
          background: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-light)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 10,
            padding: '10px 16px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-secondary)',
            border: `1.5px solid ${focused ? 'var(--brand-primary)' : 'var(--border-default)'}`,
            transition: 'all 0.25s ease',
            boxShadow: focused ? '0 0 0 3px rgba(200, 16, 46, 0.08), var(--shadow-md)' : 'var(--shadow-sm)',
          }}
        >
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Ask about admissions, placements, campus life..."
            disabled={loading}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 14,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              padding: '10px 0',
              caretColor: 'var(--brand-primary)',
              resize: 'none',
              maxHeight: 120,
            }}
          />

          <button
            onClick={() => send()}
            disabled={loading || !query.trim()}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: 'none',
              background: query.trim() && !loading ? 'var(--brand-primary)' : 'var(--border-default)',
              color: query.trim() && !loading ? 'white' : 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: query.trim() && !loading ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (query.trim() && !loading) {
                e.currentTarget.style.background = 'var(--brand-dark)';
                e.currentTarget.style.boxShadow = 'var(--shadow-brand)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = query.trim() && !loading ? 'var(--brand-primary)' : 'var(--border-default)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        <div
          style={{
            fontSize: 11,
            color: 'var(--text-tertiary)',
            marginTop: 12,
            textAlign: 'center',
            fontWeight: 500,
            letterSpacing: '0.3px',
          }}
        >
          JECRC University · Jaipur Campus · Powered by AI
        </div>
      </footer>
    </div>
  );
}