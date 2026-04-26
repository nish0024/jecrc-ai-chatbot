const fs = require('fs');
const path = require('path');
const readline = require('readline');

const folderPath = 'data/cleaned';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
          file: file,
          text: line.trim(),
          score: score
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

function showAnswer(results) {
  console.log("\n🤖 JECRCGPT:\n");

  const unique = [...new Set(cleanResults(results))];
  const topResults = unique.slice(0, 3);

  if (topResults.length > 0) {
    console.log("Based on the available JECRC information:\n");

    topResults.forEach(line => {
      console.log(`- ${line}`);
    });

    console.log("\nPlease verify important details from the official university source.");
  } else {
    console.log("Sorry, I don’t have enough information on this topic yet.");
    console.log("I’m still being trained and improving every day.");
    console.log("Try asking about courses, admissions, hostel, or fees 😊");
  }
}

rl.question("Ask something about JECRC: ", function(userQuery) {
  const queryWords = userQuery.toLowerCase().split(" ");
  const results = searchFiles(queryWords);

  showAnswer(results);

  rl.close();
});