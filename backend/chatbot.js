const fs = require('fs');
const path = require('path');

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
        results.push({
          text: line.trim(),
          score
        });
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
      line.length > 40 &&
      line.length < 220 &&
      !line.includes("|") &&
      !line.includes("##")
    );
}

function getAnswer(query) {
  const queryWords = query.toLowerCase().split(" ");
  const results = searchFiles(queryWords);

  const unique = [...new Set(cleanResults(results))];
  const topResults = unique.slice(0, 3);

  if (topResults.length > 0) {
    return topResults;
  } else {
    return ["Sorry, I don’t have enough information on this topic yet."];
  }
}

module.exports = { getAnswer };