# 🎯 Intervuo — AI-Powered Interview Preparation Planner

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-gold?style=for-the-badge&logo=vercel)](https://ai-interview-planner-murex.vercel.app/)
[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-React%20%7C%20Bun%20%7C%20Gemini-blue?style=for-the-badge)](https://ai-interview-planner-murex.vercel.app/)

An intelligent, context-aware web application that parses a candidate's resume, matches it against a target job description, performs semantic skill gap analysis, and generates a personalized daily preparation timeline along with tailored technical and behavioral questions using Google's Gemini AI.

---

## 📖 Table of Contents

- [🚀 Key Features](#-key-features)
- [💻 Tech Stack](#-tech-stack)
- [📂 Directory Structure](#-directory-structure)
- [🔧 Prerequisites](#-prerequisites)
- [⚙️ Environment Configuration](#%EF%B8%8F-environment-configuration)
- [🛠️ Installation & Local Setup](#%EF%B8%8F-installation--local-setup)
- [💡 Usage Guide](#-usage-guide)
- [📦 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🚀 Key Features

- **Resume Parsing & Semantic Analysis**: Directly uploads PDF resumes, parsing contents with server-side extraction using [pdf-parse](https://www.npmjs.com/package/pdf-parse).
- **Role Alignment Engine**: Tailors assessment evaluations by matching applicant backgrounds directly against detailed job descriptions.
- **Dynamic Profile Fit Score**: Generates a unified suitability index (0–100%) highlighting overall qualifications.
- **Smart Practice Questions**: Produces tailored technical and behavioral questions mapped with interviewer intent and suggested preparation responses.
- **Detailed Skill Gap Analysis**: Highlights missing competencies with prioritized severity levels (_Low_, _Medium_, and _High_).
- **Custom Timeline Planner**: Outlines an actionable day-by-day preparation schedule with interactive check-off task lists.
- **Session Authentication & Protection**: Secure user sign-up/sign-in flows via hashed credentials using [bcrypt](https://www.npmjs.com/package/bcrypt) and JWT-based cookies.
- **Persistent Report History**: Direct storage of generated reports for later lookup, modification, and deletion.

---

## 💻 Tech Stack

### Frontend Client

- **Core Framework**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build System**: [Vite 8](https://vite.dev/)
- **Routing & State**: [React Router 7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend Server

- **Runtime Environment**: [Bun](https://bun.sh/) (or Node.js 18+)
- **Server Framework**: [Express 5](https://expressjs.com/)
- **Database Wrapper**: [Mongoose](https://mongoosejs.com/) (MongoDB)
- **Validation**: [Zod](https://zod.dev/)
- **PDF Parser**: [pdf-parse](https://www.npmjs.com/package/pdf-parse)
- **File Upload**: [Multer](https://www.npmjs.com/package/multer)

### AI Orchestration

- **Model**: `gemini-3-flash-preview` (Gemini Flash Model)
- **SDK**: [@google/genai](https://www.npmjs.com/package/@google/genai)
- **Data Guard**: Zod Schema constraints for JSON response formatting

---

## 📂 Directory Structure

Below is an overview of the key folders and configuration files in this repository:

- [render.yaml](./render.yaml): Configuration schema for Render multi-service deployments.
- [client/package.json](./client/package.json): Frontend dependency definitions.
- [client/src/App.tsx](./client/src/App.tsx): Main application routing layer.
- [client/src/features/interview/pages/Home.tsx](./client/src/features/interview/pages/Home.tsx): Landing page and form to upload resume/JD.
- [client/src/features/interview/pages/Interview.tsx](./client/src/features/interview/pages/Interview.tsx): Dashboard showing match score, Q&As, skill gaps, and tasks.
- [server/package.json](./server/package.json): Backend dependency definitions.
- [server/Dockerfile](./server/Dockerfile): Docker instructions for containerized deployment.
- [server/src/services/ai.service.ts](./server/src/services/ai.service.ts): Integration with Gemini Flash API.
- [server/src/models/interviewReport.model.ts](./server/src/models/interviewReport.model.ts): MongoDB schema definition for reports.

---

## 🔧 Prerequisites

Before starting, ensure you have installed:

- [Bun](https://bun.sh/) (recommended runtime for optimal performance) or [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (either local installation or MongoDB Atlas instance)
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

---

## ⚙️ Environment Configuration

Set up environment files for both the `client` and `server` subdirectories.

### Server Env

Create a file named `.env` inside the `server/` directory:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/Intervuo
JWT_SECRET=your_super_secure_jwt_secret_token
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

### Client Env

Create a file named `.env` inside the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🛠️ Installation & Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Tushar-Ravaliya/AI-Interview-Planner.git
cd AI
```

### 2. Set Up the Server

Navigate to the server directory, install dependencies, and start the development server:

```bash
cd server
bun install
# Start backend in watch/development mode
bun run dev
```

### 3. Set Up the Client

In a new terminal window, navigate to the client directory, install dependencies, and start the Vite server:

```bash
cd client
bun install
# Start client development server
bun run dev
```

The client dashboard should now be accessible locally at `http://localhost:5173`.

---

## 💡 Usage Guide

1. **Sign Up / Sign In**: Create an account on the sign-up page to securely access and persist your dashboard.
2. **Configure Profile**: Drag & drop your PDF resume, paste the target job description, and add optional career context in the Self Description box.
3. **Generate Prep Roadmap**: Click "Generate Preparation Plan". The AI parses your details and produces the custom dashboard.
4. **Practice and Review**:
   - Tap **Practice Questions** to toggle between technical and behavioral queries, read the interviewer's intent, and click "Reveal" to check the suggested response.
   - Tap **Skill Gaps** to review categorized weaknesses and severity.
   - Tap **Prep Schedule** to track your preparation daily and tick tasks off your list.

---

## 📦 Deployment

### Backend (Docker/Render)

The project comes pre-configured with a [render.yaml](./render.yaml) file for easy deployment on Render using the [server/Dockerfile](./server/Dockerfile):

1. Create a new Web Service on Render linked to your repository.
2. Render will automatically read the `render.yaml` configuration to start the Docker container running Bun.
3. Define the environment variables in the Render Dashboard settings (`MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `CLIENT_URL`).

### Frontend (Vercel)

The frontend client includes `vercel.json` and is configured to compile Vite builds:

1. Connect your repository to Vercel.
2. Set the root directory of your project configuration to `client`.
3. Set the Build Command to `bun run build` or `npm run build`.
4. Add the `VITE_API_BASE_URL` pointing to your deployed backend URL.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See standard license formats for details.
