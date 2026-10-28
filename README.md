# StreamList

StreamList is a React + Vite application for the EZTechMovie course project. The current version includes the watchlist/movie pages, Google sign-in UI, protected routes, a demonstration cart, and a credit-card form for mock test data.

## Run locally

1. Copy `.env.example` to `.env`.
2. Add a Google OAuth **Web application** client ID as `VITE_GOOGLE_CLIENT_ID` and authorize the Vite origin (usually `http://localhost:5173`) in Google Cloud Console.
3. Optionally add `VITE_TMDB_API_KEY` for the existing movie search.
4. Run `npm install`, then `npm run dev`.

See [docs/FINAL_PROJECT_DESIGN.md](docs/FINAL_PROJECT_DESIGN.md) for the assignment requirements mapping, Google Cloud setup, security discussion, test plan, presentation outline, and references.

## Security notice

This is a course prototype, not a production authentication or payment system. The Google profile is held in memory; the browser-side JWT payload decoding is not server-side signature verification. Production apps must verify Google ID tokens on a trusted backend. The checkout stores only fictional test card data in localStorage to demonstrate the assignment requirement; never enter real payment-card data. CVV is not stored. Real payments should use a payment provider's hosted checkout/fields and tokenization.
