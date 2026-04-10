# DevTalent — Premium Expert Recruitment for International Development

A production-ready SaaS platform connecting international development experts with NGOs, consulting firms, and donor-funded projects (EU, World Bank, UN, AfDB, GIZ, and others).

---

## Architecture

### Clean Modular Architecture

The project is intentionally structured to support future extraction of the backend into a standalone NestJS service with minimal refactoring.

```
src/
├── app/                    # Next.js App Router (delivery layer only)
│   ├── (auth)/             # Auth routes: /login, /register
│   ├── (expert)/           # Expert dashboard routes
│   ├── (recruiter)/        # Recruiter dashboard routes
│   ├── (admin)/            # Admin dashboard routes
│   └── api/                # Thin API route handlers
│
├── components/             # Reusable UI components
│   ├── ui/                 # shadcn/ui base components (customised)
│   ├── shared/             # Cross-feature shared components
│   ├── layout/             # Layouts: Sidebar, Navbar, etc.
│   └── email/              # React Email templates
│
├── features/               # Feature modules (mirrors NestJS modules)
│   ├── auth/
│   │   ├── domain/         # Entities, value objects
│   │   ├── application/    # Use cases
│   │   ├── infrastructure/ # Prisma adapters, external integrations
│   │   └── presentation/   # React components, forms, hooks
│   ├── experts/
│   ├── recruiters/
│   ├── missions/
│   ├── applications/
│   └── admin/
│
├── lib/                    # Shared utilities
│   ├── validations/        # Zod schemas
│   ├── constants/          # Reference data (sectors, donors, languages)
│   ├── email/              # Email sending functions
│   ├── prisma.ts           # Prisma singleton
│   ├── auth.ts             # NextAuth v5 config
│   └── utils.ts            # General utilities
│
├── server/                 # Backend-oriented logic (NestJS-extractable)
│   ├── repositories/       # Data access layer (Prisma queries)
│   ├── services/           # Business logic (pure async functions)
│   └── contracts/          # TypeScript interfaces for services
│
└── types/                  # Shared TypeScript types & DTOs
    ├── common.ts            # Enums, pagination, API response types
    ├── auth.ts
    ├── expert.ts
    ├── mission.ts
    ├── application.ts
    ├── recruiter.ts
    └── next-auth.d.ts       # NextAuth type augmentation
```

### Key Architecture Principles

| Principle | Implementation |
|-----------|----------------|
| **Thin routes** | API handlers call services, no business logic inline |
| **Isolated data access** | All Prisma calls in `server/repositories/` |
| **Framework-agnostic services** | `server/services/` has zero Next.js imports |
| **Typed contracts** | `server/contracts/` defines service interfaces |
| **Zod everywhere** | All input validated before reaching services |
| **Decoupled email** | Email functions injected into services, not hardcoded |

### Future NestJS Migration

When ready to migrate:
1. Move `server/repositories/` → NestJS repositories with `@Injectable()`
2. Move `server/services/` → NestJS services (add `@Injectable()`)
3. Move `server/contracts/` → shared interfaces package
4. Replace `lib/prisma.ts` → NestJS `PrismaService`
5. Keep `types/` as a shared types package
6. Next.js frontend calls the NestJS API via `fetch` instead of direct imports

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth v5 (Auth.js) |
| Validation | Zod |
| Forms | React Hook Form |
| Email | Resend |
| File upload | UploadThing |
| Package manager | pnpm |

---

## Design System

### Color Palette (Dark by default)

| Token | HSL | Usage |
|-------|-----|-------|
| `background` | `220 25% 5%` | Page background |
| `surface` | `220 18% 11%` | Cards, panels |
| `surface-raised` | `220 17% 14%` | Elevated elements |
| `brand` | `228 90% 64%` | Primary CTA, links |
| `accent` | `42 65% 52%` | Gold accent |
| `text-primary` | `220 20% 94%` | Headings, labels |
| `text-secondary` | `220 12% 62%` | Body text |
| `text-muted` | `220 10% 42%` | Hints, placeholders |

### Typography Scale

- Display: `text-display-xl` down to `text-display-sm` (tight tracking)
- Body: `text-body-xl` down to `text-body-xs`
- Labels: `text-label-lg` down to `text-label-xs`

### Component Conventions

- Cards: `.card-base`, `.card-elevated`, `.card-glass`
- Containers: `.page-container`, `.page-container-narrow`, `.landing-container`
- Status badges: `.badge-status-{new|reviewed|shortlisted|rejected|hired}`
- Mission badges: `.badge-mission-{draft|published|closed|archived}`

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+

### Setup

```bash
# 1. Clone and install
git clone <repo>
cd devtalent
pnpm install

# 2. Configure environment
cp .env.example .env
# Fill in: DATABASE_URL, AUTH_SECRET, RESEND_API_KEY, UPLOADTHING_*

# 3. Set up database
pnpm db:push          # Apply schema to database
pnpm db:seed          # Seed reference data + sample data

# 4. Start development server
pnpm dev
```

### Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@devtalent.io | Admin@123! |
| Recruiter | recruiter@devtalent.io | Recruiter@123! |
| Expert | expert@devtalent.io | Expert@123! |

---

## Domain Model

```
User
 ├── ExpertProfile          (1:1, role=EXPERT)
 │    ├── ExpertToExpertise  (M:M with Expertise)
 │    ├── SectorExperience   (1:M)
 │    ├── RegionExperience   (1:M)
 │    ├── DonorExperience    (1:M)
 │    ├── ExpertLanguage     (M:M with Language)
 │    ├── UploadedDocument   (1:M)
 │    └── Application        (1:M)
 │
 └── RecruiterProfile       (1:1, role=RECRUITER)
      ├── Organization       (M:1)
      └── Mission            (1:M)
           ├── MissionLanguage (M:M with Language)
           ├── MissionToExpertise (M:M with Expertise)
           └── Application    (1:M)
                └── ApplicationDocument (M:M with UploadedDocument)
```

---

## User Roles & Permissions

| Route Prefix | Required Role |
|-------------|---------------|
| `/expert/*` | EXPERT or ADMIN |
| `/recruiter/*` | RECRUITER or ADMIN |
| `/admin/*` | ADMIN only |
| `/` | Public |
| `/missions/*` | Public (read), EXPERT (apply) |
| `/experts/*` | RECRUITER or ADMIN |

---

## Application Flow

1. Expert browses published missions
2. Expert clicks "Apply" → `CreateApplicationDTO` validated via Zod
3. `application.service.applyToMission()` called:
   - Validates expert has a profile
   - Checks mission is PUBLISHED
   - Prevents duplicate applications
   - Creates `Application` record
   - Attaches CV documents
   - Sends email to recruiter (Resend)
   - Sends confirmation to expert (Resend)
4. Application appears in recruiter dashboard with status `NEW`
5. Recruiter updates status: NEW → REVIEWED → SHORTLISTED → HIRED/REJECTED
6. Expert tracks status in their applications dashboard

---

## Development Phases

| Phase | Status | Scope |
|-------|--------|-------|
| 1 — Architecture | ✅ Complete | Schema, types, repos, services, design system |
| 2 — Auth & Landing | 🔜 Next | Auth pages, base layouts, landing page |
| 3 — Expert & Recruiter Dashboards | 🔜 | Profile, missions CRUD |
| 4 — Application Flow & Email | 🔜 | Apply, status tracking, Resend |
| 5 — Admin & Seed | 🔜 | Admin dashboard, seed script, final cleanup |

---

## Scripts

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm type-check       # TypeScript check (no emit)
pnpm db:migrate       # Run Prisma migrations
pnpm db:push          # Push schema without migration history
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio
```
