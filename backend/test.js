const fs = require('fs');

// 1) Read file
const data = fs.readFileSync('data/cleaned/courses_cleaned.txt', 'utf-8');

// 2) Split into lines
const lines = data.split('\n');

// 3) Query (simulate user input)
const query = "engineering".toLowerCase();

// 4) Filter matching lines
const results = lines.filter(line =>
  line.toLowerCase().includes(query)
);

// 5) Output
if (results.length > 0) {
  console.log("Relevant lines:");
  results.forEach((line, i) => {
    console.log(`${i + 1}. ${line}`);
  });
} else {
  console.log("No relevant info found");
}