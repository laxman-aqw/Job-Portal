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

// Classify text input (e.g., job description or resume)
exports.classifyText = (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required." });
    }

    const category = classifyJob(text);
    res.json({ category });
  } catch (error) {
    console.error("Classification error:", error);
    res.status(500).json({ error: "Classification failed." });
  }
};
