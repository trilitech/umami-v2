import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import Web3Auth, {
  ChainNamespace,
  LOGIN_PROVIDER,
  type LOGIN_PROVIDER_TYPE,
  WEB3AUTH_NETWORK,
} from "@web3auth/react-native-sdk";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

const WEB3_AUTH_CLIENT_ID =
  "BBQoFIabI50S1-0QsGHGTM4qID_FDjja0ZxIxKPyFqc0El--M-EG0c2giaBYVTVVE6RC9WCUzCJyW24aJrR_Lzc";

const STRINGS = {
  continueWith: "Continue with:",
  loginWith: "Login with Auth0",
  logout: "Logout",
  or: "or",
  createWallet: "Create a new wallet",
  alreadyHaveWallet: "I already have a wallet",
  byProceeding: "By proceeding, you agree to Umami's",
  terms: "Terms of Use",
  and: "and",
  privacyPolicy: "Privacy Policy",
};

const CHAIN_CONFIG = {
  chainNamespace: ChainNamespace.EIP155,
  chainId: "0x1",
  rpcTarget: "https://rpc.tzbeta.net/",
  displayName: "Tezos Mainnet",
  blockExplorerUrl: "https://tzstats.com",
  ticker: "XTZ",
  tickerName: "Tezos",
};

const createWeb3AuthInstance = () => {
  const privateKeyProvider = new CommonPrivateKeyProvider({
    config: { chainConfig: CHAIN_CONFIG },
  });

  return new Web3Auth(WebBrowser, SecureStore, {
    clientId: WEB3_AUTH_CLIENT_ID,
    network: WEB3AUTH_NETWORK.MAINNET,
    privateKeyProvider,
    // TODO: set the proper value for the redirectUrl
    redirectUrl: "umami://",
  });
};

export const useOnboardingData = () => {
  const web3auth = createWeb3AuthInstance();

  useEffect(() => {
    const initializeWeb3Auth = async () => {
      try {
        await web3auth.init();
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    void initializeWeb3Auth();
  }, [web3auth]);

  const login = useCallback(
    async (loginProvider: LOGIN_PROVIDER_TYPE) => {
      if (!web3auth.ready) {
        console.error("Web3Auth is not initialized.");
        return;
      }

      try {
        await web3auth.login({ loginProvider });

        if (web3auth.connected) {
          // TODO: trigger navigation
        }
      } catch (error: any) {
        console.error("Login error:", error.message);
      }
    },
    [web3auth]
  );

  const createLoginHandler = (provider: LOGIN_PROVIDER_TYPE) => () => login(provider);

  const onGoogleLogin = createLoginHandler(LOGIN_PROVIDER.GOOGLE);
  const onFacebookLogin = createLoginHandler(LOGIN_PROVIDER.FACEBOOK);
  const onXLogin = createLoginHandler(LOGIN_PROVIDER.TWITTER);
  const onRedditLogin = createLoginHandler(LOGIN_PROVIDER.REDDIT);
  const onAppleLogin = createLoginHandler(LOGIN_PROVIDER.APPLE);

  const openBrowser = useCallback(async (link: string) => {
    try {
      await WebBrowser.openBrowserAsync(link);
    } catch (error) {
      console.error("Error opening browser:", error);
    }
  }, []);

  const openTerms = useCallback(
    () => openBrowser("https://umamiwallet.com/tos.html"),
    [openBrowser]
  );
  const openPrivacy = useCallback(
    () => openBrowser("https://umamiwallet.com/privacypolicy.html"),
    [openBrowser]
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
