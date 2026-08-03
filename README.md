# ResumeElite — AI-Powered Resume Builder

ResumeElite is a modern, high-performance web application designed to help software engineers, developers, and tech professionals craft ATS-optimized resumes with real-time AI assistance and live Overleaf-style paper previews.

---

## ✨ Features & Recent Updates

### 🚀 8-Step Guided Resume Builder
- **Step 1: Personal Info** — Name, photo upload (max 5MB), contact details, city, country, and social profile links (LinkedIn, GitHub, Portfolio).
- **Step 2: Professional Summary** — AI-assisted summary generator with target role, experience level, industry filters, text formatting toolbar (Bold, Italic, Bullet list), and live character counter.
- **Step 3: Technical & Soft Skills** — Single consolidated skills container, initial "+ Add Skill" trigger that activates live search & preset suggestions with custom skill creation.
- **Step 4: Work Experience** — Collapsible employment history cards, date ranges with "Currently work here" toggle, AI-generated quantifiable bullet points, and live Overleaf paper preview.
- **Step 5: Projects & Tech Stack** — Collapsible project cards with tech stack tags, live preview of repository & demo links, AI project description generator, and Overleaf live preview.
- **Step 6: Education** — Academic background tracking with institution name, degree, dates, and "Currently studying" toggle.
- **Step 7: Certifications & Credentials** — Searchable certification list with popular industry accreditation presets (AWS, CKA, PMP, Meta, GCP).
- **Step 8: Review & Export** — Final review step to inspect complete resume before download.

---

### 🎨 Key UX & Architectural Enhancements
- **Fixed Top Navigation Bar**: Stays attached to the top of the viewport for easy access to application navigation.
- **Floating Step Progress Bar**:
  - Displays all 8 steps in a sleek flex chain.
  - Clicking any step node immediately navigates to that step.
  - Non-overflowing responsive layout with clean hover tooltips.
- **Overleaf Live Preview**: Live paper preview card powered by `react-markdown` rendering LaTeX-style paper typography as users type.
- **Accordions with Smart Collapse**: Adding a new project or work experience automatically collapses prior entries for a clutter-free experience.
- **Off-White Design System**: Beautiful `#fcf8ff` off-white theme with soft ambient gradient blurs, indigo highlights, and polished typography matching the authentication flow.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Markdown & Icons**: `react-markdown` & `lucide-react`

---

## 🚦 Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start using ResumeElite.

---

## 🧪 TypeScript Verification

To run static type verification:

```bash
npx tsc --noEmit
```

---

## 📄 License

© 2026 ResumeElite. All rights reserved.
