# Webhook Evidence

## Screenshots (Postman)
Folder: evidence/webhooks/screenshots/

What to look for:
- 01-valid-200-with-x-signature.png → valid signature, 200 response
- 02-invalid-signature-401-with-console.png → invalid signature, 401 + proof
- 03-duplicate-first-false.png → first delivery duplicate=false
- 04-simulated-500.png → forced 500 (retry scenario)
- 05-retry-success-200.png → retry succeeds with 200

## Raw proof JSON
Folder: evidence/webhooks/raw/

Each file includes:
- receivedAt timestamp
- signature provided vs expected (valid/invalid)
- idempotency fields (dedupeKey, duplicate)
- headers + body