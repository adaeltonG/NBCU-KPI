# KPI Report Tool - NBCU Monthly Scorecard

A modern, web-based KPI reporting system built with React, TypeScript, Vite, Prisma, and PostgreSQL. Designed to replace Excel-based KPI tracking with a visual, interactive dashboard.

## 🎯 Features

- **Visual Dashboard**: Overall score rings, category performance cards, trend charts
- **KPI Scorecard**: Complete table with 23 KPIs, monthly scores, YTD calculations
- **Score Entry**: Easy-to-use forms for managers to enter monthly KPI data
- **Client Scoring**: NBCU client star rating and justification system
- **Score Comparison**: View Sodexo, NBCU, or Average scores
- **Evidence Management**: Upload and attach supporting documents to KPIs
- **Comments System**: Add notes and discussions per KPI
- **Action Tracking**: Manage action items with due dates and status
- **Monthly/YTD Views**: Track performance over time

## 🗂️ KPI Categories

1. **HSEQ** - Health, Safety, Environment & Quality (KPIs 1-3)
2. **Customer Satisfaction** - Customer/Stakeholder (KPIs 4-16)
3. **People** - Retention & Development (KPIs 17-18)
4. **Finance** - Variable Billing (KPI 19)
5. **Projects** - Project Management (KPI 20)
6. **Reports** - Accuracy/Timeliness (KPI 21)
7. **Support** - Supporting NBCU (KPI 22)
8. **Process** - Processes & Procedures (KPI 23)

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, Framer Motion
- **Charts**: Recharts
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **API**: REST API

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 14+

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd kpi-app
npm install
```

### 2. Configure Database

#### Option A: Using pgAdmin or psql

1. Open pgAdmin or psql
2. Create a new user or use existing postgres user
3. Set/change password to: `NBCSodexo258`
4. Create database named `kpi_report`

**SQL Commands (run in psql):**
```sql
-- If using postgres user, change password:
ALTER USER postgres WITH PASSWORD 'NBCSodexo258';

-- Create the database:
CREATE DATABASE kpi_report;
```

#### Option B: Using Command Line

```bash
# Windows (run as Administrator)
psql -U postgres
# Enter your current postgres password

# Then run:
ALTER USER postgres WITH PASSWORD 'NBCSodexo258';
CREATE DATABASE kpi_report;
\q
```

**Database Credentials:**
- Host: `localhost`
- Port: `5432`
- Database: `kpi_report`
- Username: `postgres`
- Password: `NBCSodexo258`

The `.env` file is pre-configured with:
```
DATABASE_URL="postgresql://postgres:NBCSodexo258@localhost:5432/kpi_report?schema=public"
```

⚠️ **If your postgres password is different**, update the `.env` file accordingly.

### 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with Excel data
npm run db:seed
```

### 4. Start Development

```bash
# Start both frontend and backend
npm run dev:all

# Or run separately:
npm run dev          # Frontend (http://localhost:5173)
npm run dev:server   # Backend API (http://localhost:3001)
```

## 📁 Project Structure

```
kpi-app/
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding script
├── server/
│   └── index.ts          # Express API server
├── src/
│   ├── components/
│   │   ├── Dashboard/    # Dashboard components
│   │   └── Layout/       # Layout components
│   ├── data/
│   │   └── mockData.ts   # Mock data (for offline use)
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── KPIScorecard.tsx
│   │   ├── KPIDetail.tsx
│   │   ├── ScoreEntry.tsx
│   │   ├── ClientScoring.tsx
│   │   └── MonthlyView.tsx
│   └── types/
│       └── index.ts      # TypeScript types
├── .env                  # Environment variables
└── package.json
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/categories` | List all categories |
| GET | `/api/service-lines` | List service lines |
| GET | `/api/periods` | List all periods |
| GET | `/api/kpis` | List all KPIs |
| GET | `/api/kpis/:id` | Get KPI details |
| GET | `/api/scores` | List scores |
| POST | `/api/scores` | Create/update score |
| GET | `/api/client-scores` | List client scores |
| POST | `/api/client-scores` | Create client score |
| GET | `/api/comments` | List comments |
| POST | `/api/comments` | Create comment |
| GET | `/api/evidence` | List evidence |
| POST | `/api/evidence` | Create evidence |
| GET | `/api/actions` | List actions |
| POST | `/api/actions` | Create action |
| PATCH | `/api/actions/:id` | Update action status |
| GET | `/api/users` | List users |
| GET | `/api/dashboard/stats` | Dashboard statistics |

## 🗄️ Database Commands

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:migrate    # Run migrations
npm run db:seed       # Seed database
npm run db:studio     # Open Prisma Studio
npm run db:reset      # Reset and re-seed database
```

## 📊 Score Display Modes

The application supports three score display modes:
- **Sodexo Score**: Internal contractor scoring
- **NBCU Score**: Client scoring (1-5 stars)
- **Average Score**: Combined average of both

## 👥 Default Users

| Email | Role | Description |
|-------|------|-------------|
| admin@sodexo.com | ADMIN | Account Manager |
| catering@sodexo.com | MANAGER | Catering Manager |
| soft@sodexo.com | MANAGER | Soft Services Manager |
| tech@sodexo.com | MANAGER | Technical Manager |
| client@nbcu.com | CLIENT | NBCU Client |

## 📝 License

Proprietary - Sodexo / NBCU

## 🔐 Security Note

**Database Password:** `NBCSodexo258`

⚠️ Change this password in production environments!
