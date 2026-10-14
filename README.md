# Food-Safety-Platform
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

It is a student feedback platform where students give feedback on campus area food hotels.

## Getting Started

Create a `.env.local` file and configure the database and authentication values:

```env
DATABASE_URL=your_postgres_connection_string
AUTH_SECRET=your_random_auth_secret
AUTH_RESEND_KEY=your_valid_resend_api_key
AUTH_EMAIL_FROM="Campus Eats <your-verified-sender@example.com>"
UNIVERSITY_EMAIL_DOMAIN=diu.edu.bd
```

The Resend API key must be valid, and the sender address must be permitted by
your Resend account. Never commit `.env.local` or share its secrets.

Apply the database schema and seed the 60 sample restaurants:

```bash
npm run db:push
npm run db:seed
```

Run the seed command again to refresh those sample restaurant records; it
updates existing records by name rather than adding duplicates. Ratings and
review totals are calculated from student reviews.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses `next/font` to automatically optimize and load Geist, a new font family for Vercel.

## Learn More

Check out the [Next.js documentation](https://nextjs.org/docs) and the [Next.js learning course](https://nextjs.org/learn).

## Deploy on Vercel

The easiest way to deploy this app is through [Vercel](https://vercel.com/new).
