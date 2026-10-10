# BFFMeter — Friendship Quiz & Social Scoreboard Platform

A modern, mobile-first social friendship quiz website built with TypeScript, React 19, Tailwind CSS, and Express. Users create custom quizzes about themselves, friends test their knowledge via unique shareable links, and the server calculates scores with zero pre-submission answer leakage.

---

## 🌟 Features

- **Personalized Quiz Creation Wizard**: Configure display name, questions, options, cover emojis, and designated correct answers.
- **Curated Question Bank**: Browse 50+ engaging questions across relatable friendship categories (Food & Snacks, Habits, Dreams, Dilemmas, Pop Culture).
- **Zero-Leak Server Grading**: Question answer keys are strictly withheld by the server until after a participant submits answers.
- **Scoreboard & Tie-Breaking**: Live leaderboards with podium rankings (1st, 2nd, 3rd) and documented tie-breaking logic (highest score, fastest completion time, earliest submission).
- **Duplicate Prevention**: Configurable single-attempt or retry enforcement per participant display name.
- **Multi-Channel Social Sharing**: 1-click sharing to WhatsApp, Telegram, X (Twitter), Web Share API, and an interactive SVG QR code generator.
- **Creator Dashboard**: Inspect participant analytics, track easiest vs. hardest questions, toggle active status, and export response data as CSV.
- **Moderator Portal**: Password-protected admin console (`admin2026`) with quiz management, abuse report handling, and built-in system verification tests.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, Tailwind CSS v4, Lucide icons, Canvas Confetti.
- **Backend**: Express REST API running on Node.js / TSX.
- **Storage**: Persistent JSON database store (`data/database.json`) with in-memory caching and atomic writes.
- **Security**: Token-based creator authorization (`Bearer <editToken>`), strict validation, sanitization of public quiz payloads.

---

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Development

Start the full-stack development server on port 3000:

```bash
npm run dev
```

### 3. Running Automated Tests

Run the verification test suite covering quiz creation, answer key protection, score grading, and permissions:

```bash
npm test
```

### 4. Production Build

```bash
npm run build
npm start
```

---

## 🛡️ Security & Zero Answer-Key Leak Verification

1. **Public Endpoint (`GET /api/quizzes/:code`)**: Strips `correctOptionId` from every question object.
2. **Scoring Endpoint (`POST /api/quizzes/:code/submit`)**: Takes `{ participantName, answers, timeSpentSeconds }`, compares against database truth on the server, and records score.
3. **Owner Authorization (`/api/quizzes/:code/admin`)**: Requires secret `editToken` to view answer keys, edit questions, or delete quizzes.

---

## 📄 License

Apache-2.0 License.
