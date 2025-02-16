import { useEffect, useRef, useState } from "react";

const MNEMONIC_VISIBILITY_TIMEOUT = 30000;

export const useToggleMnemonic = (timeout = MNEMONIC_VISIBILITY_TIMEOUT) => {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const resetIsVisible = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(resetIsVisible, timeout);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isVisible, timeout]);

  return { isVisible, toggleMnemonic: () => setIsVisible(prev => !prev) };
};
