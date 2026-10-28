# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: Google Gemini (`gemini-2.5-flash`) via `@google/genai`, using the user's own API key (`GEMINI_API_KEY` secret)
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion

## Artifacts

### `artifacts/azito` — Azito Marketing Assistant
- Frontend-only React + Vite web app at `/`
- Chat interface for a digital marketing assistant for small Brazilian businesses
- Transitions from welcome screen (buttons + suggestions) to full chat mode
- Integrates with the API server for streaming AI responses

### `artifacts/api-server` — API Server
- Express 5 API serving `/api`
- Gemini chat route at `/api/openai/conversations/:id/messages` (path name kept for frontend/codegen compatibility; engine is Gemini)
- Streaming SSE responses via `@google/genai` `generateContentStream`
- Conversations and messages persisted to PostgreSQL

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── azito/              # Azito Marketing Assistant frontend
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   ├── db/                 # Drizzle ORM schema + DB connection
│   ├── integrations-openai-ai-server/  # OpenAI server-side client
│   └── integrations-openai-ai-react/   # OpenAI React hooks
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema

- `conversations` — chat sessions (id, title, createdAt)
- `messages` — individual messages (id, conversationId, role, content, createdAt)
- `suggestion_clicks` — tracks which suggestion chips/intent buttons users click (id, suggestionText, clickedAt)
- `admin_access_log` — records every admin login (id, ipAddress, userAgent, accessedAt)

## Admin Panel

Protected admin panel at `/admin` (login at `/admin/login`).

- **Auth**: Token-based (HMAC-SHA256 of credentials signed with SESSION_SECRET). No expiry — stateless.
- **Credentials**: Set via env vars `ADMIN_USERNAME` and `ADMIN_PASSWORD` (default: admin / markito2026).
- **Protected routes**: `GET /api/admin/stats`, `GET /api/admin/messages`, `GET /api/admin/access-log`, `GET /api/admin/me`.
- **Public route**: `POST /api/admin/suggestion-click` (no auth needed — called from frontend on chip/button click).

### Dashboard Features
- **Visão Geral tab**: KPI cards (total perguntas, conversas, hoje, esta semana), activity chart (30 days, Recharts), top 5 suggestions, word cloud (CSS-based, top 40 terms)
- **Perguntas tab**: Full paginated list of all user messages with date range filter (from/to)
- **Histórico tab**: Last 100 admin logins with timestamp, IP, and user agent

## AI Integration

Uses Google Gemini (`gemini-2.5-flash`) via the `@google/genai` SDK with the user's own API key, stored in the `GEMINI_API_KEY` secret. The client lives in `artifacts/api-server/src/lib/gemini.ts`. The chat route streams via `gemini.models.generateContentStream()` with the system prompt passed as `systemInstruction`. Message history roles are mapped from `assistant` → `model` for Gemini.

Note: the streaming chat route path is still `/api/openai/conversations/:id/messages` (the path name is cosmetic and was kept to avoid changing the frontend/codegen contract; the engine behind it is Gemini).

The Markito persona/behavior comes entirely from the `SYSTEM_PROMPT` (not a fine-tuned model), and conversation history is persisted in PostgreSQL — so switching the model provider preserves both. System prompt configures Markito as a Brazilian digital marketing expert for Rede Farmácias Associadas covering: redes sociais, tráfego pago, Google Ads, Meta Ads, SEO local, WhatsApp Business, branding, funil de vendas, etc.

## Running Codegen

```bash
pnpm --filter @workspace/api-spec run codegen
```
