<<<<<<< HEAD
# BOTFILTA AI

Premium AI-powered WhatsApp CRM + AI Assistant for businesses.

## Stack

- **Next.js 15** · React · TypeScript · Tailwind CSS v4
- **Framer Motion** · Shadcn-style UI components
- **Supabase** — database, auth, realtime
- **Google Gemini 2.5 Flash** — bilingual AI (Urdu + English)
- **Meta WhatsApp Cloud API** — messaging & webhooks

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (server only) |
| `GEMINI_API_KEY` | Google AI Studio API key |
| `WHATSAPP_ACCESS_TOKEN` | Meta WhatsApp token |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone number ID |
| `WHATSAPP_VERIFY_TOKEN` | Webhook verify token |

### 3. Database

Run `supabase/schema.sql` in your Supabase SQL editor.

### 4. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/                # Auth
│   ├── dashboard/            # App (9 sections)
│   └── api/
│       ├── ai/chat/          # Gemini AI endpoint
│       └── whatsapp/         # Webhook + send
├── components/
│   ├── landing/              # Marketing sections
│   ├── dashboard/            # App shell
│   └── ui/                   # Design system
└── lib/
    ├── ai/                   # Gemini service layer
    ├── whatsapp/             # Cloud API client
    └── supabase/             # DB clients
```

## Dashboard Sections

1. Overview — KPIs, charts, recent chats
2. Shared Inbox — Intercom-style team inbox
3. Customers — CRM with tags & sentiment
4. Products — Catalog for AI answers
5. Orders — Order tracking
6. AI Assistant — Playground & config
7. Analytics — Revenue & AI metrics
8. Team — Performance tracking
9. Settings — WhatsApp & AI integration

## WhatsApp Webhook

Point Meta webhook to:

```
https://your-domain.com/api/whatsapp/webhook
```

## License

Proprietary — BOTFILTA AI
=======
# BOTFILTA
>>>>>>> c6e00268d3e4c067f2eebafc62f71c01d99f19d4
