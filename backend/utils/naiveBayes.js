// utils/naiveBayes.js
const _ = require("lodash");
let categoryWordCounts = {};
let categoryCounts = {};
let totalWords = 0;

const stopwords = new Set([
  "to",
  "have",
  "with",
  "and",
  "in",
  "on",
  "the",
  "a",
  "an",
  "for",
  "is",
  "be",
  "of",
  "as",
  "by",
  "at",
  "user",
  "friendly",
]);

const synonyms = {
  reactjs: "react",
  "react.js": "react",
  "redux.js": "redux",
  js: "javascript",
  nodejs: "node",
  tailwind: "tailwindcss",
  ux: "uiux",
  ui: "uiux",
  api: "backend",
};

function preprocess(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+]/gi, " ")
    .split(/\s+/)
    .filter((word) => word && !stopwords.has(word))
    .map((word) => synonyms[word] || word);
}

async function trainNaiveBayes() {
  const JobRoleCategory = require("../models/JobRoleCategory");
  const trainingData = await JobRoleCategory.find();
  categoryWordCounts = {};
  categoryCounts = {};
  totalWords = 0;

  trainingData.forEach(({ text, category }) => {
    const words = preprocess(text);

    if (!categoryWordCounts[category]) {
      categoryWordCounts[category] = {};
      categoryCounts[category] = 0;
    }

    categoryCounts[category] += 1;
    words.forEach((word) => {
      categoryWordCounts[category][word] =
        (categoryWordCounts[category][word] || 0) + 1;
      totalWords += 1;
    });
  });

  console.log("Training complete!");
}

// Classify
function classifyJob(text) {
  const words = text.toLowerCase().split(/\s+/);
  const scores = {};

  Object.keys(categoryCounts).forEach((category) => {
    let probability = Math.log(categoryCounts[category] / totalWords);

    words.forEach((word) => {
      const wordCount = categoryWordCounts[category][word] || 0;
      const wordProbability = Math.log((wordCount + 1) / (totalWords + 1));
      probability += wordProbability;
    });

    scores[category] = probability;
  });

  return scores;
}

module.exports = { trainNaiveBayes, classifyJob };
