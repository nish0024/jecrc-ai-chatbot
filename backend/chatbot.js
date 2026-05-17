const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const folderPath = path.join(__dirname, '../data/cleaned');

// ── Stop words — don't use these as search keywords ─────────
const STOP_WORDS = new Set([
  'a','an','the','is','are','was','were','be','been','being',
  'have','has','had','do','does','did','will','would','could',
  'should','may','might','shall','can','need','dare','ought',
  'used','to','of','in','on','at','by','for','with','about',
  'against','between','into','through','during','before','after',
  'above','below','from','up','down','out','off','over','under',
  'again','further','then','once','what','which','who','whom',
  'this','that','these','those','am','i','me','my','myself','we',
  'our','you','your','he','she','it','they','them','his','her',
  'its','and','but','or','nor','so','yet','both','either',
  'neither','not','no','tell','give','show','know','want','get',
  'how','much','many','any','all','most','other','more','also',
  'just','than','too','very','please','hi','hello','hey'
]);

// ── Synonym map — expands query terms ───────────────────────
const SYNONYMS = {
  'fees':        ['fee', 'cost', 'charges', 'price', 'amount', 'payment'],
  'fee':         ['fees', 'cost', 'charges', 'price', 'amount'],
  'hostel':      ['dormitory', 'accommodation', 'residence', 'pg', 'room'],
  'btech':       ['b.tech', 'b tech', 'bachelor of technology', 'engineering'],
  'b.tech':      ['btech', 'b tech', 'bachelor of technology', 'engineering'],
  'mba':         ['master of business', 'management', 'pgdm'],
  'scholarship': ['scholarships', 'financial aid', 'merit', 'waiver', 'discount'],
  'placement':   ['placements', 'job', 'jobs', 'recruit', 'recruiters', 'hiring', 'campus drive', 'package', 'lpa'],
  'recruiter':   ['recruiters', 'companies', 'placement', 'hiring', 'employer'],
  'admission':   ['admissions', 'apply', 'application', 'enroll', 'enrollment', 'join', 'eligibility'],
  'exam':        ['exams', 'examination', 'test', 'mid term', 'midterm', 'end term'],
  'club':        ['clubs', 'society', 'societies', 'activity', 'activities', 'cultural'],
  'campus':      ['college', 'university', 'infrastructure', 'facilities', 'campus life'],
  'contact':     ['contacts', 'helpdesk', 'phone', 'email', 'number', 'reach'],
  'calendar':    ['schedule', 'dates', 'academic calendar', 'semester dates', 'holiday'],
};

// ── Read all cleaned files ───────────────────────────────────
function getCleanedFiles() {
  return fs.readdirSync(folderPath).filter(f => f.endsWith('.txt'));
}

// ── Expand query with synonyms ───────────────────────────────
function expandQuery(queryWords) {
  const expanded = new Set(queryWords);
  queryWords.forEach(word => {
    if (SYNONYMS[word]) {
      SYNONYMS[word].forEach(syn => expanded.add(syn));
    }
  });
  return [...expanded];
}

// ── Search all files ─────────────────────────────────────────
function searchFiles(queryWords) {
  const results = [];
  const files = getCleanedFiles();
  const expandedWords = expandQuery(queryWords);

  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split('\n');

    lines.forEach((line, index) => {
      const lowerLine = line.toLowerCase();

      const score = expandedWords.filter(word =>
        word.length > 1 && lowerLine.includes(word)
      ).length;

      if (score > 0 && line.trim().length > 20) {
        // Grab next 4 lines for context
        const contextLines = lines
          .slice(index, index + 5)
          .map(l => l.trim())
          .filter(l => l.length > 0)
          .join(' ');

        results.push({ text: contextLines, score, source: file });
      }
    });
  });

  return results;
}

// ── Noise lines to filter out ────────────────────────────────
const NOISE_PATTERNS = [
  'note: this calendar',
  'always verify',
  'for department hod',
  'for placements contact',
  'results are declared on the student portal',
  'last updated',
  'page |',
  '---',
  'source:',
  'disclaimer',
];

function isNoiseLine(text) {
  const lower = text.toLowerCase();
  return NOISE_PATTERNS.some(p => lower.includes(p));
}

// ── Clean and deduplicate results ────────────────────────────
function cleanResults(results) {
  const seen = new Set();

  return results
    .sort((a, b) => b.score - a.score)
    .map(r => r.text)
    .filter(line => {
      if (line.length < 20)    return false;
      if (isNoiseLine(line))   return false;

      // Deduplicate by first 60 chars
      const key = line.slice(0, 60).toLowerCase();
      if (seen.has(key))       return false;
      seen.add(key);

      return true;
    });
}

// ── Simple response cache ────────────────────────────────────
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCached(query) {
  const entry = cache.get(query);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    cache.delete(query);
    return null;
  }
  return entry.value;
}

function setCached(query, value) {
  cache.set(query, { value, ts: Date.now() });
}

// ── Main function ────────────────────────────────────────────
async function getAnswer(query) {
  // Normalize query for cache key
  const normalizedQuery = query.toLowerCase().trim();

  // Check cache first
  const cached = getCached(normalizedQuery);
  if (cached) {
    console.log('Cache hit:', normalizedQuery);
    return cached;
  }

  // Filter stop words, keep meaningful keywords
  const queryWords = normalizedQuery
    .split(/[\s,.\-?!]+/)
    .filter(w => w.length > 1 && !STOP_WORDS.has(w));

  console.log('Query:', query);
  console.log('Keywords:', queryWords);

  const results = searchFiles(queryWords);
  const cleaned = cleanResults(results);
  const topResults = cleaned.slice(0, 10);

  console.log('Results found:', topResults.length);

  // ── Fallback if nothing found ──────────────────────────────
  if (topResults.length === 0) {
    const fallback = [
      "Hmm, I don't have specific information on that yet. " +
      "My knowledge covers admissions, fees, scholarships, hostel, " +
      "placements, courses, clubs, and academic calendar.\n\n" +
      "For anything else, reach out directly:\n" +
      "- Email: admission@jecrcu.edu.in\n" +
      "- Phone: 1800-120-5616 (toll free)\n" +
      "- Website: www.jecrcu.edu.in"
    ];
    return fallback;
  }

  const context = topResults.join('\n');

  const prompt = `You are JECRC GPT — a friendly, intelligent AI assistant for JECRC University, Jaipur.

Your tone: natural, warm, helpful — like a knowledgeable senior student. Not robotic, not corporate.

==================================================
CRITICAL RULES — NEVER BREAK THESE
==================================================

1. NEVER invent facts, fees, statistics, names, or contacts not in the knowledge base.
2. NEVER use markdown: no **, no ##, no *, no ###. Use "-" for bullet points only.
3. IF the context contains a list (companies, clubs, courses, etc.) reproduce ALL items — do not summarize or cut the list short.
4. If information is missing, say so honestly and direct to official contact.
5. PLAIN TEXT ONLY. Clean spacing. Short paragraphs.

==================================================
RESPONSE STYLE
==================================================

- Sound like a helpful friend, not a brochure
- Use short paragraphs and "-" bullet points where useful
- If something is important, use CAPITALS (not bold)
- End naturally: suggest related topics the user might want to know

GOOD phrases:
- "So basically..."
- "The main thing to know is..."
- "From what I have here..."
- "If you're asking about X, then..."

AVOID:
- "Based on the provided context..."
- "According to the information given..."
- "I apologize..."
- Generic AI filler phrases

==================================================
FALLBACK BEHAVIOR
==================================================

If the answer is partially missing:
- Share what IS available
- Mention what's missing naturally
- Guide to: admission@jecrcu.edu.in or 1800-120-5616

==================================================
KNOWLEDGE BASE
==================================================

${context}

==================================================
STUDENT QUESTION
==================================================

${query}

==================================================
YOUR ANSWER
==================================================`;

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(prompt);
  const response = result.response.text();
  const answer = [response];

  // Store in cache
  setCached(normalizedQuery, answer);

  return answer;
}

module.exports = { getAnswer };