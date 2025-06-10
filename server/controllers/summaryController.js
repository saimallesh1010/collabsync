const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.summarizeFile = async (req, res) => {
  try {
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    let text = "";

    if (ext === ".txt") {
      text = fs.readFileSync(filePath, "utf-8");
    } else if (ext === ".pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdf = await pdfParse(dataBuffer);
      text = pdf.text;
    } else if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else {
      return res.status(400).json({ message: "Unsupported file format" });
    }

    if (!text.trim()) {
      return res.status(400).json({ message: "Empty file or unreadable content" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes meeting notes." },
        { role: "user", content: `Summarize this content:\n\n${text}` },
      ],
    });

    const summary = completion.choices[0].message.content;
    res.json({ summary });

    fs.unlinkSync(filePath); // delete temp file
  } catch (err) {
    console.error("❌ Summary error:", err);
    res.status(500).json({ message: "Failed to summarize file" });
  }
};
