const fs = require('fs');

const data = fs.readFileSync('data/cleaned/courses_cleaned.txt', 'utf-8');

// convert to lowercase for easier matching
const text = data.toLowerCase();

// user query
const query = "engineering";

// check if text contains query
if (text.includes(query)) {
    console.log("Found relevant info:");
    console.log(data);
} else {
    console.log("No relevant info found");
}