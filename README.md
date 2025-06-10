# collabsync
# 🚀 CollabSync – Smart Collaboration & Meeting Assistant

**CollabSync** is a modern, full-stack SaaS platform designed to enhance collaboration by combining chat, file sharing, and AI-powered meeting summary generation. It empowers teams to upload documents and receive concise summaries using OpenAI’s API – ideal for productivity, note-taking, and knowledge capture.

---

## 🌟 Features

- 🔐 Secure user authentication (Email & Google Sign-In)
- 💬 Real-time chat interface (Socket.io-based)
- 📎 File upload support (.pdf, .txt, .docx)
- 🤖 AI-generated meeting summaries (OpenAI or Vertex AI)
- 🧠 RAG pipeline to extract relevant knowledge from uploaded content
- ☁️ Deployed with Docker, Netlify, and Render
- 🔄 CI/CD with GitHub Actions

---

## 🧰 Tech Stack

### Frontend:
- React + TypeScript
- TailwindCSS
- Axios

### Backend:
- Node.js + Express
- MongoDB (with Mongoose)
- JWT for authentication
- Multer for file upload
- OpenAI API integration

### DevOps & Tools:
- Docker
- GitHub Actions
- Netlify (Frontend)
- Render (Backend)

---



git clone https://github.com/saimallesh1010/collabsync.git
cd collabsync


# In one terminal
cd backend
npm run dev

# In another terminal
cd frontend
npm run dev


Future Enhancements
📊 User-specific file history and summary storage

🧠 Integration with Google Calendar or Outlook

🔎 Semantic search over past summaries

🎥 Meeting video/audio summarization

🗂️ Team-level document collaboration