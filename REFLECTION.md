# REFLECTION.md

## 1. The hardest bug I hit this week, and how I debugged it

The hardest bug I encountered this week was related to environment variables and API authentication in my full-stack application. The app worked correctly in development, but after deployment several API requests started failing with authentication errors. Initially, I assumed the issue was caused by incorrect API keys or expired tokens. I verified the `.env` file multiple times and regenerated keys, but the issue still persisted.

My second hypothesis was that the frontend was unable to access server-side environment variables correctly. I started debugging by checking browser console logs, backend terminal logs, and deployment logs. I added temporary logging statements to confirm whether the variables were being loaded during runtime. That helped me identify that variables prefixed incorrectly were not being exposed to the frontend in Next.js.

I then experimented by moving some variables between server-side and client-side usage and carefully checked which variables required the `NEXT_PUBLIC_` prefix. After fixing the prefixes and restarting the build process, the frontend was finally able to communicate with the backend APIs correctly.

Another issue was that cached builds in the deployment platform were still using older environment configurations. Clearing the cache and redeploying resolved the remaining errors.

What worked best during debugging was forming clear hypotheses one at a time instead of randomly changing code. Breaking the problem into smaller checks — frontend, backend, deployment, and environment variables — made the issue easier to isolate and solve.

---

## 2. A decision I reversed mid-week, and what made me reverse it

One major decision I reversed this week was trying to implement too many advanced features simultaneously during the early stages of development. Initially, I planned to add authentication, analytics, AI integration, UI animations, dashboards, and deployment optimizations all at once because I wanted the project to feel complete quickly.

On second day of development, I decided to reverse this approach and focus only on the core product workflow first. I prioritized stabilizing authentication, database connections, API routes, and the primary user experience before adding secondary features. This decision immediately improved development speed because I had fewer moving parts to manage.

The reversal was mainly driven by practical observations. Features that looked exciting initially were creating technical debt early in the project. I also noticed that debugging became much easier when the codebase remained smaller and more modular.

By simplifying priorities, I could test features faster, deploy more confidently, and maintain cleaner project organization. The experience taught me that building a stable foundation first is more valuable than trying to impress with too many unfinished features. Going forward, I would continue using an iterative approach: first build the minimum working product, then gradually expand functionality after the fundamentals are reliable.

---

## 3. What I would build in week 2 if I had it

If I had an additional second week to continue building the project, I would focus on improving scalability, user experience, and automation rather than only adding new features. The first priority would be strengthening the overall architecture and polishing the existing product into something closer to production quality.

One area I would expand significantly is analytics and monitoring. I would implement detailed dashboards to track user activity, API performance, feature usage, and error rates. This would help identify bottlenecks and improve decision-making using real usage data instead of assumptions.

I would also invest more time in improving the frontend experience. This includes smoother loading states, better responsiveness for mobile devices, accessibility improvements, and polished animations. A cleaner interface would make the application feel more professional and easier to use.

Another important addition would be automated testing and CI/CD pipelines. I would add unit tests for backend APIs, integration tests for authentication flows, and GitHub Actions for automated deployments. This would reduce manual testing effort and improve confidence during future updates.


Finally, I would focus on deployment optimization and security hardening, including rate limiting, better environment management, and database optimization. These improvements would make the project more reliable for real-world usage rather than only functioning as a prototype.

---

## 4. How I used AI tools

I used AI tools extensively throughout the week, mainly for speeding up development, debugging, brainstorming, and improving documentation. The primary tool I used was [ChatGPT](https://chatgpt.com?utm_source=chatgpt.com) for code explanations, debugging assistance, architecture planning, and generating boilerplate code. I also used AI-assisted autocomplete tools for faster coding and repetitive tasks.

One of the most useful applications of AI was debugging configuration and deployment issues. Instead of searching through multiple documentation pages manually, I used AI to explain error logs, compare configuration setups, and suggest possible causes. This significantly reduced the time spent troubleshooting environment variables and API integration issues.

I also used AI to improve productivity in writing documentation, structuring project folders, generating commit message ideas, and refining UI text content. For frontend work, AI helped generate layout ideas and Tailwind CSS structures quickly.

However, I did not fully trust AI with architecture-level decisions, security-sensitive code, or deployment credentials. I always manually reviewed generated code before using it because AI occasionally produced outdated or incorrect implementations.

One specific case where the AI was wrong involved environment variables in Next.js. The AI suggested accessing server-side variables directly in frontend components without correctly explaining the need for the `NEXT_PUBLIC_` prefix. When the frontend failed to access those variables, I checked the official Next.js documentation and realized the AI-generated solution was incomplete. Catching that mistake prevented further debugging confusion.

This experience reinforced the importance of treating AI as an assistant rather than a fully reliable source. AI accelerated development significantly, but verification and independent reasoning were still essential.

---

## 5. Self-rating

### Discipline — 8/10
I maintained consistent daily progress, tracked tasks carefully, and continued working through difficult debugging sessions without abandoning the project.

### Code Quality — 7/10
I focused on modular organization and readable code, but some sections still need refactoring and better testing coverage.

### Design Sense — 7/10
The UI structure and layout decisions were clean and functional, though I still want to improve visual polish and responsiveness.

### Problem-Solving — 8/10
I handled several deployment and integration issues by systematically forming hypotheses, isolating variables, and testing solutions methodically.

### Entrepreneurial Thinking — 8/10
I consistently thought beyond just coding by considering scalability, usability, deployment, automation, and real-world product value.