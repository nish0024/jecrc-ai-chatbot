const fs = require('fs');
const path = require('path');

// folder containing all cleaned files
const folderPath = 'data/cleaned';

// user query
const query = "scholarship".toLowerCase();

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
  console.log("Top matches:\n");

  results.slice(0, 5).forEach((res, i) => {
    console.log(`${i + 1}. [${res.file}] ${res.text}`);
  });

} else {
  console.log("No relevant info found");
}