StudyZoomX – Next.js SaaS Boilerplate
A robust, production-grade SaaS starter built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, Supabase, and Stripe. Designed for scale, security, and rapid iteration, StudyZoomX is architected to support 20,000+ concurrent users and $50K+/month in revenue.
🚀 Overview
StudyZoomX is a modern SaaS platform template for educational productivity and subscription-based services. It features adaptive UI, secure authentication, subscription billing, analytics, and a modular dashboard. The codebase is engineered for extensibility, maintainability, and high performance.
✨ Features
Authentication: Email/password & Google OAuth via Supabase
Onboarding: Guided profile completion for new users
User Management: Profile view/update, password reset, account deletion
Subscription Billing: Stripe integration (buy, upgrade, cancel, reactivate, webhook sync)
Dashboard: Modular widgets for metrics, analytics, referrals, and satisfaction
Adaptive UI: Responsive, accessible, and dark/light mode support
Analytics: PostHog event/user tracking, Vercel Analytics ready
Security: RLS, CORS, strict HTTP headers, error boundaries
Type Safety: Full TypeScript coverage
Extensible: Modular components, hooks, and context providers
Production-Ready: Linting, type-checking, CI/CD scripts, Vercel deployment


StudyZoomX – Next.js SaaS Boilerplate
A robust, production-grade SaaS starter built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, Supabase, and Stripe. Designed for scale, security, and rapid iteration, StudyZoomX is architected to support 20,000+ concurrent users and $50K+/month in revenue.
🚀 Overview
StudyZoomX is a modern SaaS platform template for educational productivity and subscription-based services. It features adaptive UI, secure authentication, subscription billing, analytics, and a modular dashboard. The codebase is engineered for extensibility, maintainability, and high performance.
✨ Features
Authentication: Email/password & Google OAuth via Supabase
Onboarding: Guided profile completion for new users
User Management: Profile view/update, password reset, account deletion
Subscription Billing: Stripe integration (buy, upgrade, cancel, reactivate, webhook sync)
Dashboard: Modular widgets for metrics, analytics, referrals, and satisfaction
Adaptive UI: Responsive, accessible, and dark/light mode support
Analytics: PostHog event/user tracking, Vercel Analytics ready
Security: RLS, CORS, strict HTTP headers, error boundaries
Type Safety: Full TypeScript coverage
Extensible: Modular components, hooks, and context providers
Production-Ready: Linting, type-checking, CI/CD scripts, Vercel deployment

/app
  /api/stripe      # Stripe endpoints (webhook, cancel, reactivate, sync, test)
  /api/user        # User deletion endpoint
  /auth            # OAuth callback
  /dashboard       # Dashboard layout and page
  /login           # Login page
  /onboarding      # Onboarding/profile completion
  /pay             # Payment/upgrade page
  /profile         # User profile page
  /reset-password  # Password reset
  /update-password # Password update
  /verify-email    # Email verification
  layout.tsx       # Global layout, providers, TopBar
  page.tsx         # Landing/marketing page
  globals.css      # Global styles

/components
  /dashboard       # Dashboard widgets (metrics, charts, sidebar, etc.)
  /marketing/sections # Landing/marketing sections (features, pricing, reviews, etc.)
  /ui              # UI primitives (Button, Badge, GradientText, etc.)
  AccountManagement.tsx # Profile/account management
  StripeBuyButton.tsx   # Stripe payment button
  TopBar.tsx            # Global navigation bar
  LoginForm.tsx         # Login/signup form
  ForgotPasswordModal.tsx # Password recovery modal

/contexts
  AuthContext.tsx       # Auth state, session, and actions
  ProtectedRoute.tsx    # Route protection and onboarding redirect
  PostHogContext.tsx    # Analytics context

/hooks
  useAdaptiveUI.ts      # Responsive/adaptive UI logic
  useUserProfile.ts     # User profile fetching

/lib
  profile.ts            # User profile CRUD logic

/utils
  stripe.ts             # Stripe client singleton
  supabase.ts           # Supabase client (client-side)
  supabase-admin.ts     # Supabase admin client (server-side)
  cors.ts               # CORS middleware
  analytics.ts          # PostHog event helpers
  posthog.ts            # PostHog initialization
  env.ts, utils.ts      # Misc utilities

/types
  UserProfile.ts        # User profile type
  stripe.d.ts           # Stripe types
  supabase.ts           # (empty)
  ValidateEntryTypes.ts # Type validation

/config
  api.ts                # API endpoint configuration

/supabase
  /migrations           # SQL migrations for users table and policies
  README.md             # (minimal)

/public
  /avatars              # Avatar images
  Various SVGs, PNGs, and images

tailwind.config.ts      # Tailwind theme and customizations
next.config.ts          # Next.js config (security headers)
tsconfig.json           # TypeScript config
package.json            # Dependencies and scripts
README.md               # (this file)

🔐 Security & Compliance
Row-Level Security (RLS): Enforced via Supabase migrations and policies
CORS: Custom middleware for secure cross-origin API access
HTTP Headers: Strict security headers in Next.js config
Error Boundaries: React-error-boundary for graceful error handling
Environment Variables: All secrets and keys are loaded from .env.local
🧑‍💻 Key Workflows
Authentication & Onboarding
Supabase Auth: Email/password and Google OAuth
Onboarding: New users must complete a profile (name, phone) before accessing the dashboard
Profile Management: View/update profile, reset password, delete account (admin privileges)
Subscription & Payments
Stripe Buy Button: Embedded for seamless checkout
Webhooks: Handles subscription events and updates user roles in Supabase
API Endpoints: Cancel, reactivate, and sync subscriptions
Role Management: User role (free, paid, admin) is updated based on Stripe events
Dashboard & Analytics
Dashboard: Modular widgets for metrics, sales, active users, referrals, and satisfaction
Charts: Custom SVG/animated charts
Analytics: PostHog for event/user tracking
Adaptive UI & UX
Adaptive UI: Custom hook for responsive breakpoints, orientation, and device type
Dark/Light Mode: Fully supported via Tailwind and Next.js themes
Animations: Framer Motion for smooth transitions
Accessibility: Semantic HTML, focus management, ARIA where appropriate
🗄️ Database Schem


## 🧑‍💻 Key Workflows

### 1. **User Authentication & Onboarding**
- **Signup/Login:** Email/password and Google OAuth via Supabase
- **Email Verification:** Required before login
- **Onboarding:** After first login, user must provide name (required) and phone (optional) before accessing protected routes
- **User Profile:** Stored in `public.users` table, includes id, email, name, phone, role (`free`, `paid`, `admin`), timestamps
- **Role Management:** Admin can manually set roles; Stripe webhooks auto-upgrade to `paid` on successful payment

### 2. **Document Upload & Processing**
- **Supported Files:** PDF, PPTX, DOCX, TXT, images (JPEG, PNG, TIFF), video/audio (future), ZIP archives
- **Upload UX:** Drag-and-drop, file picker, batch upload, chunked/resumable uploads, progress bars, error handling
- **Parsing Pipeline:** OCR for images/PDFs, text extraction for docs, video/audio transcription (future)
- **AI Tool Generation:** After parsing, system generates flashcards, quizzes, summaries, podcasts, and videos for each document

### 3. **AI Chatbots**
- **General Chatbot:** Accessible anywhere, acts as a study buddy/tutor
- **Document Chatbot:** Tied to each uploaded document, answers questions based on that content only

### 4. **Study Planner**
- **Calendar:** Users input classes, test dates, and weak areas; AI builds and adjusts a study plan
- **Reminders:** Automated, based on deadlines and user progress

### 5. **Dashboard & Analytics**
- **Dashboard:** Shows metrics (users, conversions, revenue, active users), recent activity, and quick actions
- **User Profile:** Tracks streaks, badges, XP, and progress

### 6. **Payments & Subscription**
- **Stripe Integration:** Buy button, webhook for subscription events, role updates in DB
- **Plans:** Free and $10/month paid plan (no free trial)
- **Admin Controls:** Manual role management for users

---

## 🛠️ Troubleshooting Supabase Storage Issues

If you see errors like "No storage buckets found" or "The 'documents' bucket was not found":

1. **Check the browser console for detailed debug output.**
   - The app now logs the full response and errors from Supabase Storage API calls.
   - Look for lines starting with `[Storage Check]` for step-by-step diagnostics.

2. **Verify your environment variables:**
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` must match the project where you created the bucket.

3. **Confirm the bucket exists:**
   - In the Supabase Dashboard, the bucket must be named exactly `documents` (all lowercase).

4. **Check your storage policies:**
   - Use the policies from `supabase/DASHBOARD_STORAGE_SETUP.md`.
   - For debugging, you can add a permissive policy: `bucket_id = 'documents'` for ALL operations and authenticated users.

5. **Manual override for debugging:**
   - Set `NEXT_PUBLIC_SKIP_STORAGE_CHECK=true` in your `.env.local` to bypass the storage check (for development only).

6. **Restart your dev server** after any `.env.local` changes.

7. **Log out and log back in** to refresh your session.

If you still have issues, copy the debug output from the console and share it for further help.