# StreamList — Security and Credit Card Management System

## 1. Project overview

StreamList is a React single-page application for EZTechMovie. The final-project update adds Google sign-in, protected routes, a cart-to-checkout path, and a credit-card management form. The card form is a classroom demonstration: it validates mock card data and demonstrates browser persistence, but it does not authorize or process payments.

## 2. Requirements and implementation mapping

| Assignment requirement | Implementation in this project | Evidence to show |
|---|---|---|
| Google OAuth login | Google Identity Services button on `/login`; OAuth client ID supplied through `VITE_GOOGLE_CLIENT_ID` | Show Google button and successful sign-in |
| Logged-out users must see login only | `ProtectedRoute` wraps the application shell and redirects to `/login` | Open `/movies`, `/cart`, or `/checkout` in a fresh/logged-out session |
| Successful sign-in opens the app | Login callback routes to the originally requested path, or Home | Sign in and show the destination |
| Checkout button after cart | Cart includes sample items and a “Proceed to Checkout” button | Click Cart → Checkout |
| Credit-card component | `/checkout` form for cardholder, card number, expiry, CVV, and optional ZIP | Show validation and formatted input |
| Card number format | Input strips non-digits and displays groups of four up to 16 digits | Enter `4242424242424242`; the UI formats it as `4242 4242 4242 4242` |
| Save card information to localStorage | Mock cardholder, mock card number, expiry, optional ZIP, and metadata stored under `streamlist_demo_cards_v1` | Save demo card and refresh to show it remains |
| Security awareness | CVV is validated transiently but not saved; prominent mock-data notice | Explain why this is not production payment storage |

## 3. Design and workflow

1. A visitor requests a protected path.
2. If no in-memory authenticated user exists, React Router redirects the visitor to `/login`. The navigation bar and application content are not rendered for logged-out users.
3. Google Identity Services renders the Google sign-in button using the configured OAuth client ID.
4. After Google returns an ID-token credential, the prototype reads profile claims for the UI and stores the profile in React memory. The ID token itself is not written to localStorage or sessionStorage.
5. The user can access Home, Movies, Cart, and About. The Cart contains clearly labeled fictional demonstration products and prices.
6. “Proceed to Checkout” navigates to `/checkout`.
7. The form validates the cardholder name, 16-digit card number, future MM/YY expiry, CVV length, and explicit confirmation that the information is fictional test data.
8. The saved demo record is written to localStorage and shown in the saved-cards panel. The CVV is never included in the saved record. A saved demo record can be removed.
9. Sign out clears the in-memory profile and returns the user to `/login`.

## 4. Setup instructions

### Prerequisites

- Node.js and npm.
- A Google account and a Google Cloud project.
- Internet access for the Google Identity Services JavaScript library.

### Google Cloud configuration

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Select or create a project.
3. Configure the OAuth consent screen / Google Auth Platform branding and audience as required for the class account.
4. Create an OAuth client ID with application type **Web application**.
5. Add `http://localhost:5173` to **Authorized JavaScript origins** for local Vite development. If Vite uses a different port, use that exact origin instead.
6. Copy the client ID, which usually ends in `.apps.googleusercontent.com`. A frontend GIS popup implementation normally needs the authorized JavaScript origin; it does not need a client secret in the browser.

### Local run

1. Copy `.env.example` to `.env`.
2. Replace `VITE_GOOGLE_CLIENT_ID` with your own Google OAuth web client ID. Add your TMDB key if you want to use the existing movie search.
3. Keep `.env` out of Git. `.gitignore` already excludes `.env` and `.env.*`.
4. Install dependencies with `npm install` if needed.
5. Start the app with `npm run dev` and open the local URL printed by Vite.
6. For a production deployment, add the production origin in Google Cloud and use HTTPS.

## 5. Security and compliance considerations

### Important prototype limitation

This is a frontend-only course prototype. It decodes the ID-token payload to display a name and email after the Google Identity Services callback. Decoding a JWT is not cryptographic signature verification. A production application must send the credential to a trusted backend and verify the ID token (signature, issuer, audience/client ID, expiration, and other applicable claims) before establishing a secure server-side session. Client-side route protection improves navigation behavior but cannot protect server data or replace server-side authorization.

### Credit-card storage limitation

The assignment asks for localStorage persistence, so this prototype saves only explicitly confirmed **fictional test card data** to demonstrate the required behavior. Do not enter or store a real primary account number (PAN) or CVV. Browser storage is accessible to scripts running in the same origin and can be exposed by cross-site scripting (XSS). A real application should use a payment service provider’s hosted checkout/hosted fields and tokenization, minimize stored data, enforce HTTPS, restrict access, maintain retention/deletion rules, and have an incident-response process.

The CVV is accepted only as transient form input and is never stored in localStorage. PCI Security Standards Council guidance says card verification codes are sensitive authentication data and must not be stored after authorization, even encrypted. The demo does not process or authorize a transaction, and is not a PCI-compliant payment system.

### Card-number structure

A payment card number is commonly called the PAN (Primary Account Number). Its initial digits identify the issuer/card-number range (BIN/IIN); the remaining digits identify the account under the payment network’s numbering rules. The final digit is commonly a check digit calculated with the Luhn algorithm. Length and structure vary by network, so formatting into groups of four is only a display requirement, not proof that a card is valid or chargeable.

### Laws and standards

PCI DSS is an industry security standard, not by itself a general federal statute. Legal obligations vary by jurisdiction, business model, contractual relationships, and data handled. A real company should consult legal/compliance specialists to determine applicable privacy, breach-notification, consumer-protection, and payment-industry requirements.

### How real services commonly reduce risk

Payment providers often offer hosted checkout or hosted fields and return a token or payment-method identifier to the merchant. The merchant can then reference the token rather than store the complete PAN. This can reduce the merchant’s exposure and compliance scope, but does not automatically remove every PCI DSS responsibility. The provider integration, business environment, and applicable assessment determine the actual scope.

## 6. Test plan

| Test | Steps | Expected result |
|---|---|---|
| Logged-out root route | Clear app state or reload after signing out; open `/` | Redirects to `/login`; app navbar/content is not visible |
| Logged-out deep link | Open `/movies`, `/cart`, and `/checkout` while signed out | Each request redirects to `/login` |
| OAuth setup missing | Remove `VITE_GOOGLE_CLIENT_ID` and restart Vite | Login page explains that OAuth configuration is missing |
| Google sign-in | Configure the client ID and sign in with an allowed Google account | Profile appears in the navbar and the user enters the requested page/Home |
| Sign out | Click Sign out | User returns to login; protected pages are blocked again |
| Cart checkout | Sign in, open Cart, click Proceed to Checkout | Checkout page opens |
| Card formatting | Enter `4242424242424242` | Display becomes `4242 4242 4242 4242` |
| Invalid card number | Enter fewer than 16 digits and submit | Validation message; nothing is saved |
| Invalid expiry | Enter an invalid or past month/year | Validation message; nothing is saved |
| Mock-data confirmation | Leave confirmation unchecked and submit | Validation message; nothing is saved |
| Save mock card | Use fictional values, valid future expiry, CVV, and confirm mock data | Card is displayed in saved list; CVV is not stored |
| Persistence | Refresh `/checkout` after saving | Mock card record remains in this browser |
| Delete saved demo card | Click Remove demo card | Record disappears and is removed from localStorage |

## 7. Video presentation outline / speaker notes

**Opening (30–45 seconds):** “This is StreamList, our React application for EZTechMovie. The final update adds Google sign-in, protected routes, and a checkout demonstration.”

**Authentication (1–2 minutes):** Show the login page, explain that the Google client ID is configured through `.env`, sign in, show the main app, sign out, and attempt a protected URL to demonstrate redirection.

**Cart and checkout (1–2 minutes):** Open Cart, explain that the items are fictional, click Proceed to Checkout, enter mock card details, demonstrate the grouped card number and form validation, save the mock record, refresh to show localStorage persistence, and remove the record.

**Security explanation (1 minute):** Explain that no real transaction is processed, the CVV is not saved, browser storage is not appropriate for real payment data, and production authentication requires backend ID-token verification. Explain that real payment handling should use hosted checkout/tokenization.

**Conclusion (20–30 seconds):** Summarize the work completed and identify production improvements: backend session/token verification, payment-provider integration, secure server-side authorization, HTTPS, logging controls, and formal compliance review.

## 8. References

Google for Developers. (n.d.). *Display the Sign In With Google button*. https://developers.google.com/identity/gsi/web/guides/display-button

Google for Developers. (n.d.). *Create access credentials*. https://developers.google.com/workspace/guides/create-credentials

PCI Security Standards Council. (2025, June). *Are merchants allowed to request card-verification codes/values from cardholders?* https://www.pcisecuritystandards.org/faqs/1319/

Federal Trade Commission. (2016, October 14). *Protecting personal information: A guide for business*. https://www.ftc.gov/business-guidance/resources/protecting-personal-information-guide-business-0
