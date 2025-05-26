# ⚔️ AlgoWar

> Gamifying coding prep through real-time competitive Leetcode-style battles.

Built with Next.js & Spring Boot • Styled with Mantine • Powered by AWS

---

## 🚀 Quick Links

- 🌐 [Live Demo](#) *(link coming soon)*

---

## 📖 About

**AlgoWar** is a full-stack web application that turns traditional coding practice into an exciting head-to-head game. Players can challenge each other to real-time coding duels based on Leetcode-style questions, enhancing motivation and improving algorithmic skills in a fun, engaging way.

---

## ✨ Features

- 🔐 Secure user authentication with AWS Cognito  
- 🧠 Real-time coding duels with automatic scoring  
- 🎮 Competitive matchmaking & leaderboards  
- 📱 Responsive, mobile-friendly UI  
- 🧩 Question difficulty selection  
- ⏱️ Timed matches with result summaries  
- 🗂️ User profiles with match history  

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js with TypeScript  
- **UI Library**: [Mantine](https://mantine.dev/)  
- **State Management**: React Context / Zustand (if used)  
- **Icons**: Tabler Icons (default in Mantine)  
- **Styling**: CSS-in-JS (Mantine built-in)  

### Backend & Infrastructure

- **Server**: Spring Boot (Java)  
- **Database**: PostgreSQL (AWS RDS)  
- **Authentication**: AWS Cognito  
- **File Storage**: AWS S3  
- **Containerization**: Docker  
- **Deployment**: AWS EC2 / ECS / Amplify


---

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/yourusername/algowar.git
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

---

## 🔑 Environment Variables

Create a `.env` file in `backend/`:

**Backend `.env` or `application.properties`**
```
DB_URL=
DB_USERNAME=
DB_PASSWORD=
AWS_COGNITO_USER_POOL_ID=
AWS_COGNITO_CLIENT_ID=
AWS_COGNITO_CLIENT_SECRET=
AWS_REGION=
JWT_SECRET=

```

---

## 📈 Performance

- ⚡ Optimized loading via Next.js
- 📱 Fully responsive on all devices
- 🧪 Unit & integration tested backend

---

## 🙏 Acknowledgments

- [Mantine](https://mantine.dev/) for the incredible UI library  
- Leetcode for inspiring the problem format  
- AWS for providing robust cloud services  
- Luca Bianchini & Rohan Shah
