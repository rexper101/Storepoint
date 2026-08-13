# Storepoint backend

Express.js + MySQL (via Sequelize) API for the FullStack Intern Coding Challenge.
Single JWT-based login shared by all three roles, with role-based access control
on every protected route.

## What's here

- MySQL connection (`src/config/db.js`) and Sequelize models for `User`, `Store`,
  `Rating`, with associations wired up in `src/models/index.js`.
- **Auth** (`/api/auth`): signup, login, logout, get-current-user, update-password.
- **Admin** (`/api/admin`, gated to `role: admin`): dashboard counts, create user
  (any role) and store, list users/stores with filtering (`?name=`, `?email=`,
  `?address=`, `?role=` for users) and sorting (`?sortBy=&order=asc|desc`),
  single-user detail (includes average store rating for store owners).
- **Stores** (`/api/stores`, gated to `role: normal_user`): search stores by
  name/address, each result includes the overall average rating and the
  current user's own rating; submit or modify a rating (`POST`/`PUT`
  `/api/stores/:id/ratings`, both upsert on the same unique constraint).
- **Store owner** (`/api/store-owner`, gated to `role: store_owner`): dashboard
  with the list of everyone who's rated their store and the average rating.
- JWT issuing (`utils/generateToken.js`) and verification
  (`middleware/authenticate.js`); role guard (`middleware/authorize.js`) —
  usage: `authorize('admin', 'store_owner')` on any route that should be
  restricted.
- Form validation matching the spec (name 20–60 chars, address max 400,
  password 8–16 chars with an uppercase letter and a special character,
  standard email format).
- Passwords hashed with `bcryptjs` (pure JS — no native compilation, so it
  builds cleanly in Docker/Alpine without extra build tools).
- `helmet` for standard security headers, and rate limiting (20 requests /
  15 min per IP) on `/auth/login` and `/auth/signup` to blunt brute-force
  attempts.
- Centralized error handling for Sequelize validation/uniqueness errors.
- `scripts/seed.js`: creates a first admin account, so you don't have to
  hand-edit the database to get started.

**Design note:** the spec has admin adding "normal users and admin users," but
doesn't say how a store-owner account comes to exist. Since `stores.owner_id`
needs to point at *some* user, `POST /api/admin/users` accepts `role` of
`admin`, `normal_user`, or `store_owner` — so the flow is: admin creates the
store-owner account first, then creates the store with that user's `id` as
`ownerId`.

## Setup

Prefer Docker? See the root `README.md` — `docker compose up --build` handles
MySQL, install, and startup in one step. Running directly:

1. Install dependencies:
   ```
   npm install
   ```
2. Create a MySQL database (or let Sequelize do it — `sql/schema.sql` is there
   for reference, but `server.js` calls `sequelize.sync({ alter: true })` on
   startup, which creates/updates the tables from the models automatically).
3. Copy `.env.example` to `.env` and fill in your MySQL credentials and a JWT
   secret:
   ```
   cp .env.example .env
   ```
4. Run it:
   ```
   npm run dev
   ```
   You should see `Database connection established`, `Models synced`, and
   `Server running on port 5000`.
5. Get a first admin login without touching SQL:
   ```
   npm run seed
   ```
   Prints an email/password (defaults: `admin@storepoint.test` /
   `AdminPass1!` — override with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`
   / `SEED_ADMIN_NAME` env vars).

## Testing the routes

Health check:
```
curl http://localhost:5000/api/health
```

### Auth

Sign up (name must be 20–60 chars, password needs an uppercase letter and one of
`!@#$%^&*`):
```
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jordan Alexander Smith",
    "email": "jordan@example.com",
    "address": "12 Main Street",
    "password": "Passw0rd!"
  }'
```
Returns `{ token, user }`. Save the token — signup always creates a
`normal_user`.

Log in:
```
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "jordan@example.com", "password": "Passw0rd!" }'
```

Get the logged-in user / update password:
```
curl http://localhost:5000/api/auth/me -H "Authorization: Bearer <TOKEN>"

curl -X PUT http://localhost:5000/api/auth/password \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{ "oldPassword": "Passw0rd!", "newPassword": "NewPassw0rd!" }'
```

### Admin (needs an admin token — use `npm run seed`, or promote a user with
`UPDATE users SET role = 'admin' WHERE email = '...';` then log in again)

```
curl http://localhost:5000/api/admin/dashboard -H "Authorization: Bearer <ADMIN_TOKEN>"
```

Create a store-owner account, then a store pointing at it:
```
curl -X POST http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer <ADMIN_TOKEN>" -H "Content-Type: application/json" \
  -d '{
    "name": "Morgan Riley Store Owner",
    "email": "owner@example.com",
    "password": "OwnerPass1!",
    "address": "1 Market Street",
    "role": "store_owner"
  }'
# -> note the returned user.id, use it as ownerId below

curl -X POST http://localhost:5000/api/admin/stores \
  -H "Authorization: Bearer <ADMIN_TOKEN>" -H "Content-Type: application/json" \
  -d '{ "name": "Corner Cafe", "email": "cafe@example.com", "address": "2 Market Street", "ownerId": 2 }'
```

List/filter/sort, and detail:
```
curl "http://localhost:5000/api/admin/users?role=store_owner&sortBy=name&order=asc" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

curl "http://localhost:5000/api/admin/stores?name=cafe" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

curl http://localhost:5000/api/admin/users/2 -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### Normal user (needs a `normal_user` token, e.g. the `jordan@example.com` one above)

Search stores (each result includes `overallRating` and your own `myRating`):
```
curl "http://localhost:5000/api/stores?name=cafe" -H "Authorization: Bearer <TOKEN>"
```

Submit or modify a rating (both do the same upsert):
```
curl -X POST http://localhost:5000/api/stores/1/ratings \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{ "rating": 5 }'
```

### Store owner (log in as the `owner@example.com` account created above)

```
curl http://localhost:5000/api/store-owner/dashboard -H "Authorization: Bearer <OWNER_TOKEN>"
```
Returns the store's average rating and the list of everyone who's rated it.
