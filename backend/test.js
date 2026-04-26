const fs = require('fs');
const path = require('path');
const readline = require('readline');

// folder containing all cleaned files
const folderPath = 'data/cleaned';

// user query
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Ask something about JECRC: ", function(userQuery) {

  const query = userQuery.toLowerCase();

  const folderPath = 'data/cleaned';
  const files = fs.readdirSync(folderPath);

  let results = [];

  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split('\n');

    lines.forEach(line => {
      if (line.toLowerCase().includes(query)) {
        results.push({
          file: file,
          text: line
        });
      }
    });
  });

  if (results.length > 0) {
    console.log("\nAnswer:\n");
    console.log("Based on available data:\n");

    results.slice(0, 3).forEach((res, i) => {
      console.log(`${i + 1}. ${res.text}`);
      console.log(`Source: ${res.file}\n`);
    });

  } else {
    console.log("\nSorry, I don’t have that info yet.");
  }

  rl.close();
});