const { getAnswer } = require('./chatbot');
const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// test route
app.get('/', (req, res) => {
  res.send("JECRCGPT API is running 🚀");
});
app.post('/chat', async (req, res) => {
  const userQuery = req.body.query;

  if (!userQuery) {
    return res.status(400).json({ error: "Query is required" });
  }

  const answer = await getAnswer(userQuery);

  res.json({
    response: answer
  });
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});