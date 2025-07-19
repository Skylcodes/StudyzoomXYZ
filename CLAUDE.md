# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm run typecheck` - Run TypeScript compiler check (if available)

### Testing
Check the project structure for test files or scripts. Currently uses Next.js 15 with React 19.

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with React 19
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with email/password and Google OAuth
- **Payments**: Stripe integration with webhooks
- **UI**: Tailwind CSS with Radix UI components, dark/light mode support
- **AI**: OpenAI API for document processing and chatbots
- **Analytics**: PostHog for user tracking, Vercel Analytics

### Key Application Structure

#### Authentication Flow
1. User signs up → email verification required
2. After verification → redirected to onboarding for name (required) and phone (optional)
3. User roles: `free`, `paid`, `admin` (manually managed)
4. Role updates via Stripe webhooks for subscriptions

#### Core Features
- **Document Management**: Upload, parse (OCR for PDFs/images), and store study materials
- **AI Study Tools**: Auto-generate flashcards, quizzes, summaries, podcasts, and videos per document
- **Dual Chatbots**: 
  - General AI Study Buddy (app-wide)
  - Document-specific chatbots (context-limited to uploaded material)
- **Study Planner**: AI-powered calendar with reminders and task suggestions

#### Database Schema (Supabase)
Key tables:
- `users` - User profiles (name, phone, role, timestamps)
- `documents` - Uploaded files with metadata, parsed text, summaries, key points
- `notes` - User-generated notes with tagging
- `tags` - Organizational tags for documents/notes
- `document_processing_jobs` - Background job tracking for file processing

#### File Structure Patterns
- `/app` - Next.js App Router structure
- `/components` - React components (dashboard/, marketing/, ui/ subdirectories)
- `/contexts` - React contexts (AuthContext, PostHogContext, ProtectedRoute)
- `/lib` - Business logic and utilities
- `/utils` - Utility functions (supabase clients, stripe, cors, analytics)
- `/types` - TypeScript type definitions
- `/supabase` - Database migrations and setup

### Development Guidelines

#### Code Quality
- Always run `npm run lint` before committing
- TypeScript strict mode enabled - ensure type safety
- Follow existing component patterns and naming conventions
- Use existing utility functions from `/lib` and `/utils`

#### Authentication & Security
- Use `useAuth()` hook for auth state management
- Implement proper RLS policies in Supabase
- Never expose sensitive data in client-side code
- Always validate user permissions before data access

#### Document Processing
- OCR and text extraction handled in `/lib/documents.server.ts`
- Parsing results cached in `documents.parsed_text` column
- AI processing (summaries, chatbots) uses OpenAI API with retry logic

#### UI/UX Standards
- Responsive design for mobile and desktop
- Dark/light mode support required
- Use existing component library in `/components/ui`
- Follow TurboAI-style layout patterns (left content, right sidebar)

### Important Notes
- No free trials - users are either `free` or `paid` ($10/month)
- Stripe webhooks handle role upgrades automatically
- Admin can manually manage user roles
- Document content is user-scoped with proper access controls
- AI features require OpenAI API key configuration

### Critical Implementation Rules
1. Never disrupt existing authentication or document upload functionality
2. Always check for TypeScript and lint errors before committing
3. Maintain backward compatibility with existing features
4. Follow the business logic defined in cursor rules and PRD documents
5. Test thoroughly with both free and paid user scenarios


THIS IS EXTREMELY IMPORTANT SO LISTEN UP. WHEN IMPLEMENTING A FEATURE, YOU HAVE FULL CONTEXT OF EVERYTHING IN THE CODEBASE, SO MAKE SURE THAT YOU DO NOT DISRUPT OR CHANGE ANY OTHER FUNCTIONALITY SUCH AS AUTH OR DOC UPLOAD OR ETC. AND DO NOT CAUSE ANY TS AND LINT ERRORS. EVERY CHANGE IN CODE, YOU MUST DO A LINT AND TS ERROR CHECK


1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the [todo.md] file with a summary of the changes you made and any other relevant information.
