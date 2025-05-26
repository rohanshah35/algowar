# ⚔️ AlgoWar

> Gamifying coding prep through real-time competitive Leetcode-style battles.

Built with Next.js & Spring Boot • Styled with Mantine • Powered by AWS

---

## 🖼️ Gallery
#### ▶️ Problem Execution & Submission Demo
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1205342967351738429/1376703624125874176/ezgif-3c6d480ac33828.gif?ex=68364aa9&is=6834f929&hm=c874644e2d85129911f305be12d52ccfae291dbc764b29ae095ed8494509aca9&" alt="AlgoWar Running and Submitting Demo" width="600" />
</p>

#### 📄 Profile Page
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1205342967351738429/1376700841838383295/5debac62d5dc6f49f8db4a648fefe78e.png?ex=68364812&is=6834f692&hm=941f7c14c5f4b5776d48d5e08f44d325d190f1e6105bc665704032555331e505&" alt="AlgoWar Profile Page Screenshot" width="600" />
</p>

#### 📊 Problem Workspace
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1205342967351738429/1376702548022399116/eb9e9606473b8b59480321b4fbfd25ed.png?ex=683649a9&is=6834f829&hm=e5392d81240de6ac9697aee7f0de76836181b4b032fa8705f7a558cafb63b69f&" alt="AlgoWar Match History Screenshot" width="600" />
</p>

#### 🧠 Problem List
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1205342967351738429/1376703249695899789/44ea678d4ee5afa2b908f98a54108bd2.png?ex=68364a50&is=6834f8d0&hm=9ef144e59ea006dd0c8d23ed4416cb4e237eb9d611b6822d0bc2a5f23cc9a98f&" alt="AlgoWar Skills Screenshot" width="600" />
</p>

#### 📈 Landing Page
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1205342967351738429/1376703312136638504/e8321901d8fa6777629cfa0d67384c63.png?ex=68364a5f&is=6834f8df&hm=5bfeab4cd3c9387ee2119202ac3fd8c9e3a25809a65c90c0765faee96aba2800&" alt="AlgoWar Elo History Screenshot" width="600" />
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
