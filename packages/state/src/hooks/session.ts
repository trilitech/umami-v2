import { useAppSelector } from "./useAppSelector";

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes from login

export const useHandleSession = () => {
  const isOnboarded = () => !!localStorage.getItem("user_requirements_nonce");
  const isSessionActive = useAppSelector(state => !!state.accounts.current);

  const setupSessionTimeout = () => {
    try {
      const timeoutId = setTimeout(() => {
        sessionStorage.clear();
      }, SESSION_TIMEOUT);

      // Store timeout ID in case we need to clear it
      sessionStorage.setItem("sessionTimeoutId", timeoutId.toString());
    } catch (error) {
      console.error("Failed to setup session timeout:", error);
    }
  };

  return { setupSessionTimeout, isSessionActive, isOnboarded };
};

export const clearSessionKey = () => {
  localStorage.removeItem("user_requirements_nonce");
  window.location.reload();
};
