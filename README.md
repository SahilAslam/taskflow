# TaskFlow Pro — Portfolio-Grade Task Management App

A modern, production-ready Trello-inspired task management SaaS built to showcase full-stack engineering skills, modern UI/UX, scalable architecture, and real-time collaboration.

---

## Project Overview

**App Name**: TaskFlow Pro  
**Project Directory**: `C:\Users\Sahil Aslam\.gemini\antigravity\scratch\taskflow-pro`

The app will consist of two separate services:
- `frontend/` — Next.js 14 App Router with TypeScript + Tailwind + ShadCN
- `backend/` — Node.js + Express.js + MongoDB + Socket.io

---

## User Review Required

> [!IMPORTANT]
> **Design Direction**: The UI uses a **dark glassmorphism** aesthetic with vibrant accent gradients (indigo → violet → fuchsia). Light mode is also supported. This ensures it looks like a premium SaaS product (think Linear.app meets Notion meets Vercel dashboard).

> [!IMPORTANT]
> **Auth Strategy**: Using **NextAuth.js** with a **credentials provider** (email/password stored in MongoDB). JWT sessions will be used. This avoids requiring OAuth app setup. You can extend to OAuth providers later.

> [!WARNING]
> **MongoDB**: We'll use MongoDB Atlas (free tier) — you'll need to create a free cluster and provide a `MONGODB_URI`. The plan will use `.env.example` files so you can fill in your own values.

> [!NOTE]
> **Bonus features** (AI suggestions, team invites, calendar, notifications) will be scaffolded with stubs so you can extend them but the core will be fully functional.

---

## Architecture

```
taskflow-pro/
├── frontend/               # Next.js App Router
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── boards/[boardId]/
│   │   │   └── settings/
│   │   ├── landing/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/             # ShadCN primitives
│   │   ├── board/          # Board, List, Card components
│   │   ├── modals/         # Card detail, create board, etc.
│   │   ├── layout/         # Sidebar, Navbar, CommandPalette
│   │   └── analytics/      # Dashboard charts
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # API service layer, socket, auth
│   ├── store/              # Zustand global state
│   ├── types/              # TypeScript interfaces
│   └── styles/
│
├── backend/                # Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/        # Socket.io handlers
│   │   └── utils/
│   └── index.ts
│
└── README.md
```

---

## Proposed Changes

### Phase 1 — Backend Setup

#### [NEW] `backend/` — Express + MongoDB + Socket.io Server

**Mongoose Models:**
- `User` — name, email, hashedPassword, avatar, createdAt
- `Board` — title, description, background, owner, members[], createdAt
- `List` — title, boardId, position, createdAt
- `Card` — title, description, listId, boardId, position, labels[], priority, dueDate, checklist[], assignees[], attachments[], comments[], createdAt
- `Activity` — boardId, userId, action, entityType, entityId, metadata, createdAt

**REST API Routes:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login, return JWT |
| GET | `/api/boards` | Get user's boards |
| POST | `/api/boards` | Create board |
| GET | `/api/boards/:id` | Get board with lists + cards |
| PUT | `/api/boards/:id` | Update board |
| DELETE | `/api/boards/:id` | Delete board |
| POST | `/api/boards/:id/lists` | Create list |
| PUT | `/api/lists/:id` | Update list |
| DELETE | `/api/lists/:id` | Delete list |
| PUT | `/api/lists/reorder` | Reorder lists (drag) |
| POST | `/api/lists/:id/cards` | Create card |
| GET | `/api/cards/:id` | Get card detail |
| PUT | `/api/cards/:id` | Update card |
| DELETE | `/api/cards/:id` | Delete card |
| PUT | `/api/cards/move` | Move card between lists |
| GET | `/api/boards/:id/activity` | Get activity log |
| GET | `/api/dashboard/stats` | Analytics stats |

**Socket.io Events:**
- `join-board`, `leave-board`
- `card-moved`, `card-updated`, `card-created`, `card-deleted`
- `list-created`, `list-updated`, `list-deleted`, `list-reordered`
- `board-updated`
- `member-joined`

---

### Phase 2 — Frontend Core

#### [NEW] `frontend/` — Next.js App with App Router

**Design System:**
- Primary palette: `#6366f1` (indigo) → `#8b5cf6` (violet) → `#d946ef` (fuchsia)
- Background (dark): `#0a0a0f`, `#111118`, `#1a1a2e`
- Glass cards: `rgba(255,255,255,0.05)` with `backdrop-filter: blur(20px)`
- Border: `rgba(255,255,255,0.08)`
- Font: **Inter** (Google Fonts) + **JetBrains Mono** for code elements
- Animations: Framer Motion throughout

**Key Pages & Components:**
1. **Landing Page** — Hero, Features, Screenshots, CTA, Footer
2. **Auth Pages** — Login + Register with glassmorphism forms
3. **Dashboard** — Analytics overview, board grid, quick actions
4. **Board View** — Kanban columns with drag-and-drop
5. **Card Detail Modal** — Full card editor
6. **Command Palette** — `Ctrl+K` search interface
7. **Settings Page** — Profile, preferences

**State Management:**
- **Zustand** for global state (boards, lists, cards, user)
- **React Query (TanStack)** for server state, caching, and optimistic updates
- **Socket.io client** for real-time sync

---

### Phase 3 — Key Feature Details

#### Drag & Drop (dnd-kit)
- Sortable lists (horizontal)
- Sortable cards within lists
- Cross-list card movement
- Optimistic UI (instant visual update → API call → rollback on failure)

#### Card Detail Modal
- Rich text description (textarea with markdown preview)
- Checklist with add/complete/delete items
- Due date picker
- Labels with color picker
- Priority selector (Low / Medium / High / Urgent) with color coding
- Comment thread
- Activity timeline

#### Command Palette (`Ctrl+K`)
- Search boards and cards
- Quick actions (create board, create card, navigate)
- Keyboard navigation with arrow keys

#### Analytics Dashboard
- Tasks completed vs. pending (donut chart)
- Daily productivity over last 30 days (line chart)
- Cards by priority breakdown (bar chart)
- Board activity heatmap
- Using **Recharts** for beautiful charts

#### Real-time Collaboration
- Socket.io rooms per board
- Live cursor indicators (bonus)
- Toast notifications for teammate actions
- Conflict-free updates via server authority

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| UI Components | ShadCN UI |
| Animations | Framer Motion |
| State | Zustand + TanStack Query |
| Drag & Drop | dnd-kit |
| Charts | Recharts |
| Auth | NextAuth.js (credentials) |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Real-time | Socket.io |
| Caching | Node-cache (Redis-compatible interface) |

---

## Open Questions

> [!IMPORTANT]
> **Q1 — Monorepo or separate repos?** The plan uses a single monorepo directory `taskflow-pro/` with `frontend/` and `backend/` subdirectories. This is ideal for a portfolio project. Shall I proceed with this structure?

> [!IMPORTANT]
> **Q2 — Start which part first?** I recommend: Backend API → Frontend core → Real-time → Polish. Does that order work for you?

> [!NOTE]
> **Q3 — AI features**: For AI task suggestions, shall I use the **OpenAI API** (requires API key) or a simpler rule-based suggestion engine to keep it dependency-free?

---

## Verification Plan

### Automated Tests
- Backend: `Jest` + `supertest` for API routes
- Frontend: Basic smoke tests with `@testing-library/react`

### Manual Verification
- Drag and drop cards and lists works correctly
- Real-time updates visible in two browser tabs on same board
- Auth flow: register → login → protected routes
- Responsive layout on mobile viewport
- Dark/light mode toggle
- Command palette opens/navigates with keyboard

### Build Verification
- `npm run build` completes without errors
- No TypeScript errors
- Lighthouse score > 85

---

## Implementation Order

1. ✅ Plan (this document)
2. Backend scaffolding + MongoDB models + REST API
3. Frontend scaffolding + Tailwind + ShadCN setup
4. Landing page + Auth pages
5. Dashboard layout + Board list page
6. Board view with Kanban columns
7. Drag and drop implementation
8. Card detail modal
9. Real-time Socket.io integration
10. Analytics dashboard + charts
11. Command palette
12. Dark/light mode
13. Activity log
14. Loading skeletons + error handling
15. README + final polish
