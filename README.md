# SubTrack

A subscription management platform that helps you track, monitor, and optimize recurring digital expenses. Built to solve "subscription fatigue" — the problem of forgetting about services that quietly drain your account every month.

![SubTrack Dashboard](https://img.shields.io/badge/status-live-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Prisma](https://img.shields.io/badge/Prisma-7-2D3748)

## Features

- **Dashboard** — Monthly and annual burn rate, upcoming bills with urgency indicators, category breakdown
- **Subscription tracking** — Add, edit, and cancel subscriptions with support for trials, forex amounts, and direct cancellation links
- **48-hour email reminders** — Automated daily cron job sends email alerts before billing dates
- **Analytics** — Active spend trends, category breakdown, historical spend including cancelled subscriptions
- **Email history** — Log of all reminder emails sent to your account
- **Profile management** — Edit display name, view account stats, delete account

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.9 |
| Database | PostgreSQL via Neon |
| ORM | Prisma v7 |
| Authentication | Auth.js v5 (Google OAuth) |
| Email | Nodemailer (Gmail SMTP) |
| Styling | Tailwind CSS v4 |
| Deployment | Vercel |
| Cron | Vercel Cron Jobs |

## Architecture Highlights

- **React Server Components** for zero-client-fetch data loading — pages render with data already fetched on the server
- **Server Actions** for form submissions — no API routes needed for mutations
- **Prisma adapter pattern** — Auth.js automatically creates and manages User, Account, and Session rows
- **Soft delete** — cancelled subscriptions are preserved for historical analytics
- **Duplicate email prevention** — `lastNotifiedAt` field ensures one reminder per billing cycle

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- A Google Cloud project with OAuth credentials
- A Gmail account with an App Password

### Installation

```bash
git clone https://github.com/AmeyaSingh23/SubTrack.git
cd SubTrack
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```bash
DATABASE_URL="your-neon-connection-string"
AUTH_SECRET="generate-with-npx-auth-secret"
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"
AUTH_URL="http://localhost:3000"
EMAIL_FROM="your-gmail@gmail.com"
EMAIL_PASSWORD="your-16-char-app-password"
CRON_SECRET="your-random-secret"
```

### Database Setup

```bash
npx prisma db push
npx prisma generate
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
subtrack/
├── app/
│   ├── (auth)/login/          # Public login page
│   ├── (dashboard)/           # Protected app pages
│   │   ├── dashboard/         # Main overview
│   │   ├── subscriptions/     # List + add + detail pages
│   │   ├── analytics/         # Spending analytics
│   │   ├── reminders/         # Email history
│   │   └── profile/           # User profile
│   ├── api/
│   │   ├── auth/[...nextauth]/ # Auth.js handler
│   │   └── cron/reminders/    # Daily email cron endpoint
│   └── actions/               # Server Actions
├── components/
│   ├── dashboard/             # Burn rate, upcoming bills, category charts
│   ├── subscriptions/         # Add/edit forms, list
│   ├── analytics/             # Recharts-based spending charts
│   ├── profile/               # Profile form
│   └── layout/                # Sidebar, theme toggle
├── lib/
│   ├── db.ts                  # Prisma singleton client
│   └── email.ts               # Nodemailer email utility
└── prisma/
    └── schema.prisma          # Database schema
```

## Deployment

The app is deployed on Vercel with automatic deployments on every push to `main`. The cron job runs daily at 3:00 AM UTC (8:30 AM IST) via Vercel Cron.

To deploy your own instance:

1. Push to GitHub
2. Import the repo on [Vercel](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Add your production URL to Google OAuth authorized redirect URIs

## License

MIT

---

Built as a 4th semester CS portfolio project at BMS College of Engineering.