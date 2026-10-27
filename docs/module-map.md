# Module map and roadmap

| Capability | First iteration | Next step |
|---|---|---|
| Website | Configurable static service homepage and public contact links | Add reusable service and content pages as needed |
| Lead forms | Not implemented | Adapt and test a delivery backend with validation and failure handling |
| Analytics and ads | No tags or events | Add opt-in client-specific configuration, privacy review and verified events |
| Lead attribution | Not implemented | Inspect the saved lead-attribution starter and integrate only after review |
| SEO | Editable title/description, default noindex | Client-specific canonical, sitemap, structured data and indexing workflow |
| Social | Planning guidance | Build reusable content workflows when a client needs them |
| Estimator, login, database | Not included | Separate optional product, only when required and independently reviewed |

The Flip Fixer source contains useful examples of public pages, contact delivery and tracking. Those components are coupled to its React/TanStack stack, business configuration and services; they require deliberate extraction and testing before reuse. The Augustson site is a consulting example, not the template's content. No claims are made that an existing client's integration is ready for another client.
