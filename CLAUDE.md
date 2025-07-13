# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Requirements

Required environment variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for admin operations)
- Stripe keys for payment processing
- PostHog keys for analytics

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (auth, database, RLS)
- **Payments**: Stripe integration with webhooks
- **Analytics**: PostHog event tracking

### Core Architecture Patterns

1. **Authentication Flow**: Supabase Auth with custom AuthContext managing user state, sessions, and profile completion status
2. **Route Protection**: ProtectedRoute component redirects unauthenticated users and enforces onboarding completion
3. **Database**: Uses Supabase with Row-Level Security (RLS) policies enforced via migrations
4. **State Management**: React Context for auth state, custom hooks for data fetching

### Key Directories

- `/app` - Next.js App Router pages and API routes
- `/components` - Reusable UI components organized by domain (dashboard, marketing, ui primitives)
- `/contexts` - React contexts for auth, analytics, and route protection
- `/utils` - Utility functions for Supabase, Stripe, analytics
- `/types` - TypeScript type definitions
- `/supabase/migrations` - Database schema and RLS policy definitions

### Critical Components

- `AuthContext.tsx` - Manages authentication state, provides auth methods
- `ProtectedRoute.tsx` - Handles route protection and onboarding flow
- `app/layout.tsx` - Root layout with providers and conditional TopBar rendering
- `utils/supabase.ts` vs `utils/supabase-admin.ts` - Client vs server-side Supabase instances

### Database Schema

Users table in `public.users` with columns:
- `id` (UUID, references auth.users)
- `email`, `name`, `phone`
- `role` (free/paid/admin)
- Timestamps for creation/updates

### Payment Integration

Stripe webhooks handle subscription events and automatically update user roles in the database. API routes in `/app/api/stripe/` handle subscription management (cancel, reactivate, sync).

### Development Notes

- Uses `@/*` path alias for imports
- Client components marked with 'use client' directive
- Responsive design with custom `useAdaptiveUI` hook
- Error boundaries for graceful error handling
- Dark mode support via next-themes

1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the [todo.md](http://todo.md/) file with a summary of the changes you made and any other relevant information.
