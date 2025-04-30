const express = require("express");
const { classifyJob, trainNaiveBayes } = require("../utils/naiveBayes");

exports.trainModel = async (req, res) => {
  try {
    await trainNaiveBayes();
    res.json({ message: "Training completed successfully." });
  } catch (error) {
    console.error("Training error:", error);
    res.status(500).json({ error: "Training failed." });
  }
};

exports.classifyText = (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required." });
    }

    const scores = classifyJob(text);

    // Convert object to array, sort by score DESC (higher = better), and slice top 3
    const topCategories = Object.entries(scores)
      .sort((a, b) => b[1] - a[1]) // sort by score descending
      .slice(0, 3) // take top 3
      .map(([name, score]) => ({ name, score }));

    res.json({ categories: topCategories });
  } catch (error) {
    console.error("Classification error:", error);
    res.status(500).json({ error: "Classification failed." });
  }
};
