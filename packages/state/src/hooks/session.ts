import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import { setHasSession } from "../slices/session";

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes from login

export const useHandleSession = () => {
  const isOnboarded = () => !!localStorage.getItem("user_requirements_nonce");
  const isSessionActive = useAppSelector(state => state.session.hasSession);
  const dispatch = useAppDispatch();

  const setupSessionTimeout = () => {
    try {
      const timeoutId = setTimeout(() => {
        sessionStorage.clear();
        dispatch(setHasSession(false));
      }, SESSION_TIMEOUT);

      // Store timeout ID in case we need to clear it
      sessionStorage.setItem("sessionTimeoutId", timeoutId.toString());
    } catch (error) {
      console.error("Failed to setup session timeout:", error);
    }
  };

  return { setupSessionTimeout, isSessionActive, isOnboarded };
};
