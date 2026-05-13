const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const folderPath = path.join(__dirname, '../data/cleaned');

function getCleanedFiles() {
  return fs.readdirSync(folderPath);
}

function searchFiles(queryWords) {
  let results = [];
  const files = getCleanedFiles();

  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split('\n');

    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      const score = queryWords.filter(word =>
        lowerLine.includes(word)
      ).length;

      if (score > 0) {
        results.push({ text: line.trim(), score });
      }
    });
  });

  return results;
}

function cleanResults(results) {
  return results
    .sort((a, b) => b.score - a.score)
    .map(r => r.text)
    .filter(line =>
      line.length > 20 &&
      line.length < 300 &&
      !line.includes("Note: This calendar") &&
      !line.includes("Always verify") &&
      !line.includes("For department HOD") &&
      !line.includes("For placements contact") &&
      !line.includes("Results are declared on the student portal")
    );
}

async function getAnswer(query) {
  const queryWords = query.toLowerCase().split(" ");
  const results = searchFiles(queryWords);
  const unique = [...new Set(cleanResults(results))];
  const topResults = unique.slice(0, 8);

  console.log('Query:', query);
  console.log('Results found:', topResults.length);
  console.log('Top results:', topResults);

  if (topResults.length === 0) {
    return ["I currently have limited information on this topic. I'm being updated regularly!"];
  }

  const context = topResults.join('\n');

  const prompt = `You are JECRC GPT, a helpful assistant for JECRC University students.
  
Using ONLY the information below, answer the student's question in a friendly and clear way.
If the information doesn't fully answer the question, say so honestly.

Information:
${context}

Student's question: ${query}

Answer:`;

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(prompt);
  const response = result.response.text();

  return [response];
}

module.exports = { getAnswer };