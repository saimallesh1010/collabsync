const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");
const OpenAI = require("openai");
const Summary = require("../models/Summary.js");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const upload = multer({ dest: "uploads/" });

router.post("/upload-summary", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    let text = "";
    if (ext === ".txt") {
      text = fs.readFileSync(filePath, "utf-8");
    } else if (ext === ".pdf") {
      const pdf = await pdfParse(fs.readFileSync(filePath));
      text = pdf.text;
    } else if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    fs.unlinkSync(filePath); // Clean up uploaded file

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful meeting summarizer." },
        { role: "user", content: `Summarize the following meeting notes:\n${text}` },
      ],
    });

    const summaryText = completion.choices[0].message.content;

    await Summary.create({
      userId: req.user.id,
      originalFilename: req.file.originalname,
      originalText: text,
      summaryText,
    });

    res.json({ summary: summaryText });
  } catch (err) {
    console.error("❌ Error in summary route:", err);
    res.status(500).json({ message: "Failed to summarize file." });
  }
});

module.exports = router;
