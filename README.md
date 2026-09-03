# ProblemSolver 🚀

**ProblemSolver is an open-source platform that turns real-world problems into collaborative software projects.**

It connects people and organizations that identify meaningful problems with developers who can contribute practical solutions. Each problem can be transformed into a structured set of development tasks, automatically connected to a dedicated GitHub repository, and collaboratively solved through pull requests, real-time communication, and contribution-based reputation.

---

### How It Works At a Glance

```text
Real-World Problem
        ↓
Problem Submission (Auto-Creates GitHub Repo)
        ↓
Admin Breaks Problem into Tasks
        ↓
Developers Claim & Implement Tasks
        ↓
Pull Request Submitted on GitHub
        ↓
GitHub API / Webhook Verification
        ↓
Task Completion + Reputation Awarded
        ↓
Community Leaderboard Updated
```

At its core, **ProblemSolver** creates a seamless bridge between **real-world community needs and open-source development**—giving developers a structured way to contribute while providing problem submitters with a transparent path toward solutions.

---

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🔄 Core Workflows](#-core-workflows)
  - [1. Authentication & OTP Verification Flow](#1-authentication--otp-verification-flow)
  - [2. Task Lifecycle & GitHub PR Verification Flow](#2-task-lifecycle--github-pr-verification-flow)
  - [3. GitHub Repository Provisioning Flow](#3-github-repository-provisioning-flow)
  - [4. Real-Time Problem Chat Flow](#4-real-time-problem-chat-flow)
- [🗄️ Database Design](#️-database-design)
- [📡 API Documentation](#-api-documentation)
- [🎨 Frontend Architecture](#-frontend-architecture)
- [📂 Project Structure](#-project-structure)
- [🛠️ Technology Stack](#️-technology-stack)
- [⚙️ Environment Variables](#️-environment-variables)
- [🚀 Getting Started \& Local Development](#-getting-started--local-development)
- [🐳 Docker Support](#-docker-support)
- [🧪 Testing](#-testing)
- [🔒 Security Implementation \& Considerations](#-security-implementation--considerations)
- [🚀 Deployment Configuration](#-deployment-configuration)
- [📐 Architectural Decisions](#-architectural-decisions)
- [🗺️ Future Improvements \& Roadmap](#️-future-improvements--roadmap)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## 🌟 Overview

### What is ProblemSolver?
**ProblemSolver** is a full-stack platform designed to facilitate crowdsourced software solutions for public, private, and municipal challenges. When a user submits a problem, the platform automates the developer onboarding process by creating a public GitHub repository, enabling administrators to dissect the problem into actionable micro-tasks, and orchestrating the developer workflow from claim to pull request verification.

### Key Actors & User Roles
- **Public Users / Problem Submitters**: Submit detailed problem descriptions categorized by region and type (`public`, `private`, `government`).
- **Developers**: Browse open problems, claim up to 2 active tasks simultaneously, write code, submit GitHub Pull Requests, earn reputation points, and climb the community leaderboard.
- **Administrators**: Review problems, break problems down into discrete tasks (`EASY`, `MEDIUM`, `HARD`), verify/merge submitted PRs, manage users, and moderate community participation.

---

## ✨ Key Features

### 🔐 Authentication & Identity
- **Dual-Factor OTP Verification**: 6-digit OTP delivery via email for registration and login, hashed using `bcrypt` in MongoDB with a 10-minute auto-expiry (TTL index).
- **OAuth 2.0 Single Sign-On**: Passport.js authentication for Google and GitHub with automated account matching and linking.
- **Dual-Token JWT Architecture**: 15-minute Access Tokens and 7-day Refresh Tokens issued via `HTTPOnly` cookies. Upstash Redis stores active refresh tokens for instant session revocation.
- **Role-Based Access Control (RBAC)**: Enforces permission boundaries across `PUBLIC`, `DEVELOPER`, and `ADMIN` roles.

### 🧩 Problem Management & GitHub Automation
- **Automated Repository Provisioning**: Problem creation triggers Octokit to create an open-source public repository on GitHub initialized with a README.
- **Categorization & Multi-Filter Search**: Filter by category (`public`, `private`, `government`), geographic region, and status (`OPEN`, `IN_PROGRESS`, `SOLVED`, `ARCHIVED`).
- **Full-Text Search**: MongoDB text indexes across title, description, and tags.

### 📋 Task Lifecycle & Verification
- **State Machine Enforcement**: Enforces task transitions: `OPEN` → `ASSIGNED` → `IN_PROGRESS` → `IN_REVIEW` → `COMPLETED` / `REOPENED` / `CANCELLED`.
- **Hoarding Protection**: Developers are strictly capped at 2 active tasks (`ASSIGNED` or `IN_PROGRESS`) at any time.
- **GitHub PR Verification**: Validates Pull Requests using the Octokit REST API before allowing submission (`SUBMIT_PR`) and approval (`PR_MERGED`).
- **Gamified Reputation System**: Automatically grants reputation points upon task completion based on difficulty (+10 for `EASY`, +25 for `MEDIUM`, +50 for `HARD`).
- **GitHub Webhook Sync**: Listens to GitHub `pull_request` events to auto-complete tasks and award reputation when PRs are merged on GitHub.

### 💬 Real-Time Collaboration
- **WebSocket Problem Rooms**: Socket.io integration mapping live chat rooms to individual `problemId` instances.
- **Persistent Message Storage**: All chat messages are stored in MongoDB and populated with sender metadata upon broadcast.

### 👤 Profile & Leaderboard
- **Developer Leaderboard**: Displays top community contributors ranked by reputation points and completed tasks.
- **User Profile Management**: Custom bio, GitHub handle, and profile picture uploads powered by Cloudinary.

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph Client Layer
        Browser[Browser / User] -->|HTTPS| ReactApp[React 19 + Vite Frontend]
    end

    subgraph Application & Gateway Layer
        ReactApp -->|REST API + HTTPOnly Cookies| ExpressApp[Express 5 Node.js Server]
        ReactApp <-->|WebSockets| SocketServer[Socket.IO Real-Time Server]
    end

    subgraph Security & Middleware Layer
        ExpressApp --> AuthMiddleware[Auth Middleware JWT & Passport]
        ExpressApp --> RoleMiddleware[Role Middleware RBAC]
        ExpressApp --> ErrorMiddleware[Error Middleware]
    end

    subgraph Data & Caching Layer
        ExpressApp -->|Mongoose ODM| MongoDB[(MongoDB Primary DB)]
        ExpressApp -->|ioredis + TLS| Redis[(Upstash Redis Session Cache)]
        SocketServer -->|Persist Messages| MongoDB
    end

    subgraph External Infrastructure Services
        ExpressApp -->|Octokit REST API| GitHubAPI[GitHub REST API]
        ExpressApp -->|HTTPS Multi-Provider| EmailService[Email Providers EmailJS / Resend / Brevo]
        ExpressApp -->|Image Upload SDK| Cloudinary[Cloudinary CDN]
        GitHubAPI -->|Webhooks pull_request| ExpressApp
    end
```

---

## 🔄 Core Workflows

### 1. Authentication & OTP Verification Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant FE as React Frontend
    participant BE as Express Backend
    participant Redis as Upstash Redis
    participant DB as MongoDB
    participant Email as Email Service

    User->>FE: Enter Signup Form (Name, Email, Password)
    FE->>BE: POST /api/auth/signup
    BE->>Redis: Store pending user payload (TTL 600s)
    BE->>DB: Store bcrypt-hashed OTP in OTP collection (TTL 10m)
    BE->>Email: Dispatch 6-digit OTP email
    BE-->>FE: HTTP 201 (OTP Sent)
    User->>FE: Enter Received 6-Digit OTP
    FE->>BE: POST /api/auth/verify-email
    BE->>DB: Verify OTP hash against DB
    BE->>Redis: Fetch pending user payload
    BE->>DB: Create verified User document
    BE->>BE: Generate Access Token (15m) & Refresh Token (7d)
    BE->>Redis: Store Refresh Token against User ID
    BE-->>FE: Set HTTPOnly Cookies (accessToken, refreshToken)
```

### 2. Task Lifecycle & GitHub PR Verification Flow

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer
    actor Admin as Admin / Webhook
    participant FE as React Frontend
    participant BE as Express Backend
    participant GH as GitHub API

    Dev->>FE: Claim Open Task
    FE->>BE: PATCH /api/tasks/:taskId/status (CLAIM_TASK)
    BE->>BE: Check active tasks count < 2
    BE-->>FE: Task Status: ASSIGNED

    Dev->>FE: Start Task Work
    FE->>BE: PATCH /api/tasks/:taskId/status (START_TASK)
    BE-->>FE: Task Status: IN_PROGRESS

    Dev->>FE: Submit GitHub Pull Request URL
    FE->>BE: PATCH /api/tasks/:taskId/status (SUBMIT_PR)
    BE->>GH: Validate PR exists via Octokit API
    GH-->>BE: PR Exists Confirmation
    BE-->>FE: Task Status: IN_REVIEW

    alt Manual Admin Approval
        Admin->>FE: Approve Submitted PR
        FE->>BE: PATCH /api/tasks/:taskId/status (PR_MERGED)
        BE->>GH: Validate PR is merged on GitHub
        GH-->>BE: PR Merged Confirmed
        BE->>BE: Award User Reputation (+10/+25/+50) & increment tasksCompleted
        BE-->>FE: Task Status: COMPLETED
    else Automated GitHub Webhook
        GH->>BE: POST /api/webhooks/github (pull_request closed & merged)
        BE->>BE: Locate task by PR URL -> Mark COMPLETED & Award Reputation
    end
```

### 3. GitHub Repository Provisioning Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Submitter
    participant FE as React Frontend
    participant BE as Express Backend
    participant GH as GitHub API
    participant DB as MongoDB

    User->>FE: Fill Create Problem Form
    FE->>BE: POST /api/problems
    BE->>BE: Format safe repository name (problem-title-XXXX)
    BE->>GH: Call repos.createForAuthenticatedUser via Octokit
    GH-->>BE: Return GitHub Repository HTML URL
    BE->>DB: Save Problem with repositoryUrl
    BE-->>FE: Return Created Problem Document
```

### 4. Real-Time Problem Chat Flow

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer
    participant FE as Socket.IO Client
    participant WS as Socket.IO Server
    participant DB as MongoDB

    Dev->>FE: Open Problem Details Page
    FE->>WS: Emit "joinRoom" (problemId)
    WS-->>FE: Room Joined Confirmation
    Dev->>FE: Send Chat Message
    FE->>WS: Emit "sendMessage" { problemId, senderId, text }
    WS->>DB: Save Message Document
    WS->>DB: Populate senderId with User Name
    WS-->>FE: Broadcast "receiveMessage" to all clients in problemId room
```

---

## 🗄️ Database Design

MongoDB is the primary database, managed via Mongoose models.

```mermaid
erDiagram
    User ||--o{ Problem : "creates"
    User ||--o{ Task : "assigned to"
    User ||--o{ Message : "sends"
    Problem ||--o{ Task : "contains"
    Problem ||--o{ Message : "has chat messages"
    User }|--|{ Problem : "contributors / pendingContributors"

    User {
        ObjectId _id PK
        string name
        string email UK
        string password
        string googleId UK
        string githubId UK
        string role "PUBLIC | DEVELOPER | ADMIN"
        string profileImageUrl
        string bio
        string githubUsername
        number reputation
        boolean isActive
        number totalContributions
        number tasksCompleted
        boolean Verified
    }

    Problem {
        ObjectId _id PK
        string title
        string description
        string category "public | private | government"
        string region
        string tags
        string repositoryUrl
        string status "OPEN | IN_PROGRESS | SOLVED | ARCHIVED"
        ObjectId createdBy FK
        ObjectIdArray contributors FK
        ObjectIdArray pendingContributors FK
        number upvotes
    }

    Task {
        ObjectId _id PK
        ObjectId problemId FK
        string title
        string description
        string difficulty "EASY | MEDIUM | HARD"
        string status "OPEN | ASSIGNED | IN_PROGRESS | IN_REVIEW | COMPLETED | REOPENED | CANCELLED"
        ObjectId assignedTo FK
        string repositoryUrl
        string githubPRUrl
        ObjectId createdBy FK
    }

    OTP {
        ObjectId _id PK
        string email
        ObjectId user FK
        string otpHash
        date createdAt "TTL 600s"
    }

    Message {
        ObjectId _id PK
        ObjectId problemId FK
        ObjectId senderId FK
        string text
        date createdAt
    }
```

### Models & Schema Overview

#### 1. `User` Model (`backend/src/modules/auth/auth.model.js`)
- **Key Fields**: `name`, `email` (unique), `password` (hashed), `googleId`, `githubId`, `role` (`PUBLIC`, `DEVELOPER`, `ADMIN`), `profileImageUrl`, `bio`, `githubUsername`, `reputation`, `isActive`, `totalContributions`, `tasksCompleted`, `Verified`.
- **Indexes**: Sparse unique indexes on `googleId` and `githubId`.

#### 2. `Problem` Model (`backend/src/modules/problems/problem.model.js`)
- **Key Fields**: `title`, `description`, `category` (`public`, `private`, `government`), `region`, `tags`, `repositoryUrl`, `status`, `pendingContributors`, `contributors`, `upvotes`, `createdBy`.
- **Indexes**: Text index on `title`, `description`, and `tags` for full-text search capability.

#### 3. `Task` Model (`backend/src/modules/tasks/task.model.js`)
- **Key Fields**: `problemId`, `title`, `description`, `difficulty` (`EASY`, `MEDIUM`, `HARD`), `status`, `assignedTo`, `repositoryUrl`, `githubIssueUrl`, `githubPRUrl`, `branchName`, `createdBy`.
- **Indexes**: Single-field indexes on `problemId`, `status`, and `difficulty`.

#### 4. `OTP` Model (`backend/src/modules/auth/otp.model.js`)
- **Key Fields**: `email`, `user`, `otpHash`, `createdAt`.
- **Indexes**: Expire index (`expires: 600`) causing MongoDB to automatically remove expired OTP documents after 10 minutes.

#### 5. `Message` Model (`backend/src/modules/message/message.model.js`)
- **Key Fields**: `problemId`, `senderId`, `text`, `createdAt`.

---

## 📡 API Documentation

All API routes are served under the `/api` base path.

### 🔑 Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required | Role Required |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Registers temporary user in Redis and dispatches registration OTP email | Public | Any |
| `POST` | `/api/auth/verify-email` | Verifies registration OTP and persists User document in MongoDB | Public | Any |
| `POST` | `/api/auth/login` | Validates user credentials and dispatches 2FA login OTP email | Public | Any |
| `POST` | `/api/auth/verify-login-otp` | Verifies login OTP and sets HTTPOnly Access/Refresh Token cookies | Public | Any |
| `POST` | `/api/auth/logout` | Clears auth cookies and deletes Redis refresh token session | Public | Any |
| `POST` | `/api/auth/refresh-token` | Issues a new Access Token using valid HTTPOnly Refresh Token | Public (Cookie) | Any |
| `GET` | `/api/auth/profile` | Fetches profile of the currently authenticated user | Required | Any |
| `GET` | `/api/auth/google` | Initiates Google OAuth 2.0 authentication flow | Public | Any |
| `GET` | `/api/auth/google/callback` | OAuth callback endpoint handling Google SSO login/signup | Public | Any |
| `GET` | `/api/auth/github` | Initiates GitHub OAuth 2.0 authentication flow | Public | Any |
| `GET` | `/api/auth/github/callback` | OAuth callback endpoint handling GitHub SSO login/signup | Public | Any |

### 📌 Problems (`/api/problems`)

| Method | Endpoint | Description | Auth Required | Role Required |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/problems` | List all problems with optional query filters (`category`, `region`, `status`, `tags`) | Public | Any |
| `GET` | `/api/problems/:problemId` | Fetch details, creator info, and contributors of a specific problem | Public | Any |
| `POST` | `/api/problems` | Create a problem and automatically provision a public GitHub repository | Required | Any |
| `PATCH` | `/api/problems/:problemId/status` | Update status of a problem | Required | Any |
| `PATCH` | `/api/problems/:problemId/repository` | Manually link a GitHub repository URL to a problem | Required | Admin |
| `PATCH` | `/api/problems/:problemId` | Update problem title, description, category, region, or tags | Required | Admin |

### 🎯 Tasks (`/api/tasks`)

| Method | Endpoint | Description | Auth Required | Role Required |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks/problem/:problemId` | List all tasks associated with a specific problem | Public | Any |
| `GET` | `/api/tasks/:taskId` | Fetch details of a single task | Public | Any |
| `POST` | `/api/tasks` | Create a new task under a problem | Required | Admin |
| `PUT` | `/api/tasks/:taskId` | Update task title, description, or difficulty | Required | Admin |
| `PATCH` | `/api/tasks/:taskId/status` | Trigger task lifecycle event (`CLAIM_TASK`, `START_TASK`, `SUBMIT_PR`, `PR_MERGED`, `PR_REJECTED`, `UNASSIGN_TASK`) | Required | Any / Admin |

### 👤 Users & Leaderboard (`/api/users`)

| Method | Endpoint | Description | Auth Required | Role Required |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/users/me` | Fetch authenticated user profile | Required | Any |
| `PATCH` | `/api/users/me` | Update profile info (Name, bio, githubUsername, avatar via Cloudinary) | Required | Any |
| `GET` | `/api/users/me/tasks` | Get all tasks assigned to the current user | Required | Any |
| `GET` | `/api/users/me/contributions` | Get contributions of the current user | Required | Any |
| `GET` | `/api/users/leaderboard` | Fetch top 10 users ranked by reputation points | Public | Any |
| `GET` | `/api/users/:userId` | Get public profile of a user by ID | Public | Any |
| `GET` | `/api/users/:userId/contributions` | Get completed tasks/contributions of a specific user | Public | Any |
| `GET` | `/api/users` | List all active users | Required | Admin |
| `PATCH` | `/api/users/:userId/deactivate` | Deactivate a user account and release their open tasks | Required | Admin |
| `PATCH` | `/api/users/:userId/role` | Change a user's role (`PUBLIC`, `DEVELOPER`, `ADMIN`) | Required | Admin |

### 💬 Real-Time Messaging & Webhooks

| Method | Endpoint | Description | Auth Required | Role Required |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/messages/:problemId` | Fetch historic chat messages for a problem chat room | Required | Any |
| `POST` | `/api/webhooks/github` | Receive GitHub PR webhook events (`opened`, `closed`) | Public | GitHub Webhook |

---

## 🎨 Frontend Architecture

The frontend is built as a single-page application (SPA) using React 19, Vite, Tailwind CSS v4, and Zustand.

```text
frontend/src/
├── api/                # Axios instance configuration & Interceptors (Automatic Token Refresh)
├── assets/             # Static logos and assets
├── components/         # Modular UI components
│   ├── chat/           # Socket.IO live ChatBox component
│   ├── common/         # Buttons, Loaders, Empty States, Loading Skeletons
│   ├── layout/         # Navbar, Footer, Sidebar, ProtectedRoute, AdminRoute
│   ├── problem/        # Problem cards & detail elements
│   └── task/           # Task status cards & submission modals
├── features/           # Auth login & register forms
├── pages/              # Page view components
│   ├── admin/          # Admin Dashboard, Manage Users, Manage Problems, Edit Problem, Manage Tasks
│   ├── auth/           # OAuth Callback landing page
│   └── user/           # HomePage, User Dashboard, ProblemsList, ProblemDetails, CreateProblem, MyTasks, Leaderboard, ProfilePage
├── routes/             # AppRoutes definition & client-side route guards
├── store/              # Zustand global state stores (useAuthStore, useAdminStore, useProblemStore, useTaskStore, useUserStore, useMessageStore)
└── styles/             # Tailwind CSS & global style definitions
```

### Axios Interceptor & Session Refresh
The Axios instance (`frontend/src/api/axios.js`) is configured with `withCredentials: true`. When an API call returns `401 Unauthorized`, the response interceptor automatically triggers `/api/auth/refresh-token`. If successful, it transparently retries the original failed request without logging out the user.

---

## 📂 Project Structure

```text
ProblemFinder/
├── backend/
│   ├── src/
│   │   ├── config/           # Database, Redis, Socket.io, Passport & Cloudinary configurations
│   │   ├── middlewares/      # Auth (JWT), Role (Admin), Rate Limit & Error handling middlewares
│   │   ├── modules/          # Feature modules (auth, problems, tasks, users, message, webhooks)
│   │   │   ├── auth/         # Controllers, Models, Routes, Services, OTP Model
│   │   │   ├── problems/     # Problem Controller, Model, Routes, Service
│   │   │   ├── tasks/        # Task Controller, Model, Routes, Service
│   │   │   ├── users/        # User Controller, Routes, Service
│   │   │   ├── message/      # Message Controller, Model, Route, Service
│   │   │   └── webhooks/     # GitHub Webhook Controller, Route, Service
│   │   ├── services/         # Multi-provider Email service (Resend, Brevo, EmailJS, Gmail)
│   │   ├── utils/            # GitHub Octokit helpers, Logger, API Response/Error classes
│   │   ├── app.js            # Express application middleware & route registration
│   │   ├── routes.js         # Master API router
│   │   └── server.js         # HTTP & Socket.io server entry point
│   ├── tests/                # Integration tests (Jest, Supertest)
│   ├── Dockerfile            # Development Dockerfile
│   ├── Dockerfile.prod       # Multi-stage production Dockerfile
│   └── package.json
├── frontend/
│   ├── src/                  # React 19 source code (Pages, Components, Zustand Stores, Api)
│   ├── Dockerfile            # Development Dockerfile
│   ├── Dockerfile.prod       # Production Dockerfile (Nginx multi-stage build)
│   ├── nginx.conf            # Production Nginx web server configuration
│   ├── vercel.json           # Vercel deployment configuration
│   └── package.json
├── docker-compose.yml        # Development Docker Compose specification
├── docker-compose.prod.yml   # Production Docker Compose specification
└── README.md
```

---

## 🛠️ Technology Stack

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.2.0` | User interface rendering |
| **Build Tool** | Vite | `^7.2.4` | Development server and bundling |
| **Routing** | React Router DOM | `^7.16.0` | Client-side page navigation |
| **Styling** | Tailwind CSS | `^4.2.0` | Utility-first styling framework |
| **State Management** | Zustand | `^5.0.11` | Client-side state management |
| **Icons & Animations** | Lucide React / Framer Motion | `^0.575.0` / `^12.34.3` | Icons and micro-animations |
| **HTTP Client** | Axios | `^1.16.1` | API requests with interceptors |
| **Backend Runtime** | Node.js / Express | `^5.2.1` | Asynchronous backend web framework |
| **Database & ODM** | MongoDB / Mongoose | `^9.1.4` | NoSQL database & Object Data Modeling |
| **Cache & Session** | Upstash Redis / `ioredis` | `^5.9.2` | Session storage, refresh tokens & OTP temp user cache |
| **Real-Time Layer** | Socket.IO | `^4.8.3` | WebSockets for live room chat |
| **Authentication** | Passport.js / `jsonwebtoken` / `bcryptjs` | `^0.7.0` / `^9.0.3` / `^3.0.3` | OAuth 2.0 SSO, JWT signing, password & OTP hashing |
| **External Integrations**| Octokit / Cloudinary | `^22.0.1` / `^2.9.0` | GitHub REST API integration & avatar image hosting |
| **Email Transport** | Resend / Brevo / EmailJS / Nodemailer | `^6.12.3` / `^8.0.5` | Multi-provider fallback transactional email delivery |
| **Containers** | Docker / Docker Compose / Nginx | Latest | Containerization & production web proxying |
| **Testing** | Jest / Supertest | `^30.3.0` / `^7.2.2` | Integration testing suite |

---

## ⚙️ Environment Variables

### Backend Configuration (`backend/.env`)

| Variable | Required | Description | Example Placeholder |
| :--- | :--- | :--- | :--- |
| `PORT` | No | Port on which the backend server listens (Default: `5000`) | `5000` |
| `MONGODB_URI` | **Yes** | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/problemsolver` |
| `UPSTASH_REDIS_URL` | **Yes** | Upstash Redis connection URL with TLS (`rediss://`) | `rediss://default:token@host.upstash.io:6379` |
| `JWT_SECRET` | **Yes** | Fallback secret for JWT operations | `your_jwt_secret_key` |
| `ACCESS_TOKEN_SECRET` | **Yes** | Secret key for signing Access Tokens (15m) | `your_access_token_secret` |
| `REFRESH_TOKEN_SECRET`| **Yes** | Secret key for signing Refresh Tokens (7d) | `your_refresh_token_secret` |
| `NODE_ENV` | No | Environment mode (`development` / `production`) | `development` |
| `FRONTEND_URL` | **Yes** | URL of the frontend client for CORS and OAuth redirects | `http://localhost:5173` |
| `BACKEND_URL` | No | Base URL of the backend server (Default: `http://localhost:5000`) | `http://localhost:5000` |
| `GITHUB_TOKEN` | **Yes** | Personal Access Token for GitHub API repo creation & PR checks | `ghp_your_github_personal_token` |
| `CLOUDINARY_CLOUD_NAME`| No | Cloudinary cloud name for profile image uploads | `your_cloudinary_cloud_name` |
| `CLOUDINARY_API_KEY` | No | Cloudinary API Key | `your_cloudinary_api_key` |
| `CLOUDINARY_API_SECRET`| No | Cloudinary API Secret | `your_cloudinary_api_secret` |
| `RESEND_API_KEY` | Optional | Resend API key for transactional emails (`re_...`) | `re_your_resend_api_key` |
| `BREVO_API_KEY` | Optional | Brevo REST API key (`xkeysib-...`) | `xkeysib-your_brevo_api_key` |
| `BREVO_SMTP_USER` | Optional | Brevo SMTP user email | `your_email@domain.com` |
| `BREVO_SMTP_KEY` | Optional | Brevo SMTP key (`xsmtpsib-...`) | `xsmtpsib-your_brevo_smtp_key` |
| `EMAILJS_SERVICE_ID` | Optional | EmailJS Service ID | `your_emailjs_service_id` |
| `EMAILJS_TEMPLATE_ID` | Optional | EmailJS Template ID | `your_emailjs_template_id` |
| `EMAILJS_PUBLIC_KEY` | Optional | EmailJS Public Key | `your_emailjs_public_key` |
| `EMAILJS_PRIVATE_KEY`| Optional | EmailJS Private Key | `your_emailjs_private_key` |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth 2.0 Client ID | `your_google_client_id` |
| `GOOGLE_CLIENT_SECRET`| Optional | Google OAuth 2.0 Client Secret | `your_google_client_secret` |
| `GITHUB_CLIENT_ID` | Optional | GitHub OAuth 2.0 Client ID | `your_github_client_id` |
| `GITHUB_CLIENT_SECRET`| Optional | GitHub OAuth 2.0 Client Secret | `your_github_client_secret` |

### Frontend Configuration (`frontend/.env`)

| Variable | Required | Description | Example Placeholder |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Optional | Custom backend API base URL (Default: `http://localhost:5000/api`) | `http://localhost:5000/api` |

---

## 🚀 Getting Started & Local Development

### Prerequisites
- **Node.js**: `v18.x` or `v20.x`
- **npm**: `v9.x` or higher
- **MongoDB**: Running local MongoDB instance or MongoDB Atlas URI
- **Redis**: Running Upstash Redis instance with TLS support
- **GitHub PAT**: GitHub Personal Access Token with repo creation permissions

### Setup Guide

#### 1. Clone the Repository
```bash
git clone https://github.com/Shivam-kr-00/ProblemSolver.git
cd ProblemSolver
```

#### 2. Configure Backend
Open a terminal for the backend:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
MONGODB_URI=mongodb://localhost:27017/problemsolver
UPSTASH_REDIS_URL=rediss://default:your_token@your-redis.upstash.io:6379
JWT_SECRET=your_jwt_secret
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
GITHUB_TOKEN=ghp_your_github_personal_token
```

Start the backend development server:
```bash
npm run dev
```

#### 3. Configure Frontend
Open a second terminal for the frontend:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

#### 4. Access the Application
Open your browser and navigate to `http://localhost:5173`.

---

## 🐳 Docker Support

### Development Environment (Docker Compose)
To start both the frontend and backend in development mode:

```bash
docker compose up --build
```
- Backend API will run on `http://localhost:5000`
- Frontend UI will run on `http://localhost:5173`

### Production Environment (Docker Compose)
To launch the production container setup (Frontend bundled with Nginx):

```bash
docker compose -f docker-compose.prod.yml up --build -d
```
- Backend API will run on `http://localhost:5000`
- Production Frontend (Nginx static proxy) will run on `http://localhost:8080`

---

## 🧪 Testing

The backend includes an integration test suite using **Jest** and **Supertest**.

The tests verify:
- `POST /api/auth/signup` (Registration payload verification and Redis/OTP handling)
- `POST /api/auth/login` (Credential check and 2FA OTP trigger)
- `POST /api/auth/logout` (Cookie clearing and Redis token purging)

To run the backend test suite:

```bash
cd backend
npm test
```

---

## 🔒 Security Implementation & Considerations

### Implemented Security Mechanisms
- **HTTPOnly Cookies**: Access and Refresh tokens are delivered via `HTTPOnly` and `SameSite` cookies, protecting against XSS-based token theft.
- **Refresh Token Revocation**: Active refresh tokens are tracked in Redis. Logout immediately deletes the session entry in Redis, invalidating future refresh attempts.
- **Stateless Passport OAuth Configuration**: Passport strategies specify `state: false` to avoid reliance on server-side `express-session` storage while running JWT token exchanges.
- **Bcrypt Password & OTP Hashing**: Passwords and 2FA OTP codes are salted and hashed using `bcryptjs`.
- **Dynamic CORS Whitelisting**: Allows explicit origins and dynamically validates Vercel preview environments (`*.vercel.app`).
- **Task Hoarding Prevention**: Limits active tasks per user to a maximum of 2.
- **Octokit PR Verification**: Validates GitHub PR existence and merge status via Octokit before allowing task state transitions.

### Security Considerations & Recommended Improvements
> [!IMPORTANT]
> - **GitHub Webhook Signature Verification**: Incoming Webhook requests on `/api/webhooks/github` currently process payload events without validating `X-Hub-Signature-256`. Implementing HMAC SHA256 signature verification is strongly recommended for production environments.
> - **Rate Limiting**: `rateLimit.middleware.js` is currently unpopulated. Adding `express-rate-limit` for login and OTP verification endpoints is recommended to protect against brute-force attacks.

---

## 🚀 Deployment Configuration

- **Backend**: Deployed on platforms such as Render or AWS. Standard start command: `npm start` (`node src/server.js`).
- **Frontend**: Configured for Vercel deployment (`vercel.json`) or static hosting via Nginx (`frontend/nginx.conf`).

---

## 📐 Architectural Decisions

- **Why Redis?**: Provides high-performance TTL key storage for temporary user signups (600s TTL) and enables instant revocation of JWT refresh tokens upon logout without querying MongoDB.
- **Why MongoDB?**: Schema flexibility allows easy nested references between problems, tasks, and users, while native text indexes power multi-field search.
- **Why Socket.IO?**: Low-latency bidirectional communication organized cleanly by problem rooms (`problemId`), enabling instant live chat updates.
- **Why Octokit & Webhooks?**: Integrates open-source workflow directly into GitHub, removing manual verification overhead for problem submitters and administrators.

---

## 🗺️ Future Improvements & Roadmap

### Implemented
- [x] Dual-factor OTP authentication for signup and login
- [x] Google & GitHub OAuth SSO with account linking
- [x] Automated GitHub public repository creation on problem submission
- [x] Task lifecycle state machine with PR validation
- [x] Real-time chat rooms via Socket.IO
- [x] Reputation leaderboard & Cloudinary profile integration

### Recommended / Future Roadmap
- [ ] Implement GitHub Webhook Signature Verification (`X-Hub-Signature-256`)
- [ ] Populate `rateLimit.middleware.js` with Express Rate Limiter for auth endpoints
- [ ] Implement automated code coverage reporting in CI/CD pipeline
- [ ] Add email notification options for claimed task updates and PR reviews

---

## 🤝 Contributing

Contributions are welcome! Follow these steps to contribute:

1. **Fork** the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add amazing feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a **Pull Request**.

---

## 📜 License

This project is licensed under the **ISC License**.
