const fs = require('fs');
const path = require('path');

// folder containing all cleaned files
const folderPath = 'data/cleaned';

// user query
const query = "randomxyz".toLowerCase();

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

// show top 5 results
if (results.length > 0) {
  console.log("Answer:\n");

  console.log("Based on the available JECRC University's data, here is what I found:\n");

  results.slice(0, 3).forEach((res, i) => {
    console.log(`${i + 1}. ${res.text}`);
    console.log(`Source: ${res.file}\n`);
  });

} else {
  console.log("Sorry, I currently have limited information on this topic. My knowledge base is still being updated.");
}