# Storepoint frontend

React + Vite. Talks to the Express backend for everything — no client-side
mock data.

## What's here

- **Auth**: login, signup, JWT stored in `localStorage`, attached to every
  request via an axios interceptor. `AuthContext` fetches `/auth/me` on load
  to restore the session.
- **Role-gated routing**: `ProtectedRoute` redirects to `/login` if signed
  out, or to `/` if the signed-in role doesn't match the route.
- **Admin**: dashboard counts, user list (filter by name/email/address/role,
  sortable), create-user form, user detail (shows store rating for store
  owners), store list (filter/sort, computed average rating), create-store
  form.
- **Normal user**: store browser with name/address search, star rating shown
  per store (overall + your own), click a star to submit or change your
  rating.
- **Store owner**: dashboard with average rating and the list of everyone
  who's rated the store.
- **Update password**: available to any logged-in role.

The star rating (`components/StarRating.jsx`) is the one component reused
everywhere a rating shows up — in tables, cards, and the dashboard stat.

## Setup

1. Make sure the backend is running first (see `../backend/README.md`).
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` — the default already points at
   `http://localhost:5000/api`, only change it if your backend runs
   elsewhere:
   ```
   cp .env.example .env
   ```
4. Run it:
   ```
   npm run dev
   ```
   Open the printed local URL (typically `http://localhost:5173`).

## Trying it out

1. Sign up as a normal user from `/signup`.
2. Promote that account to `admin` directly in MySQL (see the backend
   README), then log in again.
3. From the admin Users page, create a `store_owner` account, note its ID.
4. From the admin Stores page, create a store with that ID as the owner.
5. Log in as the normal user again to browse stores and submit a rating.
6. Log in as the store-owner account to see the dashboard update.

## Notes

- Sorting/filtering on the admin and store-browse pages is server-driven —
  every filter or sort click re-queries the API, matching how the backend's
  `sortBy`/`order`/filter query params work.
- Styling is plain CSS (`src/index.css`) using CSS custom properties for the
  color/type system — no Tailwind or component library, so there's nothing
  extra to configure.
