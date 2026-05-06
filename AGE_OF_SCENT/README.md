# AGE OF SCENT

AGE OF SCENT is the upgraded luxury perfume e-commerce version of the original Vape_Web project. The backend architecture, authentication flow, admin system, order routes, verification routes, and API structure were preserved, while the frontend remains the cinematic parallax perfume boutique.

## What Changed This Time

- Brand name changed to **AGE OF SCENT** across the visible website, metadata, README, scripts, and product bottle artwork.
- Added a **Feedback** link in the top navigation beside the Admin area for logged-in admins and as a public top navigation link for guests.
- Added a public `/feedback` page that submits client feedback through the backend API.
- Added admin feedback control at `/admin/feedback` so admin can review, mark as reviewed, or remove client feedback.
- Added admin product control at `/admin/products` so admin can change product name, price, stock, scent notes, visibility, and description.
- Improved admin verification control at `/admin/verifications` so admin can approve/reject submissions and also keep or remove uploaded client files.

## Preserved Backend

The backend was not rebuilt. Existing systems remain in place:

- `/api/auth`
- `/api/products`
- `/api/orders`
- `/api/payments`
- `/api/users`
- `/api/verifications`
- `/api/admin`
- `/api/webhooks`
- Admin guard/auth flow
- Cart and checkout flow
- Upload folders
- Existing route/controller/service structure

## New or Updated Admin Routes

```txt
GET    /api/admin/products
PUT    /api/admin/products/:id
GET    /api/admin/feedback
PUT    /api/admin/feedback/:id/review
DELETE /api/admin/feedback/:id
PUT    /api/admin/verifications/:id/file/keep
PUT    /api/admin/verifications/:id/file/remove
```

## Public Feedback Route

```txt
POST /api/feedback
```

## Quick Start

Install dependencies separately in backend and frontend if `node_modules` is not included.

```powershell
cd backend
npm install
npm run dev
```

```powershell
cd frontend
npm install
npm run dev
```

Default admin login:

```txt
Email: admin@ageofscent.local
Password: admin12345
```

The old admin email `admin@maisonaurum.local` is still accepted as a compatibility alias.

Frontend runs on `http://localhost:3000` and backend runs on `http://localhost:4000` by default.
