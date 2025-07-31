import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/ask", async (req, res) => {
  // const userMessage = req.body.message;
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid or missing 'messages' in request body." });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo", // or other free model
        messages,
        // messages: [
        //   {
        //     role: "user",
        //     content: userMessage,
        //   },
        // ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000", // required by OpenRouter
          "X-Title": "My AI App", // optional
        },
      }
    );

    const content = response.data.choices[0].message.content;
    res.json({ response: content });
  } catch (error) {
    console.error(
      "OpenRouter API error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to get response from OpenRouter" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
