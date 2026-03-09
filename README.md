# 🔨 BuildMate

> *Because emailing your professor "sir please give me project" deserved a better alternative.*

**BuildMate** is a full-stack collaboration portal built for **Adani University** students where professors post real-world projects, students apply, get selected, collaborate, and actually build things that matter. Think LinkedIn meets GitHub meets your college notice board — but make it useful.

---

## ✨ What's Inside

| Feature | Description |
|---|---|
| 🔐 Auth | Email + password login, restricted to `@adaniuni.ac.in` only |
| 📋 Dashboard | See your active projects, tasks, timelines and resources |
| 🔍 Discover | Browse open projects posted by professors |
| 🤖 ML Recommendations | AI-powered project suggestions based on your profile (FastAPI backend) |
| 👤 Profile | Your skills, completed projects, badges and CV |
| 🏆 Leaderboard | Because some people need external validation and that's okay |
| 💬 Chat | Project-level messaging |
| 🎓 Certificates | Auto-generated certificates on project completion |
| 🔑 Role System | `USER`, `PROFESSOR`, `ADMIN` — everyone has their place |

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL via [Neon](https://neon.tech) + Prisma ORM
- **Auth**: NextAuth with Credentials Provider (bcryptjs)
- **ML Backend**: FastAPI + scikit-learn (runs on Python)
- **UI**: Tailwind CSS + Radix UI + shadcn/ui
- **Deployment**: Vercel (Next.js) + Render (ML)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+
- Python 3.10+ (only for ML features)
- A [Neon](https://neon.tech) account (free — takes 2 minutes)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/collabnest.git
cd collabnest
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:
```env
DATABASE_URL="postgresql://..."         # Your Neon connection string
NEXTAUTH_SECRET="generate-below"        # Run: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"
```

> Get `DATABASE_URL` from [console.neon.tech](https://console.neon.tech) → your project → Connection Details → **Prisma** dropdown.

### 4. Push the database schema
```bash
npx prisma db push
```

### 5. (Optional) Seed test data
```bash
npx prisma db seed
```

### 6. Run the app
```bash
npm run dev
```

Go to [http://localhost:3000/welcome](http://localhost:3000/welcome), sign up with your `@adaniuni.ac.in` email, and you're in.

---

## 🤖 ML Backend (Optional)

Powers the project recommendation engine on the Discover page. Skip this if you don't need recommendations.

```bash
cd ML
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Set `APP_URL` env var on the ML service to point to your Next.js app URL.

---

## 🌍 Deploying to Production

### Next.js → Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repo
3. Add environment variables:
   ```
   DATABASE_URL          → your Neon URL
   NEXTAUTH_SECRET       → your generated secret
   NEXTAUTH_URL          → https://your-app.vercel.app
   NEXT_PUBLIC_BACKEND_URL → https://your-ml-backend.onrender.com
   ```
4. Hit Deploy. Done. Go touch grass.

### ML Backend → Render

1. Go to [render.com](https://render.com) → New Web Service → connect repo
2. Set:
   - Root Directory: `ML`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port 8000`
   - Env var: `APP_URL=https://your-app.vercel.app`
3. Deploy

---

## 🗂 Project Structure

```
├── app/                  # Next.js App Router pages & API routes
│   ├── api/              # All backend API endpoints
│   ├── dashboard/        # Student/professor dashboard
│   ├── discover/         # Browse open projects
│   ├── profile/          # User profile pages
│   ├── leaderboard/      # Rankings
│   └── welcome/          # Login / Sign up page
├── components/           # Reusable UI components
├── lib/                  # Auth config, Prisma client, utilities
├── prisma/               # Database schema + seed data
├── ML/                   # FastAPI ML recommendation service
└── .env                  # Your secrets (DO NOT COMMIT THIS)
```

---

## 🔒 Auth Rules

- Only `@adaniuni.ac.in` emails can register or sign in — enforced at the API level, not just the UI
- Passwords are hashed with bcrypt (12 rounds) before hitting the database
- Sessions are JWT-based with a 30-day expiry

---

## 💡 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Random secret for JWT signing |
| `NEXTAUTH_URL` | ✅ | Full URL of the app (with https in prod) |
| `NEXT_PUBLIC_BACKEND_URL` | ⚡ Optional | URL of the ML FastAPI service |

---

## 🐛 Common Issues

**`prisma db push` fails with "environment variable not found"**
→ Make sure your `.env` file exists at the project root (not inside any subfolder).

**Login says "Invalid email or password"**
→ Make sure you signed up first. And yes, it has to be `@adaniuni.ac.in`.

**ML recommendations not loading**
→ The ML backend isn't running. Either start it locally or skip it — the rest of the app works fine without it.

---

## 📄 License

Built for Adani University. Built with BuildMate. Use it, break it, improve it.

