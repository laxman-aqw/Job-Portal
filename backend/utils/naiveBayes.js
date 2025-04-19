// utils/naiveBayes.js
const _ = require("lodash");
let categoryWordCounts = {};
let categoryCounts = {};
let totalWords = 0;

async function trainNaiveBayes() {
  // Fetch training data from MongoDB
  const JobRoleCategory = require("../models/JobRoleCategory");
  const trainingData = await JobRoleCategory.find();
  categoryWordCounts = {};
  categoryCounts = {};
  totalWords = 0;

  // Loop through training data to calculate word frequencies
  trainingData.forEach(({ text, category }) => {
    const words = text.toLowerCase().split(/\s+/);

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

// Classify a new job description
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

  return scores; // Return all scores
}

// function classifyJob(text) {
//   const words = text.toLowerCase().split(/\s+/);
//   let maxCategory = null;
//   let maxProbability = -Infinity;

//   Object.keys(categoryCounts).forEach((category) => {
//     let probability = Math.log(categoryCounts[category] / totalWords); // Prior probability

//     words.forEach((word) => {
//       const wordCount = categoryWordCounts[category][word] || 0;
//       const wordProbability = Math.log((wordCount + 1) / (totalWords + 1)); // Laplace smoothing
//       probability += wordProbability;
//     });

//     if (probability > maxProbability) {
//       maxProbability = probability;
//       maxCategory = category;
//     }
//   });

//   return maxCategory;
// }

module.exports = { trainNaiveBayes, classifyJob };
