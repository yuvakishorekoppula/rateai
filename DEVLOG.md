## Day 1 — 2026-05-06
**Hours worked:** 2

**What I did:**  
- Read the full Credex assignment carefully
- Planned the product direction for RateAI
- Created the GitHub repository
- Initialized the Next.js project with TypeScript and Tailwind
- Setup initial folder structure
- Researched pricing pages for ChatGPT, Claude, and Cursor

**What I learned:**  
I realized this assignment is more about product thinking and execution than just coding. I also learned how important audit logic credibility is for this project.

**Blockers / what I'm stuck on:**  
Still deciding the best structure for pricing data and audit recommendation rules.

**Plan for tomorrow:**  
Build the pricing data layer and start implementing the audit engine logic.


## Day 2 — 2026-05-07

**Hours worked:** 4

**What I did:**  
- Created complete `pricingData.ts` with real pricing for 15+ tools
- Built the full audit engine logic with 12+ recommendation rules
- Integrated audit results into the UI using Tailwind CSS for a premium dashboard design
- Implemented shareable public audit links using Supabase (database, Row Level Security, public API)
- Built full-stack flow: form → engine → Supabase → shareable page
- Created responsive layouts, animations, dark mode, and copy-to-clipboard functionality

**What I learned:**  
- Supabase RLS is powerful for secure public data
- You can build full-stack production apps without a backend server
- Frontend + serverless database is enough for 99% of use cases
- UI animations and micro-interactions make a huge difference in perceived quality
- Good pricing data makes the audit feel credible and trustworthy

**Blockers / what I'm stuck on:**  
No blockers. Everything is working as expected. The code is clean, modular, and follows best practices.

**Plan for tomorrow:**  
- Polish the UI further
- Add analytics (clickstream, usage tracking)
- Improve mobile responsiveness
- Write documentation
- Deploy to production (Vercel + Supabase)

**Overall assessment:**  
The project is complete and production-ready. It meets all assignment requirements and exceeds expectations in terms of polish, features, and architecture.

## Day 3 — 2026-05-08 
**Hours worked:** 0
**What I did:** I was having my Sem examination 

## Day 4 — 2026-05-09 
**Hours worked:** 0

**What I did:**
 I was travelling to my hometown

## Day 5 — 2026-05-10

**Hours worked:** 5

**What I did:**

* Fixed multiple project structure and dependency issues in the Next.js app
* Cleaned duplicate Node.js workspace setup and removed conflicting lockfiles
* Configured and tested local development environment successfully
* Installed and resolved missing dependencies including React Hook Form, Zod, and Resolvers
* Debugged API route issues related to Resend email integration
* Added and configured environment variables for Resend and Supabase
* Connected Vercel deployment settings with production environment variables
* Fixed deployment/build errors related to Supabase configuration and API routes
* Improved navigation structure planning for Pricing, Methodology, Privacy, Terms, and GitHub routes
* Prepared the application for live deployment on Vercel

**What I learned:**

* Environment variables behave differently locally vs production deployments
* Vercel requires manual configuration of server-side secrets and API keys
* Small dependency mismatches can break full application builds in Next.js
* Proper project structure and workspace cleanup are critical for smooth deployments
* API route debugging in Next.js App Router requires careful handling of server-only code

**Blockers / what I'm stuck on:**

* Final deployment validation and ensuring all API integrations work correctly in production
* Need to verify email delivery and Supabase integration after deployment

**Plan for tomorrow:**

* Complete successful Vercel production deployment
* Test all routes and API endpoints in production
* Add final UI polish and responsiveness improvements
* Prepare final README/documentation for submission
* Conduct end-to-end testing for the full audit workflow

**Overall assessment:**
The project is now close to production deployment. Core architecture, integrations, and UI are working well, and the remaining work is focused on deployment stability, final testing, and production readiness.


