# Client website and marketing starter

A lightweight first iteration for adapting a service-business website and launch workflow to different clients. It is inspired by lessons from The Flip Fixer; it is not a copy of that production app. No client branding, account identifiers, customer data, or secrets are included.

## Start a client project
1. Copy this repository into a separate client repository. Keep private client planning and credentials out of this public starter.
2. Complete `docs/client-intake.md` in a private client workspace. Set verified public copy and contact details in `config.js`.
3. Preview: from this folder run `python -m http.server 8000`, then open `http://localhost:8000`. The page is static and has no package dependencies.
4. Follow `docs/launch-checklist.md` and `docs/marketing-playbook.md`. Replace example text, page metadata, assets and `noindex` only after a review and when launch is approved.
5. Configure client-owned hosting, domain, email delivery and analytics separately. Test every contact route end to end.

## What works now
- Responsive, accessible basic homepage with configurable services, business copy, and email/call/text links. Blank contact channels are hidden; no fictitious contact details are supplied.
- No form backend, tracking, attribution, consent mechanism, account automation, ad campaigns or social publishing are implemented. These are future modules, not active integrations. The email link opens the visitor's email app; it does not save a lead.
- Pages use `noindex,nofollow` as a launch safeguard; replace it deliberately after configuring the real site. SEO metadata here is only a starting point.
- The site needs JavaScript for the example configuration and service cards. Test the intended browser experience, content, accessibility, and mobile layout before using it for a client.

See `docs/module-map.md` for the sources and limits of planned capabilities. Never copy The Flip Fixer's customer records, branding, testimonial, contact information, identifiers or secrets into a client project.
