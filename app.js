import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import ChatDataRoutes from "./route/ChatDataRoutes.js";
import UserDataRoutes from "./route/UserDataRoutes.js";
// import chatRoutes from "./route/chatRoutes.js";

dotenv.config();

const app = express();
connectDB();

// Allow CORS for both local and deployed frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://ai-query-frontend.vercel.app", // Your deployed frontend
  /\.vercel\.app$/, // Allow all Vercel subdomains
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.some((allowed) =>
          typeof allowed === "string"
            ? allowed === origin
            : allowed.test(origin)
        )
      ) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
  express.json()
);

app.use("/api", UserDataRoutes);
app.use("/api", ChatDataRoutes);
// app.use("/api/", chatPostRoute);

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
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:3000",
          "X-Title": "My AI App",
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
