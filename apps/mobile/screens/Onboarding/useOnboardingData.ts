
import { type IDP } from "@umami/social-auth";
import { useAsyncActionHandler, useRestoreSocial } from "@umami/state";
import { getPublicKeyPairFromSk } from "@umami/tezos";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";

import { STRINGS } from "../../constants";
import { forIDP } from "../../services/forIDP";
import { openBrowser } from "../../utils/browserUtils";

export const useOnboardingData = () => {
  const router = useRouter();
  const { handleAsyncAction } = useAsyncActionHandler();
  const restoreSocial = useRestoreSocial();

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

  const login = (idp: IDP) =>
    handleAsyncAction(async () => {
        const { secretKey, name, id, email } = await forIDP(idp).getCredentials();
        const { pk, pkh } = await getPublicKeyPairFromSk(secretKey);
      restoreSocial(pk, pkh, email || name || id, idp);
      router.replace("/home");
    });

  const createLoginHandler = (provider: IDP) => () => login(provider);

  const onGoogleLogin = createLoginHandler("google");
  const onFacebookLogin = createLoginHandler("facebook");
  const onXLogin = createLoginHandler("twitter");
  const onRedditLogin = createLoginHandler("reddit");
  const onAppleLogin = createLoginHandler("apple");

  const openTerms = useCallback(() => openBrowser("https://umamiwallet.com/tos.html"), []);

  const openPrivacy = useCallback(
    () => openBrowser("https://umamiwallet.com/privacypolicy.html"),
    []
  );

  return {
    strings: STRINGS,
    openTerms,
    openPrivacy,
    onGoogleLogin,
    onFacebookLogin,
    onXLogin,
    onRedditLogin,
    onAppleLogin,
  };
};
