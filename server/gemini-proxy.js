const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Gemini Chat Proxy
app.post("/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    // console.log("📥 Prompt:", prompt);
    // console.log("🔐 API Key:", process.env.GEMINI_API_KEY);

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          key: process.env.GEMINI_API_KEY,
        },
      }
    );

    console.log("✅ Gemini Response:", response.data);
    res.json(response.data);
  } catch (err) {
    console.error("❌ Gemini API Error:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }

    res.status(500).json({
      error: "Gemini API failed",
      detail: err?.response?.data || err.message,
    });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Gemini Proxy running at http://localhost:${PORT}`);
});
