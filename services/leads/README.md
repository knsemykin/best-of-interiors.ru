# Lead email service

Recipient is fixed to hello@best-of-interiors.ru. SMTP credentials are server-side only.

## Yandex Cloud Functions

Bundle `yandex.cjs` as `index.js`, `server.mjs`, `studios.json`, and a package.json with nodemailer 10.0.16 (without `type: module`). Entry point: `index.handler`. Node.js 22 or newer, memory 128 MB, timeout 30 seconds, no prepared instances, concurrency 1. Set maximum instance count to 1 initially. Set SMTP_USER and SMTP_PASSWORD in secure function configuration, never in Git or PUBLIC variables.

Client configuration: PUBLIC_LEADS_ENDPOINT = the function HTTPS invocation URL. The website remains on Timeweb static hosting.

CORS permits only the production domains. Consent, phone, studio IDs, payload sizes and the honeypot are validated server-side. SMTP failures never return success. Success means SMTP accepted the recipient, not proof of inbox placement; verify the first test email in the mailbox.

Rate limiting and duplicate suppression are per warm instance and reset on cold start. They are not a durable global quota or an exactly-once delivery guarantee. Add durable storage and CAPTCHA before increasing traffic/concurrency. Do not log event bodies or SMTP credentials. Yandex free tier does not guarantee zero cost for all related resources.

Tests: `npm ci && npm test` from this directory. HTTP server variant remains available for local integration tests.
