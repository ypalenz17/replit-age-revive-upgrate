# Security Hardening Notes

This repository was hardened with low-risk, non-visual changes focused on API and server behavior.

## What was changed

- Removed API response-body logging from request logs.
- Disabled the `X-Powered-By` header.
- Added baseline HTTP security headers:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Resource-Policy: same-origin`
  - `Strict-Transport-Security` (production only)
- Tightened CORS for `/api`:
  - allow same-host origins
  - allow optional configured origins from `CORS_ORIGIN` (comma-separated)
  - reject unknown cross-origins with `403`
  - handle preflight requests with `204`
- Tightened body parsing:
  - JSON parser set to strict mode
  - request body size limits set to `100kb` for JSON and URL-encoded payloads
- Hardened error handling:
  - invalid JSON payloads return `400` with safe message
  - 5xx responses return generic message without leaking internal error details
- Added simple input validation on `/api/site-content` to reject unexpected query parameters.

## Dependency audit status

- Transitive security advisories were addressed using `overrides`:
  - `lodash` -> `4.17.23`
  - `minimatch` -> `9.0.6`
  - `qs` -> `6.15.0`
- `npm audit` now reports `0 vulnerabilities`.
