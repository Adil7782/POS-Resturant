# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Run production server

npx prisma migrate dev    # Run database migrations
npx prisma studio         # Open Prisma Studio (DB GUI)
npx prisma generate       # Regenerate Prisma client after schema changes
```

No test runner is configured yet.

## Environment Variables

Create a `.env` file at the project root:

```env
DATABASE_URL='postgresql://user:password@neon-host/database?sslmode=require'
JWT_SECRET='your-secret-key'
NODE_ENV='development'
```

The Prisma client is generated into `app/generated/prisma/` (not the default location). This is configured in `prisma.config.ts`.

## Architecture

**Stack:** Next.js App Router, TypeScript, Prisma (PostgreSQL/Neon), Tailwind CSS v4, shadcn/ui

### Authentication & Authorization

JWT tokens are stored as HTTP-only secure cookies. `middleware.ts` guards all `/dashboard/*` routes. Token payload includes `{ id, name, email, role }`.

Two active roles:
- **ADMIN** — routes under `/dashboard/ADMIN/`
- **CASHIER** — routes under `/dashboard/cashier/`

`lib/getuser.ts` extracts the user from the cookie on the server side. `app/dashboard/page.tsx` redirects users to their role-specific sub-path on login.

### Database Models

Key models in `prisma/schema.prisma`:
- `User` — system users with role enum (ADMIN, CASHIER, MANAGER)
- `Product` — menu items with `isInventoryTracked` flag (inventory tracking is optional per product)
- `Category` — product categories
- `Inventory` — stock levels (only exists for tracked products)
- `Transaction` / `TransactionItem` — sales records; transaction IDs follow the format `ORD-{timestamp}`
- `InventoryLog` — audit trail for stock changes (SALE, RESTOCK, ADJUSTMENT)
- `StockAlert` — generated automatically when quantity drops below `reorderLevel`

### Checkout Flow

`POST /api/pos/checkout` runs everything inside a Prisma transaction:
1. Creates `Transaction` record
2. Bulk-inserts `TransactionItem` rows
3. For each item where `isInventoryTracked = true`: decrements inventory, logs an `InventoryLog`, creates a `StockAlert` if below reorder level

The checkout logic is also encapsulated in `lib/transactions.ts`.

### Component Structure

- `components/app-sidebar.tsx` — renders different nav items based on the user's role (reads role from cookie/context)
- `components/pos-interface.tsx` — main POS cart UI with product filtering and quantity management
- `components/checkout-modal.tsx` — payment method selection and final order submission
- `app/dashboard/ADMIN/inventory/` — inventory management with `data-table.tsx` + `columns.tsx` pattern (TanStack Table)
- `components/models/` — modal dialogs for CRUD operations

### UI Conventions

- UI primitives live in `components/ui/` (shadcn/ui). Add new components with `npx shadcn@latest add <component>`.
- Toast notifications use `sonner` — call `toast.success()` / `toast.error()`.
- Forms use React Hook Form + Zod. Define the schema first, then wire it to `useForm`.
- The Prisma client singleton is in `lib/prisma.ts` — always import from there, never instantiate directly.
