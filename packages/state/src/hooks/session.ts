
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes from login

export const useSessionTimeout = () => {

  const setupSessionTimeout = () => {
    try {
      const timeoutId = window.setTimeout(() => {
        sessionStorage.clear();
      }, SESSION_TIMEOUT);

      // Store timeout ID in case we need to clear it
      sessionStorage.setItem("sessionTimeoutId", timeoutId.toString());
    } catch (error) {
      console.error("Failed to setup session timeout:", error);
    }
  };

  return { setupSessionTimeout };
}; 