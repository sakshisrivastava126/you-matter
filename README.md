# You Matter — Full Stack Mental Wellness Platform

You Matter is a full-stack web application designed to provide a safe, interactive, and supportive environment for users. It combines real-time communication, AI assistance, and community features to promote mental well-being.

---

## Live Demo

* Frontend (Vercel): https://you-matter-sigma.vercel.app
* Backend (Render): https://you-matter-znoq.onrender.com

---

## Features

### Authentication

* User signup and login
* Secure credential handling

### Real-Time Communication

* Community-based chat rooms
* Direct messaging (DMs)
* Live user presence tracking

### AI Chatbot

* Integrated AI assistant powered by Groq API
* Provides conversational support and guidance

### Community System

* Join and leave communities
* Broadcast messages within rooms

---

## Tech Stack

### Frontend

* Next.js
* React
* Tailwind CSS 

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Real-Time

* Socket.IO

### AI Integration

* Groq API

### Deployment

* Frontend: Vercel
* Backend: Render

---

## Project Structure

```id="g6f8lp"
you-matter/
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   └── controllers/
│   └── server.js
│
├── frontend/
│   └── (Next.js app)
│
└── README.md
```

---

## Environment Variables

### Backend (`.env`)

```id="5kqv1m"
MONGO_URI=your_mongodb_connection_string
PORT=4444
GROQ_API_KEY=your_groq_api_key
```

### Frontend (Vercel Environment Variables)

```id="q7azx9"
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

---

## Installation and Setup

### 1. Clone the repository

```id="h0n2xw"
git clone https://github.com/your-username/you-matter.git
cd you-matter
```

---

### 2. Backend setup

```id="y6p3js"
cd backend
npm install
npm run dev
```

---

### 3. Frontend setup

```id="n1c4op"
cd frontend
npm install
npm run dev
```

---

## Deployment

### Backend (Render)

* Root Directory: `backend`
* Build Command: `npm install`
* Start Command: `npm start`

### Frontend (Vercel)

* Add environment variable:

```id="l2f8rd"
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

---

## CORS Configuration

The backend is configured to allow requests from:

* Local development servers
* Deployed frontend (Vercel)

---

## Future Improvements

* JWT-based authentication
* Message persistence and history
* Role-based access (users and specialists)
* Enhanced AI response personalization
* UI/UX improvements

---

## Contributing

Contributions are welcome. Fork the repository and submit a pull request.

---

## License

This project is open-source and available under the MIT License.

---

## Acknowledgment

Built to create a digital space where users feel heard, supported, and connected.
