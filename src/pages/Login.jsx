import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function Login() {
  const buttonRef = useRef(null);
  const [error, setError] = useState('');
  const {
    isAuthenticated,
    clientId,
    googleScriptReady,
    googleScriptError,
    loginWithCredential,
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const requestedPath = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (!clientId || !googleScriptReady || !buttonRef.current || !window.google?.accounts?.id) {
      return undefined;
    }

    const container = buttonRef.current;
    container.replaceChildren();
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        const credentialError = loginWithCredential(response.credential);
        if (credentialError) {
          setError(credentialError);
          return;
        }
        navigate(requestedPath, { replace: true });
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    window.google.accounts.id.renderButton(container, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      width: 280,
      logo_alignment: 'left',
    });

    return () => container.replaceChildren();
  }, [clientId, googleScriptReady, loginWithCredential, navigate, requestedPath]);

  if (isAuthenticated) return <Navigate to={requestedPath} replace />;

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-heading">
        <div className="login-brand-icon" aria-hidden="true">🎬</div>
        <p className="eyebrow">EZTechMovie · Secure access</p>
        <h1 id="login-heading">Welcome to StreamList</h1>
        <p className="login-description">
          Sign in with Google to manage your watchlist, explore movies, and access checkout.
        </p>

        {!clientId && (
          <div className="notice notice-error" role="alert">
            Google sign-in is not configured yet. Add your OAuth client ID to the local <code>.env</code> file as <code>VITE_GOOGLE_CLIENT_ID</code>, then restart Vite.
          </div>
        )}
        {googleScriptError && <div className="notice notice-error" role="alert">{googleScriptError}</div>}
        {error && <div className="notice notice-error" role="alert">{error}</div>}

        {clientId && !googleScriptReady && !googleScriptError && (
          <p className="muted-message" role="status">Loading Google sign-in…</p>
        )}
        <div className="google-button-wrap" ref={buttonRef} aria-label="Sign in with Google" />
        {clientId && googleScriptReady && (
          <p className="login-help">Use the Google account configured for your OAuth consent screen.</p>
        )}

        <div className="login-security-note">
          <span aria-hidden="true">🔒</span>
          <p>Only authenticated users can open the main application. This is a course prototype; production authentication requires server-side ID-token verification.</p>
        </div>
      </section>
    </main>
  );
}

export default Login;
