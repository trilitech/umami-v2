const SESSION_KEY_NAME = "umami_session_id";

export const getOrCreateSessionKey = (): string => {
  // Try to get from sessionStorage first (for current tab)
  let sessionKey = sessionStorage.getItem(SESSION_KEY_NAME);

  if (!sessionKey) {
    // Try to get from localStorage (persisted across tabs)
    sessionKey = localStorage.getItem(SESSION_KEY_NAME);

    if (!sessionKey) {
      // Create new key if it doesn't exist anywhere
      const randomBytes = crypto.getRandomValues(new Uint8Array(32));
      sessionKey = Array.from(randomBytes)
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
      localStorage.setItem(SESSION_KEY_NAME, sessionKey);
    }

    // Always store in sessionStorage for faster access
    sessionStorage.setItem(SESSION_KEY_NAME, sessionKey);
  }

  return sessionKey;
};
