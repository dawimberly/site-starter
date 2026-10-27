# Client website and marketing starter

This starter generates a static service-business site from `client.json` using Node 20+. Replace example content and keep client secrets outside the repository. Sample consulting and local-service configurations are in `examples/`.

```sh
npm run build
npm run check:example
npm test
```

Run another config with `node scripts/build.mjs --config examples/consulting.json`. Preview `dist/` with a static web server. For launch, customize `client.json`, set a real HTTPS URL and contact route, add a reviewed client-specific `privacyText`, set `noindex` to false, run `npm run build && npm run check:launch`, and complete the checklist. `check-launch` is a guard, not a substitute for review.

## Optional form
Off by default. Set `leadForm.enabled` to true and deploy with Vercel's Node runtime. Configure server-only `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL` (verified sender), and `RESEND_API_KEY`; no default recipient is supplied. Missing configuration returns 503. Email-only leads are accepted. A success message means Resend accepted the request, not that an inbox received it. Confirm real delivery and sender-domain authentication before use. The endpoint does not persist leads or guarantee global rate limiting; add platform rate limiting, request size limits, monitoring and a privacy/retention plan before production. Resend's idempotency key reduces duplicate sends on retries; its provider retention window applies.

The API reads `client.json`, so deploy using the same config as the build. Example builds using `--config` are previews only; copy the selected client config to `client.json` before deploying, otherwise the form and site can disagree.

## Optional tracking
Off by default. Set `tracking.enabled`, a Google tag ID, conversion ID (`AW-.../label`), and exact hostname allowlist in `client.json`. Tags load only after the visitor selects Allow; denied is the default and consent applies for the current page only. No personal form values are sent to the tag. A conversion is emitted only after a successful lead response, and only while consent is granted. This is a basic consent choice, not a full consent management platform; review jurisdiction, disclosures, tag configuration, and withdrawal requirements before use. No tracking is configured by default.

There is no server form delivery when hosted as plain static files. Booking/social links require verified HTTPS URLs; colors and content need accessibility review. Do not reuse another client's credentials, contact details, claims, images or accounts. See `docs/` for intake, launch and marketing guidance.
