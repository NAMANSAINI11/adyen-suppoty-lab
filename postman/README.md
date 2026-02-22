# Postman

This folder contains the Postman exports used to test the webhook receiver.

## What’s included
- Postman Collection export (import into Postman)
- Optional: Environment export (variables like baseUrl, secret)

## Import
1. Open Postman
2. Click **Import**
3. Select the collection JSON from this folder

## Run
1. Ensure the receiver is running:
   - `cd webhooks/receiver`
   - `npm install`
   - `npm start`
2. In Postman, open the collection and run requests in this order:
   - Valid signature → expect 200
   - Invalid signature → expect 401
   - Simulated 500 → expect 500
   - Retry success → expect 200
   - Duplicate/idempotency → expect 200 with duplicate=true (or proof saved)

## Variables
If your collection uses variables, set these in a Postman Environment:
- `baseUrl` = `http://localhost:3000`
- `webhookSecret` = `dev_secret_change_me`

## Evidence
- Screenshots: `evidence/webhooks/screenshots/`
- Raw proof JSON: `evidence/webhooks/raw/`