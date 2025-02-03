import { type IDP } from "@umami/social-auth";
import { useAsyncActionHandler, useResetState, useRestoreSocial } from "@umami/state";
import { getPublicKeyPairFromSk } from "@umami/tezos";
import { useRouter } from "expo-router";

import { forIDP } from "./forIDP";
import { persistor } from "../../store";

export const useSocialOnboarding = () => {
  const router = useRouter();
  const restoreSocial = useRestoreSocial();
  const { handleAsyncAction } = useAsyncActionHandler();
  const resetState = useResetState();

  const login = (idp: IDP) =>
    handleAsyncAction(async () => {
      const { secretKey, name, id, email } = await forIDP(idp).getCredentials();
      const { pk, pkh } = await getPublicKeyPairFromSk(secretKey);
      try {
        restoreSocial(pk, pkh, email || name || id, idp);
      } catch (error) {
        console.error("Error restoring social login", error);
      }
    });

  const logout = (idp: IDP) =>
    handleAsyncAction(async () => {
      await forIDP(idp).logout();
      resetState();
      await persistor.purge();
      router.replace("/login");
    });

  const createLoginHandler = (provider: IDP) => () => login(provider);

  const onGoogleLogin = createLoginHandler("google");
  const onFacebookLogin = createLoginHandler("facebook");
  const onXLogin = createLoginHandler("twitter");
  const onRedditLogin = createLoginHandler("reddit");
  const onAppleLogin = createLoginHandler("apple");

  return {
    onGoogleLogin,
    onFacebookLogin,
    onXLogin,
    onRedditLogin,
    onAppleLogin,
    logout,
  };
};
