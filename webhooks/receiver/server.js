const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();

// Simple homepage (nice for quick local check)
app.get("/", (req, res) => {
  res.status(200).send("OK - webhook receiver is running. Use POST /webhook");
});

// Health endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, ts: new Date().toISOString() });
});

// Raw body needed for signature validation
app.use(express.raw({ type: "*/*", limit: "2mb" }));

const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "dev_secret_change_me";

const RAW_DIR = path.join(__dirname, "..", "..", "evidence", "webhooks", "raw");
fs.mkdirSync(RAW_DIR, { recursive: true });

const seen = new Set();

function hmacSha256Hex(secret, buf) {
  return crypto.createHmac("sha256", secret).update(buf).digest("hex");
}

app.post("/webhook", (req, res) => {
  const receivedAt = new Date().toISOString();
  const rawBody = req.body; // Buffer
  const rawText = rawBody.toString("utf8");
  const headers = { ...req.headers };

  const provided = headers["x-signature"];
  const expected = hmacSha256Hex(WEBHOOK_SECRET, rawBody);

  const sigValid =
    typeof provided === "string" &&
    provided.length === expected.length &&
    crypto.timingSafeEqual(
      Buffer.from(provided, "utf8"),
      Buffer.from(expected, "utf8")
    );

  let parsed = null;
  let parseError = null;
  try {
    parsed = JSON.parse(rawText);
  } catch (e) {
    parseError = e?.message || String(e);
  }

  const eventId = parsed?.eventId || parsed?.id || null;
  const fallback = crypto
    .createHash("sha256")
    .update(rawBody)
    .digest("hex")
    .slice(0, 16);
  const dedupeKey = eventId || `hash_${fallback}`;

  const duplicate = seen.has(dedupeKey);
  if (!duplicate) seen.add(dedupeKey);

  const shouldFail500 = req.query.fail === "500";

  const filename = `${Date.now()}_${dedupeKey}.json`;
  fs.writeFileSync(
    path.join(RAW_DIR, filename),
    JSON.stringify(
      {
        receivedAt,
        signature: { provided: provided || null, expected, valid: !!sigValid },
        idempotency: { eventId, dedupeKey, duplicate },
        failMode: shouldFail500 ? "500" : "none",
        headers,
        body: parseError ? { raw: rawText, parseError } : parsed,
      },
      null,
      2
    ),
    "utf8"
  );

  if (!sigValid)
    return res
      .status(401)
      .json({ ok: false, reason: "Invalid/missing signature", ts: receivedAt });

  if (shouldFail500)
    return res
      .status(500)
      .json({ ok: false, reason: "Simulated 500", ts: receivedAt });

  return res.status(200).json({
    ok: true,
    ack: true,
    duplicate,
    savedAs: `evidence/webhooks/raw/${filename}`,
  });
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));