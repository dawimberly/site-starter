# Module map and roadmap

| Capability | First iteration | Next step |
|---|---|---|
| Website | Configurable static service homepage and public contact links | Add reusable service and content pages as needed |
| Lead forms | Optional Vercel/Resend endpoint, off by default | Add production-grade rate limiting, monitoring and end-to-end verification |
| Analytics and ads | Optional consent-gated Google tag and accepted-lead conversion | Verify consent, privacy, host and conversion setup per client |
| Lead attribution | Not implemented | Design and test a separate module before enabling |
| SEO | Editable title/description, default noindex | Client-specific canonical, sitemap, structured data and indexing workflow |
| Social | Planning guidance | Build reusable content workflows when a client needs them |
| Estimator, login, database | Not included | Separate optional product, only when required and independently reviewed |

The [Flip Fixer repository](https://github.com/dawimberly/flpfxr) contains examples of public pages, contact delivery and tracking. Those components are coupled to its React/TanStack stack and business configuration; they require deliberate extraction and testing before reuse. No existing client's integration is assumed ready for another client.
