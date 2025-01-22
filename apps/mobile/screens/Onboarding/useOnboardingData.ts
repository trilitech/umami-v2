import { b58cencode, prefix } from "@taquito/utils";
// @ts-ignore
import { useRestoreSocial } from "@umami/state";
import { MAINNET, getPublicKeyPairFromSk, makeToolkit } from "@umami/tezos";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";

import { STRINGS } from "../../constants";
import { createWeb3AuthInstance } from "../../services/web3AuthFactory";
import { openBrowser } from "../../utils/browserUtils";
import { saveToken } from "../../utils/tokenManager";

type Web3AuthLoginResponse = {
  aggregateVerifier: string;
  appState: string;
  dappShare: string;
  email?: string;
  idToken?: string;
  isMfaEnabled: boolean;
  name?: string;
  oAuthAccessToken?: string;
  oAuthIdToken?: string;
  profileImage?: string;
  typeOfLogin: string;
  verifier: string;
  verifierId: string;
};

export const useOnboardingData = () => {
  const router = useRouter();
  const web3auth = createWeb3AuthInstance();
  const restoreSocial = useRestoreSocial();

  useEffect(() => {
    const handleUrl = (event: any) => {
      const { url } = event;
      console.log("Deep link received:", url);
    };

    const subscription = Linking.addEventListener("url", handleUrl);

    const initializeWeb3Auth = async () => {
      try {
        await web3auth.init();
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    void initializeWeb3Auth();

    return () => {
      subscription.remove();
    };
  }, [web3auth]);

  const login = useCallback(
    async (loginProvider: string) => {
      if (!web3auth.ready) {
        console.error("Web3Auth is not initialized.");
        return;
      }

      try {
        const web3authResponse = (await web3auth.login({
          loginProvider,
        })) as unknown as Web3AuthLoginResponse;

        if (web3auth.connected) {
          const userInfo = web3auth.userInfo();
          console.log("userInfo", userInfo);
          const web3authProvider = web3auth.provider;
          const privateKey = (await web3authProvider?.request({ method: "private_key" })) as string;
          const secretKey = b58cencode(privateKey, prefix.spsk);
          const tezos = await makeToolkit({ type: "social", secretKey, network: MAINNET });

          console.log("private key", privateKey);

          // const keyPair = tezosCrypto.utils.seedToKeyPair(hex2buf(privateKey));
          // const account = keyPair?.pkh;
          const { pk, pkh } = await getPublicKeyPairFromSk(secretKey);

          restoreSocial(pk, pkh, userInfo?.email || userInfo?.name || "Social account", "google");
          console.log("account", pkh);

          const balance = await tezos.tz.getBalance(pkh);
          console.log("balance", balance);

          if (web3authResponse.idToken) {
            await saveToken("authToken", web3authResponse.idToken);
          }

          router.replace("/home");
        }
      } catch (error: any) {
        console.error("Login error:", error.message);
      }
    },
    [web3auth, router]
  );

  const createLoginHandler = (provider: string) => () => login(provider);

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
