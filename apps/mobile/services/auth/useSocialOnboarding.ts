import AsyncStorage from "@react-native-async-storage/async-storage";
import { type IDP } from "@umami/social-auth";
import { accountsSlice, useAsyncActionHandler, useRestoreSocial } from "@umami/state";
import { getPublicKeyPairFromSk } from "@umami/tezos";
import { useRouter } from "expo-router";

import { forIDP } from "./forIDP";
import store, { persistor } from "../../store/store";

export const useSocialOnboarding = () => {
  const router = useRouter();
  const restoreSocial = useRestoreSocial();
  const { handleAsyncAction } = useAsyncActionHandler();

  const login = (idp: IDP) =>
    handleAsyncAction(async () => {
      const { secretKey, name, id, email } = await forIDP(idp).getCredentials();
      console.log("secretKey", secretKey, email);
      const { pk, pkh } = await getPublicKeyPairFromSk(secretKey);
      console.log("pkh", pkh);
      try {
        restoreSocial(pk, pkh, email || name || id, idp);
        console.log("social login restored");
      } catch (error) {
        console.error("Error restoring social login", error);
      }
    });

  const logout = (idp: IDP) =>
    handleAsyncAction(async () => {
      await forIDP(idp).logout();
      persistor.pause();
      await AsyncStorage.clear();
      router.replace("/");
      console.log(await AsyncStorage.getAllKeys(), store.getState());
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
