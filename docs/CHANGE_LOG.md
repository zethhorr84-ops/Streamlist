# StreamList implementation change log

## Added
- `src/auth/AuthContext.jsx`: Google Identity Services loader, in-memory user state, profile handling, and sign-out behavior.
- `src/components/ProtectedRoute.jsx`: redirects unauthenticated visits to `/login` while preserving the originally requested route.
- `src/pages/Login.jsx`: Google sign-in button, configuration/error messaging, and post-login navigation.
- `src/pages/Checkout.jsx`: card-number grouping, form validation, mock-data confirmation, localStorage demo persistence, saved-card list, and removal control. CVV is not persisted.
- `.env.example`: configuration template for Google OAuth and the existing TMDB feature.
- `docs/FINAL_PROJECT_DESIGN.md`: requirements mapping, architecture/workflow, setup, security analysis, test plan, video outline, and references.

## Updated
- `src/App.jsx`: added the login route, protected application shell, and checkout route.
- `src/components/Navbar.jsx`: added signed-in user display and sign-out control.
- `src/pages/Cart.jsx`: replaced the Week 4 placeholder with clearly labeled sample cart items and a Checkout link.
- `src/App.css`: added responsive login, account-control, cart, and checkout styles.
- `README.md`: added setup and security instructions.

## Existing features retained
- Home/watchlist components and behavior.
- TMDB movie search page.
- About page.
- Existing React Router, Vite, and React dependencies.

## Deliberate limitations
- No real payment is processed.
- Card data saved to localStorage must be fictional test data only.
- CVV is not saved.
- Authentication state is held in memory and resets on refresh; the Google ID-token payload is decoded for display but not signature-verified by a backend. Production deployment needs backend token verification and a secure session.
