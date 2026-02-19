# Adyen Support Lab (Technical Support Engineer practice)

This repository is a hands-on portfolio project I built to prepare for a **Technical Support Engineer** role in payments/fintech.
It demonstrates how I think in support: reproduce → isolate → test → explain → document.

## What this proves (skills)
- API fundamentals: **URL, methods (GET/POST), headers, body, response**
- Debugging with **HTTP status codes** (2xx/4xx/5xx)
- Using **Postman** to send requests, inspect responses, and validate JSON
- **Webhook direction** and troubleshooting (sender → receiver, acknowledgement)
- Clear support documentation: runbooks + incident-style notes

## Repo structure
- `postman/` → exported Postman collections (JSON)
- `evidence/` → screenshots (Postman runs, webhook receiver logs, errors)
- `runbook/` → troubleshooting runbooks + incident report template
- `notes/` → learning notes + quick reference

## What I built (hands-on)
### 1) Postman API practice
- Tested GET/POST requests
- Compared success vs failure responses
- Fixed common issues: invalid JSON, wrong endpoint, wrong request shape

### 2) Webhook simulation (Adyen-relevant concept)
- Created a webhook receiver (webhook.site)
- Sent POST events to the receiver from Postman
- Verified delivery by checking the incoming request, headers, and JSON payload
- Practiced typical failure scenarios:
  - Wrong URL → **404**
  - Bad payload format → **400**
  - Server error concept → **500** (what it means, how I would triage)

## How to review quickly (for interviewers)
1. Open `runbook/support-troubleshooting-runbook.md`
2. Open `runbook/incident-report-example.md`
3. Check `evidence/` screenshots to see proof of execution
4. Check `postman/` for exported collections

## Notes
This is a learning project. I focused on **support thinking + clear documentation**, not just watching videos.
