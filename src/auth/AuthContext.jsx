import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const GOOGLE_SCRIPT_ID = 'google-identity-services';

function readProfileFromCredential(credential) {
  // The Google Identity Services callback supplies an ID token. This prototype
  // decodes profile claims for display only; decoding is NOT signature validation.
  const payload = credential?.split('.')?.[1];
  if (!payload) throw new Error('Google did not return a valid credential.');

  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  const claims = JSON.parse(window.atob(padded));

  if (!claims.sub || !claims.email) {
    throw new Error('Google did not return the required profile information.');
  }

  return {
    id: claims.sub,
    name: claims.name || claims.email,
    email: claims.email,
    picture: claims.picture || '',
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [googleScriptReady, setGoogleScriptReady] = useState(
    Boolean(window.google?.accounts?.id)
  );
  const [googleScriptError, setGoogleScriptError] = useState('');
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    if (window.google?.accounts?.id) {
      setGoogleScriptReady(true);
      return undefined;
    }

    let script = document.getElementById(GOOGLE_SCRIPT_ID);
    const onLoad = () => setGoogleScriptReady(Boolean(window.google?.accounts?.id));
    const onError = () => setGoogleScriptError('Google sign-in could not load. Check your internet connection and try again.');

    if (!script) {
      script = document.createElement('script');
      script.id = GOOGLE_SCRIPT_ID;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.addEventListener('load', onLoad, { once: true });
      script.addEventListener('error', onError, { once: true });
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', onLoad, { once: true });
      script.addEventListener('error', onError, { once: true });
    }

    return () => {
      script?.removeEventListener('load', onLoad);
      script?.removeEventListener('error', onError);
    };
  }, []);

  const loginWithCredential = useCallback((credential) => {
    try {
      setUser(readProfileFromCredential(credential));
      return '';
    } catch (error) {
      setUser(null);
      return error.message || 'Unable to read the Google profile.';
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    window.google?.accounts?.id?.disableAutoSelect?.();
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    clientId,
    googleScriptReady,
    googleScriptError,
    loginWithCredential,
    logout,
  }), [user, clientId, googleScriptReady, googleScriptError, loginWithCredential, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
