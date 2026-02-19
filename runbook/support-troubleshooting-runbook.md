# Support Troubleshooting Runbook (API + Webhooks)

## Goal
Restore merchant payment flow ASAP by isolating where the failure is:
Client → Merchant server → Adyen platform → Webhook delivery → Merchant processing

---

## 1) First 60 seconds (triage checklist)
- What is failing? (payment, refund, webhook, API call)
- When did it start? (time + timezone)
- Scope: one merchant or many?
- Severity: payments blocked or partial?
- Any recent changes? (deployment, config, keys, firewall)

---

## 2) API request checklist (Postman-friendly)
### Inputs to collect
- Environment: test vs live
- Endpoint URL + method (GET/POST)
- Request headers (Content-Type, Authorization)
- Request body (JSON)
- Response status + response body
- Correlation IDs / references (if available)

### Common mistakes
- Wrong base URL / wrong path → 404
- Invalid JSON (missing comma/quote) → 400
- Missing/invalid auth token → 401
- Permission issue / role / IP allowlist → 403

---

## 3) Status codes: what they mean + first check
- **200/201**: Success → confirm response fields match expectation
- **400**: Bad request → validate JSON, required fields, data types
- **401**: Unauthorized → auth header/token/key + correct environment
- **403**: Forbidden → permissions, allowed IPs, credentials
- **404**: Not found → base URL + path + typos + environment
- **409**: Conflict → duplicate/state conflict (idempotency)
- **429**: Rate limit → backoff/retry strategy
- **500**: Server/transient → retry; collect evidence; check reproducibility; escalate

---

## 4) Webhooks: how to troubleshoot (very Adyen-relevant)
### What a webhook is
A webhook is an event notification sent asynchronously:
**Adyen → Merchant webhook endpoint (HTTP POST)**

### What “good” looks like
- Adyen sends POST with event payload
- Merchant endpoint returns **200 OK quickly**
- Merchant processes event and stores it

### If webhook delivery fails (what to check)
1. Endpoint URL correct? (typos → 404)
2. Endpoint reachable from internet? (DNS/firewall)
3. Endpoint returns **200**? (non-200 triggers retries)
4. Response time too slow? (timeouts)
5. Signature/secret validation mismatch? (rejected)
6. Merchant server errors? (500)

### Evidence to collect
- Timestamp of attempts
- HTTP status returned by endpoint
- Response time
- Request/response headers
- Payload sample (remove sensitive data)
- Any server logs from merchant side

---

## 5) Escalation template (clean handoff)
**Summary:** what is broken, impact, since when  
**What I checked:** bullets  
**Evidence:** status codes, payload, timestamps  
**Hypothesis:** likely cause  
**Next action:** what team needs to do next
