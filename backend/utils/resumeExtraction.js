const axios = require("axios");
const pdfParse = require("pdf-parse");

const fetchAndExtractText = async (pdfUrl) => {
  try {
    const response = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
    });

    const dataBuffer = Buffer.from(response.data, "binary");
    const pdfData = await pdfParse(dataBuffer);

    return pdfData.text;
  } catch (error) {
    console.error("Failed to extract text from resume:", error.message);
    throw error;
  }
};

module.exports = { fetchAndExtractText };
