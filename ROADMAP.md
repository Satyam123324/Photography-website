# PhotoConnect — 2-Week Build Plan

A marketplace where photographers of every type showcase their work, customize their
profile, set their availability, and take bookings. Redesigned around a **warm & modern,
solid UI**.

**Stack (unchanged):** MERN — Express + MongoDB/Mongoose backend, React (Vite) + Tailwind +
Framer Motion frontend, Cloudinary for media, Nodemailer for email.

## What already exists (reused, not rebuilt)

- **Backend:** auth, photographer profiles, portfolio, booking, reviews — models,
  controllers, and routes are all present.
- **Frontend:** auth pages, customer + photographer dashboards, a profile page,
  Navbar/Footer, AuthContext, axios client.

The work below is **redesign + fill the gaps**, not a from-scratch rebuild.

## Design direction — "Warm & Modern"

Design tokens to define on Day 1 and use everywhere (no more ad-hoc styling):

| Token | Value | Use |
|-------|-------|-----|
| Base background | `#FAF8F5` (warm off-white) | page background |
| Surface / card | `#FFFFFF` with `#EFE9E1` border | solid cards, rounded-2xl |
| Text primary | `#2B2622` (warm charcoal) | headings, body |
| Text muted | `#8A8078` | secondary text |
| Accent | `#E0784E` (terracotta) | buttons, links, active states |
| Accent hover | `#C9663D` | hover |
| Success / Error | `#3F9D5A` / `#D14343` | booking states |

Principles: solid fills (no glassmorphism/heavy gradients), generous whitespace, strong
type scale, rounded-2xl cards with soft shadows, photos are the hero.

**New libraries to add:** `react-day-picker` + `date-fns` (calendar), `react-icons`,
`clsx`. Keep Framer Motion for subtle transitions only.

---

## Milestone 0 — Design system & shell · Day 1

The foundation so the rest of the app looks "solid" by default.

- Configure Tailwind theme with the color/spacing/typography tokens above.
- Build base components: `Button`, `Card`, `Input`, `Select`, `Badge`, `Avatar`,
  `Modal`, `EmptyState`, `Spinner`.
- Redesign `Navbar` + `Footer` and a page layout wrapper.

**Done when:** a components style page renders every base element in the warm theme and
Navbar/Footer are live on all routes.

## Milestone 1 — Discover photographers · Day 2–4

"All types of photographers present" — the browse experience.

- **Backend:** add `specialties`/`category` + `city` fields to `PhotographerProfile`;
  add `GET /api/photographers` with search, category filter, city filter, sort, and
  pagination.
- **Frontend:** redesign `Home` (hero, categories, featured photographers); new
  **Explore** page with category chips (Wedding, Portrait, Event, Product, Fashion,
  Wildlife, Newborn, Real Estate…), search bar, filters, and a responsive
  `PhotographerCard` grid.

**Done when:** a visitor can search/filter and land on any photographer's public profile.

## Milestone 2 — Profile & portfolio showcase · Day 5–7

Where photographers show their work.

- **Public profile:** redesigned header (avatar, name, specialties, city, rating, "Book"
  CTA), about, packages, portfolio gallery with lightbox, reviews.
- **Photographer dashboard:** upload/manage portfolio images (Cloudinary), edit bio,
  specialties, and packages.

**Done when:** a photographer can build out a complete public profile and a visitor sees
a polished gallery.

## Milestone 3 — Booking with calendar availability · Day 8–10

The core transaction (full availability model, no payment yet).

- **Backend:** `Availability` model (photographer date/time slots); endpoints to set and
  fetch availability; booking creates against an open slot with conflict prevention;
  status flow (pending → confirmed → completed/cancelled); email notifications via
  Nodemailer.
- **Frontend:** photographer availability manager (mark open dates/slots); customer
  booking calendar (`react-day-picker`) showing only open slots; booking flow +
  confirmation; both dashboards list upcoming/past bookings with status actions.

**Done when:** a customer books a real open slot and both parties get an email; double-
booking is impossible.

## Milestone 4 — Profile UI customization · Day 11–12

"Photographer can change the UI."

- **Backend:** add `theme` (preset id) + `accentColor` to `PhotographerProfile`.
- **Frontend:** 2–3 preset profile **layout templates** + an accent-color picker in the
  dashboard; live preview; the public profile renders the chosen theme + color.

**Done when:** a photographer switches theme/color and their public page updates.

## Milestone 5 — Reviews, polish, test & deploy · Day 13–14

- Reviews enabled only after a completed booking; show rating on cards/profiles.
- QA pass: responsive (mobile→desktop), loading/empty/error states everywhere,
  basic accessibility (focus, alt text, contrast).
- Seed script with demo photographers across categories for a good first impression.
- Manual test checklist for each flow; fix bugs.
- Deploy: frontend (Vercel), backend (Render), MongoDB Atlas; set env vars; smoke test.

**Done when:** the app is live, seeded, responsive, and every core flow works end to end.

---

## Suggested weekly split

- **Week 1 (Day 1–7):** Milestones 0–2 — design system, discovery, profiles/portfolio.
- **Week 2 (Day 8–14):** Milestones 3–5 — booking/calendar, customization, polish & deploy.

## Dependencies / risks

- **Cloudinary** must be working (rotate the leaked keys first — see security note).
- **Calendar/conflict logic** is the trickiest part; it's front-loaded to Day 8–10 so
  there's buffer.
- Payment and drag-and-drop profile builder are intentionally **out of scope** for these
  2 weeks (good candidates for week 3+).

## Reminder

The old `.env` was public on GitHub — rotate MongoDB, JWT, Cloudinary, and email
credentials before deploying anything.
