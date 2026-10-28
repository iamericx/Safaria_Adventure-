# SAFARIYA Adventure

## Architecture

This repository is a static multi-page HTML, CSS and browser JavaScript site, not a React app. Customer authentication and booking requests use Supabase Auth and the Supabase JS client loaded as an ES module. Only the public project URL and anon key belong in `js/supabase-config.js`; never put a service-role key or other secret in frontend code. Row-level security is required for customer records.

There is no server runtime, package manifest, production build command, payment processor, verified package inventory, hotel reservation feed, or staff dashboard in this repository.

## Account routes

- `auth.html`: email registration, sign-in, Google and Apple OAuth, verification resend, reset email and password recovery.
- `account.html`: protected customer profile and trip-request dashboard.
- `package.html?id=serengeti-coast`, `?id=northern-wild`, or `?id=above-clouds`: public sample journey details and a trip request form. Signing in is required only when submitting. The selected itinerary, dates and traveller count resume after authentication; no saved booking is treated as authoritative before Supabase records it.
- `terms.html` and `privacy.html`: account registration disclosures.

A sign-up is not treated as verified until Supabase returns a user with `email_confirmed_at`. Passwords and reset tokens are handled by Supabase Auth. OAuth buttons call Supabase's supported OAuth flow and work only after the provider credentials are configured. Provider passwords are never collected by SAFARIYA.

## Supabase setup

1. Create a Supabase project. Set its Site URL to the deployed SAFARIYA origin. Add the local development origin and a narrowly scoped `/auth.html*` redirect pattern for each real domain; the callback carries a `return` query and recovery mode. Avoid broad production wildcards. Enable email/password sign-in and require email confirmation.
2. Configure email delivery. For production, use a trusted custom SMTP provider, branded confirmation and recovery templates, and the actual published domain. If the default email templates do not honor `redirectTo`, use Supabase's `{{ .RedirectTo }}` value for the confirmation and recovery target.
3. Apply migrations in order in the Supabase SQL Editor (or through the Supabase CLI):
   - `supabase/migrations/202610180001_customer_bookings.sql`
   - `supabase/migrations/202610210001_customer_profiles_change_requests.sql`
4. Copy the project's **Project URL** and **anon/public key** into `js/supabase-config.js` as `SUPABASE_URL` and `SUPABASE_ANON_KEY`. These values are public browser configuration. Never use a service-role key.
5. In Supabase Auth > Providers, enable Google and/or Apple. Configure the provider's client credentials and callback URL using the Supabase Auth callback shown in its provider settings. Add each local and production site URL to Supabase's redirect allowlist. Google requires OAuth credentials in Google Cloud. Apple requires a Services ID, Sign in with Apple configuration, key and team identifiers from the Apple Developer account.
6. Serve this folder over HTTP(S). ES modules and OAuth redirects do not work from `file://` URLs.
7. Test signup and recovery with a mailbox that can receive the configured messages, then test each enabled OAuth provider on its registered domains.

Until project configuration and migrations have been applied, the account pages show setup guidance; no authentication or booking success is simulated.

## Serengeti map setup

The Serengeti Leaflet map uses CARTO's Voyager raster basemap. CARTO requires a provider-issued API key, including for free use. Request a key at [CARTO Basemaps](https://www.carto.com/basemaps/apikey/), restrict it to the deployed website's domain in the CARTO dashboard, then put it in the empty `carto-basemap-api-key` meta tag in `destinations/serengeti.html`. This key is browser-visible, so use CARTO's domain restrictions and usage dashboard; do not put a private server secret there. The map keeps CARTO and OpenStreetMap attribution visible. CARTO currently lists a monthly fair use limit of 1 million requests for commercial use on the free tier; check its current terms and pricing before launch.

## Customer data and trip requests

The profile trigger creates one `customer_profiles` row for each new auth user and the second migration backfills existing users. Profile and booking policies restrict reads and writes to `auth.uid()`. Booking inserts can set request details only; customers cannot set booking or payment status. Change requests are stored separately and require ownership of the parent booking. Customer clients cannot edit booking status, payment status, or change-request status.

The current journey entries are samples derived from the existing site copy. Prices, availability, full day-by-day itineraries, accommodation, inclusions and date inventory are not in this project. A submitted request is an enquiry, never a confirmed reservation. The account shows payment status as `not started`; payment statuses are reserved for a future server-verified payment integration. This site does not collect card details or take payments. Hotel information is not integrated and is stated as such in the account.

Visitors can browse destinations, journeys and sample package details without an account. Submitting a package request asks them to sign in and returns them to the same request. A short-lived `sessionStorage` draft carries the selected journey dates and traveller count across that redirect. The server-side database policy remains authoritative when the request is submitted.

## Verification and limits

The repository has no package manager, production build command, configured Supabase project, browser exposed in this workspace, or end-to-end test suite. Static checks validate JavaScript syntax, form IDs and controls, local asset paths, migration policies and responsive CSS; they cannot prove email delivery, OAuth setup, live session behavior, cross-customer isolation or database writes. Those live checks require the Supabase project, provider credentials, migrations and a browser.

Supabase's browser SDK manages the client session and token refresh. This static site does not issue an HttpOnly server cookie. Do not treat a request status as a confirmed booking or a payment state as proof of a transaction; any future payments must use a trusted provider and server-side verification.
