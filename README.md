# VGMF Portal

Vaidya Gogate Memorial Foundation - Unified Portal built with Next.js.

## Tech Stack
- **Next.js 16** + React 19 + TypeScript
- **Tailwind CSS 4** with custom navy/gold/cream design system
- **Prisma ORM** connected to Neon PostgreSQL
- **NextAuth v5** with credentials authentication

## Getting Started
```bash
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

## Environment Variables
Create `.env`:
```
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy on Vercel
1. Connect this repo to Vercel
2. Framework: Next.js (auto-detected)
3. Add environment variables
4. Deploy
