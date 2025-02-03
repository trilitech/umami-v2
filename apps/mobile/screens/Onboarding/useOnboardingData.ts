import * as Linking from "expo-linking";
import { useCallback, useEffect } from "react";

import { STRINGS } from "../../constants";
import { useSocialOnboarding } from "../../services/auth";
import { openBrowser } from "../../utils/browserUtils";

export const useOnboardingData = () => {
  const socialLoginHandlers = useSocialOnboarding();

  useEffect(() => {
    const handleUrl = (event: any) => {
      const { url } = event;
      console.log("Deep link received:", url);
    };

    const subscription = Linking.addEventListener("url", handleUrl);

    return () => {
      subscription.remove();
    };
  }, []);
  const openTerms = useCallback(() => openBrowser("https://umamiwallet.com/tos.html"), []);

  const openPrivacy = useCallback(
    () => openBrowser("https://umamiwallet.com/privacypolicy.html"),
    []
  );

  return {
    strings: STRINGS,
    openTerms,
    openPrivacy,
    ...socialLoginHandlers,
  };
};
