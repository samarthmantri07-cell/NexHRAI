<div align="center">

# 🧠 NexHRAI

### *AI-Powered Workforce Intelligence Platform*

**Predict attrition. Explain decisions. Empower HR teams with data-driven intelligence.**

[![Made with Next.js](https://img.shields.io/badge/Frontend-Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/ML%20Service-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](#-license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](#-contributing)
[![Build Status](https://img.shields.io/badge/build-passing-success.svg?style=flat-square)](#)
[![Stars](https://img.shields.io/github/stars/your-org/nexhrai?style=flat-square)](#)
[![Issues](https://img.shields.io/github/issues/your-org/nexhrai?style=flat-square)](#)

<br/>

<!-- 🖼️ BANNER PLACEHOLDER -->
<img src="./docs/assets/banner.png" alt="NexHRAI Banner" width="100%"/>

<br/>

[Overview](#-project-overview) •
[Features](#-features) •
[Screenshots](#-screenshots) •
[Architecture](#-architecture-diagram) •
[Installation](#-installation-guide) •
[API](#-api-endpoints) •
[Contributing](#-contributing)

</div>

<br/>

---

## 📖 Project Overview

> **NexHRAI** is a full-stack, enterprise-grade **Workforce Intelligence Platform** that empowers HR teams to move beyond spreadsheets and gut feelings — into a world of **predictive, explainable, and data-driven decision-making**.

Modern organizations lose millions every year due to unplanned employee attrition. NexHRAI tackles this head-on by combining a **Machine Learning prediction engine**, **Explainable AI (SHAP)**, and a **premium enterprise dashboard** into a single unified platform — helping HR leaders answer the one question that matters most:

> *"Which employees are at risk of leaving, and why?"*

NexHRAI is built with a **microservice-oriented architecture**, separating concerns cleanly across a **Next.js frontend**, a **Node.js/Express backend**, and a **Python/FastAPI ML service** — all communicating through well-defined REST contracts and backed by a robust PostgreSQL data layer.

<br/>

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 👥 Core HR Management
- 🔐 **Secure Authentication** — JWT-based, role-aware auth
- 🧑‍💼 **Employee Management** — Full lifecycle CRUD operations
- 📇 **Employee Directory** — Searchable, filterable, paginated
- 📊 **Executive Dashboard** — High-level KPIs at a glance
- 💰 **Salary Analytics** — Compensation trends & benchmarking
- 📈 **Workforce Analytics** — Headcount, tenure, department insights

</td>
<td width="50%" valign="top">

### 🤖 AI & Intelligence
- 🧠 **AI Prediction Engine** — ML-driven attrition forecasting
- 🔍 **Explainable AI (SHAP)** — Transparent, per-employee reasoning
- 🕓 **Prediction History** — Full audit trail of AI predictions
- 💡 **AI Recommendations** — Actionable retention strategies
- 📉 **Attrition Analytics** — Risk segmentation & trend detection
- 📊 **Interactive Charts** — Rich, animated data visualizations

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🎨 Experience & UI
- 🖌️ **Premium Enterprise UI** — ShadCN + Tailwind design system
- 🎬 **Animated Landing Page** — Framer Motion + GSAP + Three.js
- 📱 **Fully Responsive** — Optimized for desktop, tablet & mobile

</td>
<td width="50%" valign="top">

### ⚙️ Engineering Excellence
- 🧩 **Modular Microservice Architecture**
- 🛡️ **Type-Safe End-to-End** (TypeScript + Prisma)
- ⚡ **React Query** for optimized data fetching & caching

</td>
</tr>
</table>

<br/>


## 🏗️ Architecture Diagram

```mermaid
graph TB
    subgraph Client["🖥️ Client Layer"]
        A[Next.js + React + TypeScript]
        A1[Tailwind CSS + ShadCN UI]
        A2[Framer Motion + GSAP + Three.js]
    end

    subgraph Backend["⚙️ Application Layer"]
        B[Express.js API Server]
        B1[JWT Auth Middleware]
        B2[Prisma ORM]
    end

    subgraph ML["🧠 Machine Learning Layer"]
        C[FastAPI ML Service]
        C1[Scikit-learn / XGBoost Models]
        C2[SHAP Explainability Engine]
    end

    subgraph Data["🗄️ Data Layer"]
        D[(PostgreSQL Database)]
    end

    A -->|REST / Axios| B
    B -->|Prisma Client| D
    B -->|HTTP Request| C
    C -->|Predictions + SHAP Values| B
    C1 --> C
    C2 --> C
    B1 --> B
    B2 --> B

    style Client fill:#0ea5e9,stroke:#0284c7,color:#fff
    style Backend fill:#6366f1,stroke:#4f46e5,color:#fff
    style ML fill:#10b981,stroke:#059669,color:#fff
    style Data fill:#f59e0b,stroke:#d97706,color:#fff
```

<br/>

## 🔄 System Workflow

```mermaid
sequenceDiagram
    actor HR as 👤 HR User
    participant FE as 🖥️ Frontend (Next.js)
    participant BE as ⚙️ Backend (Express)
    participant ML as 🧠 ML Service (FastAPI)
    participant DB as 🗄️ PostgreSQL

    HR->>FE: Login / Authenticate
    FE->>BE: POST /api/auth/login
    BE->>DB: Validate credentials
    DB-->>BE: User record
    BE-->>FE: JWT Token

    HR->>FE: View Employee Profile
    FE->>BE: GET /api/employees/:id
    BE->>DB: Fetch employee data
    DB-->>BE: Employee record
    BE-->>FE: Employee JSON

    HR->>FE: Request Attrition Prediction
    FE->>BE: POST /api/predict/:employeeId
    BE->>ML: POST /predict (employee features)
    ML->>ML: Run XGBoost model
    ML->>ML: Compute SHAP values
    ML-->>BE: Prediction + Explanation
    BE->>DB: Store prediction history
    BE-->>FE: Prediction result
    FE-->>HR: 📊 Risk score + AI explanation
```

<br/>

## 📂 Folder Structure

```
NexHRAI/
├── apps/
│   ├── frontend/                 # Next.js application
│   │   ├── src/
│   │   │   ├── app/              # App router pages
│   │   │   ├── components/       # Reusable UI components
│   │   │   ├── features/         # Feature-based modules
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── lib/              # Utilities & API clients
│   │   │   └── styles/           # Global styles / Tailwind config
│   │   └── public/               # Static assets
│   │
│   ├── backend/                  # Express.js API server
│   │   ├── src/
│   │   │   ├── controllers/      # Route controllers
│   │   │   ├── routes/           # API route definitions
│   │   │   ├── middlewares/      # Auth, error handling, etc.
│   │   │   ├── services/         # Business logic
│   │   │   ├── prisma/           # Prisma schema & migrations
│   │   │   └── utils/            # Helper functions
│   │   └── tests/
│   │
│   └── ml-service/               # Python FastAPI ML microservice
│       ├── app/
│       │   ├── models/           # Trained ML models (.pkl)
│       │   ├── routers/          # FastAPI route handlers
│       │   ├── services/         # Prediction & SHAP logic
│       │   └── schemas/          # Pydantic request/response models
│       ├── notebooks/            # Model training notebooks
│       └── requirements.txt
│
├── docs/
│   └── assets/                   # README images, diagrams, banners
│
├── .env.example
├── docker-compose.yml
├── LICENSE
└── README.md
```

<br/>

## 🧰 Technology Stack

<div align="center">

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js** | React framework with SSR/SSG |
| **React** | Component-driven UI |
| **TypeScript** | Static typing & safety |
| **Tailwind CSS** | Utility-first styling |
| **ShadCN UI** | Accessible component primitives |
| **Framer Motion** | UI animations & transitions |
| **GSAP** | Advanced scroll & timeline animation |
| **Three.js** | 3D visuals for landing page |
| **React Query** | Server-state management & caching |
| **Axios** | HTTP client |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | REST API framework |
| **TypeScript** | Type-safe backend logic |
| **Prisma ORM** | Type-safe database access |
| **JWT** | Stateless authentication |

### Database
| Technology | Purpose |
|---|---|
| **PostgreSQL** | Relational data store |

### Machine Learning
| Technology | Purpose |
|---|---|
| **Python** | ML service language |
| **FastAPI** | High-performance ML API |
| **Scikit-learn** | Model preprocessing & baselines |
| **XGBoost** | Gradient-boosted prediction model |
| **SHAP** | Model explainability |
| **Pandas / NumPy** | Data manipulation |
| **Joblib** | Model serialization |

</div>

<br/>

## 🚀 Installation Guide

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | ≥ 18.x |
| Python | ≥ 3.10 |
| PostgreSQL | ≥ 14.x |
| npm / pnpm | Latest |

### Clone the Repository

```bash
git clone https://github.com/your-org/nexhrai.git
cd nexhrai
```

<br/>

## 🔐 Environment Variables

Create a `.env` file in each service directory based on `.env.example`:

**`apps/backend/.env`**
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/nexhrai
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
ML_SERVICE_URL=http://localhost:8000
```

**`apps/frontend/.env.local`**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=NexHRAI
```

**`apps/ml-service/.env`**
```env
MODEL_PATH=./app/models/attrition_model.pkl
LOG_LEVEL=info
```

<br/>

## 🖥️ Running Frontend

```bash
cd apps/frontend
npm install
npm run dev
```
➡️ Runs at `http://localhost:3000`

<br/>

## ⚙️ Running Backend

```bash
cd apps/backend
npm install
npx prisma migrate dev
npm run dev
```
➡️ Runs at `http://localhost:5000`

<br/>

## 🧠 Running ML Service

```bash
cd apps/ml-service
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
➡️ Runs at `http://localhost:8000`

<br/>

## 📡 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate & receive JWT |
| `GET` | `/api/auth/me` | Get current authenticated user |

### 🧑‍💼 Employee Management
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/employees` | List all employees |
| `GET` | `/api/employees/:id` | Get employee details |
| `POST` | `/api/employees` | Create new employee |
| `PUT` | `/api/employees/:id` | Update employee |
| `DELETE` | `/api/employees/:id` | Remove employee |

### 📊 Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/workforce` | Workforce trend metrics |
| `GET` | `/api/analytics/salary` | Salary distribution & trends |
| `GET` | `/api/analytics/attrition` | Attrition rate & risk breakdown |

### 🧠 AI Prediction
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/predict/:employeeId` | Run attrition prediction for an employee |
| `GET` | `/api/predict/history/:employeeId` | Get prediction history |
| `GET` | `/api/predict/explain/:predictionId` | Get SHAP explanation for a prediction |

### 🧩 ML Service (Internal)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/predict` | Returns attrition probability |
| `POST` | `/explain` | Returns SHAP feature contributions |
| `GET` | `/health` | ML service health check |

<br/>

## 🔬 Machine Learning Pipeline

```mermaid
flowchart LR
    A[📥 Raw HR Data] --> B[🧹 Data Cleaning]
    B --> C[🛠️ Feature Engineering]
    C --> D[⚖️ Train/Test Split]
    D --> E[🌲 Model Training<br/>XGBoost / Scikit-learn]
    E --> F[📏 Model Evaluation]
    F --> G{✅ Meets Threshold?}
    G -- No --> C
    G -- Yes --> H[💾 Serialize with Joblib]
    H --> I[🚀 Deploy to FastAPI Service]

    style A fill:#f59e0b,color:#fff
    style E fill:#10b981,color:#fff
    style H fill:#6366f1,color:#fff
    style I fill:#0ea5e9,color:#fff
```

<br/>

## 🎯 AI Prediction Flow

```mermaid
flowchart TD
    A[👤 HR Requests Prediction] --> B[⚙️ Backend Gathers Employee Features]
    B --> C[📡 Send Features to ML Service]
    C --> D[🌲 XGBoost Model Inference]
    D --> E[📊 Attrition Risk Score]
    D --> F[🔍 SHAP Value Computation]
    E --> G[💾 Store in Prediction History]
    F --> G
    G --> H[💡 Generate AI Recommendations]
    H --> I[🖥️ Display on Dashboard]

    style D fill:#10b981,color:#fff
    style F fill:#f59e0b,color:#fff
    style I fill:#0ea5e9,color:#fff
```

<br/>

## 🔍 Explainable AI Section

NexHRAI doesn't just predict — it **explains**. Every prediction is paired with a transparent breakdown powered by **SHAP (SHapley Additive exPlanations)**, so HR teams understand exactly *why* the model flagged an employee as high-risk.

**Why Explainability Matters:**

- ✅ Builds trust between HR teams and the AI system
- ✅ Surfaces the top contributing factors (e.g. tenure, salary band, workload, engagement score)
- ✅ Enables targeted, evidence-based retention strategies
- ✅ Supports fair, auditable, and compliant AI decision-making

**Example SHAP Output:**

| Feature | Contribution | Impact |
|---|---|---|
| `MonthlyIncome` | −0.32 | 🔻 Decreases attrition risk |
| `OverTime` | +0.28 | 🔺 Increases attrition risk |
| `YearsAtCompany` | −0.19 | 🔻 Decreases attrition risk |
| `JobSatisfaction` | +0.21 | 🔺 Increases attrition risk |
| `DistanceFromHome` | +0.11 | 🔺 Increases attrition risk |

<br/>

## 🔮 Future Scope

- 🌐 Multi-language / i18n support
- 📱 Native mobile app (React Native)
- 🔔 Real-time notifications & alerts (WebSockets)
- 🧬 Deep learning-based prediction models
- 🗣️ Conversational AI HR assistant (LLM-powered)
- 🏢 Multi-tenant SaaS support for enterprises
- 📤 Automated HR report generation & export
- 🔗 Integrations with Slack, Teams, and major HRMS platforms

<br/>

## ☁️ Deployment Architecture

```mermaid
graph TB
    subgraph CDN["🌍 Edge / CDN"]
        V[Vercel - Next.js Frontend]
    end

    subgraph Cloud["☁️ Cloud Infrastructure"]
        R[Render / Railway - Express Backend]
        F[FastAPI ML Service - Container]
        P[(Managed PostgreSQL)]
    end

    subgraph Monitoring["📈 Observability"]
        L[Logging & Monitoring]
    end

    Users((🧑‍💻 Users)) --> V
    V -->|HTTPS/REST| R
    R -->|Prisma| P
    R -->|Internal HTTP| F
    R --> L
    F --> L

    style CDN fill:#0ea5e9,color:#fff
    style Cloud fill:#6366f1,color:#fff
    style Monitoring fill:#f59e0b,color:#fff
```

<br/>

## 📊 Project Statistics

<div align="center">

| Metric | Value |
|---|---|
| 🧩 Microservices | 3 (Frontend, Backend, ML) |
| 📡 API Endpoints | 20+ |
| 🧠 ML Model Type | XGBoost Classifier |
| 🎯 Explainability | SHAP-based |
| 🗄️ Database | PostgreSQL (Prisma ORM) |
| 🎨 UI Components | ShadCN + Tailwind |
| 📱 Responsive | 100% Mobile-Ready |

</div>

<br/>

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔁 Open a Pull Request

Please make sure to update tests as appropriate and follow the existing code style.

<br/>

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

<br/>

## 👨‍💻 Author

<div align="center">

**Built and maintained with ❤️ by [Your Name]**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/your-username)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/your-profile)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/your-handle)

</div>

<br/>

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) — The React framework powering the frontend
- [ShadCN UI](https://ui.shadcn.com/) — Beautiful, accessible component primitives
- [FastAPI](https://fastapi.tiangolo.com/) — For blazing-fast ML API serving
- [SHAP](https://shap.readthedocs.io/) — For making AI explainable
- [Prisma](https://www.prisma.io/) — For a delightful database experience
- The open-source community ❤️

<br/>

<div align="center">

### ⭐ If you find NexHRAI useful, consider giving it a star!

**Made with 🧠 AI, ☕ Coffee, and a passion for better HR technology - by Samarth.**

</div>
