# Storepoint — Store Ratings Platform

Full submission for the FullStack Intern Coding Challenge: Express.js + MySQL
backend, React (Vite) frontend, JWT auth shared across three roles (System
Administrator, Normal User, Store Owner).

```
backend/    Express API — auth, RBAC, admin/user/store-owner routes, Sequelize models
frontend/   React app — login/signup, role-gated dashboards, store browsing + rating
```

## Quick start (Docker)

The fastest way to get everything running — MySQL included, no local Node or
MySQL install needed:

```
cp .env.example .env    # defaults are fine for local dev, adjust if you like
docker compose up --build
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

First run creates the database, and `sequelize.sync()` creates the tables on
backend startup. To get a login without hand-writing SQL, run the seed
script once the backend container is up:
```
docker compose exec backend npm run seed
```
This prints an admin email/password (`admin@storepoint.test` /
`AdminPass1!` by default — override with `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` env vars). Log in, then change the password from
`/account/password`.

Source is volume-mounted into both containers, so edits on your machine
hot-reload inside them — no rebuild needed for code changes, only for new
dependencies.

## Quick start (without Docker)

If you'd rather run MySQL and Node directly:

**1. Backend** (see `backend/README.md` for full detail)
```
cd backend
npm install
cp .env.example .env   # fill in your MySQL credentials + a JWT secret
npm run dev
```
Runs on `http://localhost:5000`. On first start it connects to MySQL and
creates the `users`, `stores`, and `ratings` tables from the Sequelize
models (`sequelize.sync`) — no manual migration step needed for local dev.

**2. Frontend** (see `frontend/README.md` for full detail)
```
cd frontend
npm install
cp .env.example .env   # defaults to http://localhost:5000/api
npm run dev
```
Runs on `http://localhost:5173`.

**3. Try it end to end**
1. Sign up as a normal user at `/signup`.
2. Get an admin account — either run `npm run seed` in `backend/` (prints a
   ready-to-use email/password), or promote the account you just signed up
   with: `UPDATE users SET role = 'admin' WHERE email = '...';`
3. Log in as admin. Create a `store_owner` user, then create a store with
   that user's ID as the owner.
4. Log in as the normal user to browse stores and submit a rating.
5. Log in as the store owner to see the dashboard update with that rating.

## What's implemented against the spec

- Single login, role-based access via JWT + RBAC middleware.
- Signup (normal users), password update (any role).
- Admin: dashboard counts, add users (any role) and stores, list users/stores
  with filter (name/email/address/role) + sort (asc/desc on key fields), user
  detail (with store rating for store owners).
- Normal user: store list with name/address search, overall rating, submit
  and modify own rating (1–5).
- Store owner: dashboard with raters list and average rating.
- Validation matching the spec: name 20–60 chars, address ≤400 chars,
  password 8–16 chars with an uppercase letter and a special character,
  standard email format.

## Design decision worth knowing about

The spec has admin adding "normal users and admin users" but doesn't say how
a store-owner account is created — and a store needs an owner for the
`stores.owner_id` foreign key to mean anything. The implementation has admin
create the store-owner account first (via the same "add user" endpoint, with
`role: store_owner`), then create the store pointing at that user's ID. Both
READMEs walk through this flow with the exact requests to send.
