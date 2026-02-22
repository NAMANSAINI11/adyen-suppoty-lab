# Webhook Receiver (Node/Express)

Local webhook receiver used to practice support workflows:
validate signature, handle retries, and handle duplicates/idempotency.

## Run
```bash
cd webhooks/receiver
npm install
npm start
```

Listening on:
- http://localhost:3000

## Endpoints
- GET / → 200 "OK - webhook receiver is running..."
- GET /health → 200 `{ "ok": true }`
- POST /webhook → main webhook endpoint
- POST /webhook?fail=500 → forces a 500 (retry simulation)

## Signature validation
- Client sends `x-signature`
- Server computes expected signature using `WEBHOOK_SECRET` (HMAC-SHA256 hex)
- If missing/invalid → 401

Set secret (PowerShell):
```powershell
$env:WEBHOOK_SECRET="dev_secret_change_me"
npm start
```

## Idempotency / duplicates
- Uses `eventId` (or a fallback) as a dedupe key
- First delivery: `duplicate=false`
- Repeat delivery: `duplicate=true`
- Still returns 200 so the sender stops retrying, but marks it as duplicate

## Evidence output
Every request is saved as proof JSON:
- evidence/webhooks/raw/<timestamp>_<dedupeKey>.json