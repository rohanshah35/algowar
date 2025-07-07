# ⚔️ AlgoWar

> Gamifying coding prep through real-time competitive Leetcode-style battles.

Built with Next.js & Spring Boot • Styled with Mantine • Powered by AWS

---

## 🖼️ Gallery
#### ▶️ Problem Execution & Submission Demo
<p align="center">
  <img src="https://i.ibb.co/QFFmdk3x/ezgif-3c6d480ac33828.gif" alt="AlgoWar Running and Submitting Demo" width="600" />
</p>

#### 📄 Profile Page
<p align="center">
  <img src="https://i.ibb.co/BVzB9sGm/5debac62d5dc6f49f8db4a648fefe78e.png" alt="AlgoWar Profile Page Screenshot" width="600" />
</p>

#### 📊 Problem Workspace
<p align="center">
  <img src="https://i.ibb.co/p664NPxF/eb9e9606473b8b59480321b4fbfd25ed.png" alt="AlgoWar Problem Workspace" width="600" />
</p>

#### 🧠 Problem List
<p align="center">
  <img src="https://i.ibb.co/JRtJD3xs/44ea678d4ee5afa2b908f98a54108bd2.png" alt="AlgoWar Problem List" width="600" />
</p>

#### 📈 Landing Page
<p align="center">
  <img src="https://i.ibb.co/PsQqgDQK/e8321901d8fa6777629cfa0d67384c63.png" alt="AlgoWar Landing Page" width="600" />
</p>

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
