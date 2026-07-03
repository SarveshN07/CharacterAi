import express, { urlencoded } from "express"
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config()
const app = express()
app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(cors())

const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.post("/chat", async (req, res) => {
  try {
    const { characterPrompt, userPrompt } = req.body;

    const openai = new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
    });

    const response = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: characterPrompt },
        { role: "user", content: userPrompt }
      ],
    });

    res.json({ content: response.choices[0].message.content });
    console.log(response.choices[0].message.content)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// Serve built React frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")))

// Catch-all: send index.html for any other route
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});