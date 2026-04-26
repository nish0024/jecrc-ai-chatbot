const fs = require('fs');
const path = require('path');
const readline = require('readline');

const folderPath = 'data/cleaned';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Ask something about JECRC: ", function(userQuery) {

  const query = userQuery.toLowerCase();
  const queryWords = query.split(" ");

  const files = fs.readdirSync(folderPath);

  let results = [];

  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split('\n');

    lines.forEach(line => {
      const lowerLine = line.toLowerCase();

      const isMatch = queryWords.some(word =>
        lowerLine.includes(word)
      );

     if (isMatch) {
  const score = queryWords.filter(word =>
    lowerLine.includes(word)
  ).length;

  results.push({
    file: file,
    text: line.trim(),
    score: score
  });
}
    });
  });

  console.log("\n🤖 JECRCGPT:\n");

  results.sort((a, b) => b.score - a.score);
  if (results.length > 0) {

    const cleanResults = results
      .map(r => r.text)
      .filter(line =>
        line.length > 40 &&
        line.length < 220 &&
        !line.includes("|") &&   // remove tables
        !line.includes("##")     // remove headings
      );

    const unique = [...new Set(cleanResults)];

    unique.slice(0, 3).forEach((line, i) => {
      console.log(`${i + 1}. ${line}\n`);
    });

  } else {
    console.log("Sorry, I don’t have enough information on this topic yet.");
    console.log("I’m still being trained and improving every day.");
    console.log("Try asking about courses, admissions, hostel, or fees 😊\n");
  }

  rl.close();
});