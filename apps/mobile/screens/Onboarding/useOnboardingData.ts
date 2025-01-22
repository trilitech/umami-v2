import { TezosToolkit } from "@taquito/taquito";
import { hex2buf } from "@taquito/utils";
// @ts-ignore
import * as tezosCrypto from "@tezos-core-tools/crypto-utils";
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
        const web3authResponse = await web3auth.login({ loginProvider }) as unknown as Web3AuthLoginResponse;

        if (web3auth.connected) {
          const userInfo = web3auth.userInfo();
          console.log("userInfo", userInfo);
          const tezos = new TezosToolkit("https://ithacanet.ecadinfra.com");

          const web3authProvider = web3auth.provider;
          const privateKey = await web3authProvider?.request({ method: "private_key" }) as string;
          console.log('private key', privateKey);

          const keyPair = tezosCrypto.utils.seedToKeyPair(hex2buf(privateKey));
          const account = keyPair?.pkh;
          console.log('account', account);

          const balance = await tezos.tz.getBalance(account);
          console.log('balance', balance);

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

  const openTerms = useCallback(
    () => openBrowser("https://umamiwallet.com/tos.html"),
    []
  );

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
