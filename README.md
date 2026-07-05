# SoulSync — Setup Guide

---

## Prerequisites
- Node.js installed
- MongoDB Atlas cluster (or local MongoDB)
- Clerk account (for auth)
- OpenAI API key

---

## 1. Frontend (`/frontend`)

### Environment Variables
Create a `.env.local` file in the `/frontend` root:

```env
NEXT_PUBLIC_SOCKET_URL=<your-socket-url>
NEXT_PUBLIC_API_URL=<your-api-url>
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
```

### Run
```bash
npm install
npm run dev
```

---

## 2. Backend (`/backend`)

### Environment Variables
Create a `.env` file in the `/backend` root:

```env
CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxx
CLIENT_ORIGIN=https://your-frontend-domain.com
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<db>
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxx
```

### Run
```bash
npm install

# Development
npm run dev

# Production-style (matches Render deploy)
npm start
``` 

---

## Tech Stack
- **Frontend:** Next.js (App Router), Zustand, Clerk, Socket.IO client
- **Backend:** Node.js, Express, Socket.IO, MongoDB, Clerk (server SDK), OpenAI SDK
