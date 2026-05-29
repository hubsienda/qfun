# QOOBIX

QOOBIX is a private AI-powered market-intelligence system provisioned for different clients, sectors, countries, products, and commercial objectives.

It is not a public SaaS, not a CRM, and not a dashboard monster.

## Core doctrine

Store the job, not the intelligence.

The database stores client configuration, access codes, job metadata, job status, report file metadata, and operational logs.

Generated intelligence, lead lists, competitor notes, partner lists, and commercial outputs are delivered as downloadable DOCX and XLSX files.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Postgres
- Supabase Storage or equivalent file storage
- OpenAI API
- Vercel deployment

## Required environment variables

```txt
OPENAI_API_KEY=
OPENAI_MODEL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
QOOBIX_ADMIN_PASSWORD=
QOOBIX_FILE_RETENTION_DAYS=30
QOOBIX_APP_URL=https://qoobix.com
