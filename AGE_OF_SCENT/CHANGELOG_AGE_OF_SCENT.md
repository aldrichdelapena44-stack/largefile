# AGE OF SCENT Update Notes

## Brand
- Visible brand name updated to AGE OF SCENT.
- Header/footer brand mark updated to AS.
- Metadata, README, scripts, package names, and product bottle SVG labels updated.

## Feedback
- Added top navigation Feedback link.
- Added public feedback page at `/feedback`.
- Added backend feedback route: `POST /api/feedback`.
- Added admin feedback page at `/admin/feedback`.
- Admin can mark feedback as reviewed or remove it.

## Admin Product Control
- Added admin page at `/admin/products`.
- Admin can edit product name, price, stock, scent notes, visibility, and description.
- Added backend admin routes:
  - `GET /api/admin/products`
  - `PUT /api/admin/products/:id`

## Admin File Submission Control
- Existing verification system preserved.
- Admin verification page now previews uploaded client files when available.
- Admin can approve/reject verification records.
- Admin can keep uploaded files or remove uploaded files from storage.
- Added backend routes:
  - `PUT /api/admin/verifications/:id/file/keep`
  - `PUT /api/admin/verifications/:id/file/remove`

## Persistence
- Admin product edits are saved to `backend/data/products.json`.
- Client feedback is saved to `backend/data/feedback.json`.
- Verification submission records and file keep/remove status are saved to `backend/data/verifications.json`.
- Uploaded files still live under `backend/uploads/ids`.

## Preserved
- Backend was not rebuilt.
- Existing auth, orders, checkout, payments, users, verification, admin guard, upload folders, and API structure were preserved.

## Admin Login
```txt
Email: admin@ageofscent.local
Password: admin12345
```

Compatibility alias still accepted:
```txt
Email: admin@maisonaurum.local
Password: admin12345
```
