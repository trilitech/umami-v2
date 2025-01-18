import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import Web3Auth, {
  ChainNamespace,
  LOGIN_PROVIDER,
  type LOGIN_PROVIDER_TYPE,
  WEB3AUTH_NETWORK,
} from "@web3auth/react-native-sdk";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router"; // For navigation
import { useCallback, useEffect } from "react";

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


WebBrowser.maybeCompleteAuthSession();

const WEB3_AUTH_CLIENT_ID = process.env.EXPO_PUBLIC_WEB3_AUTH_CLIENT_ID;

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

const saveToken = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

const getToken = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

const createWeb3AuthInstance = () => {
  const privateKeyProvider = new CommonPrivateKeyProvider({
    config: { chainConfig: CHAIN_CONFIG },
  });

  const redirectUrl = makeRedirectUri({
    scheme: "umami",
    path: "auth",
  });

  console.log("redirectUrl", redirectUrl);

  return new Web3Auth(WebBrowser, SecureStore, {
    clientId: WEB3_AUTH_CLIENT_ID ?? "",
    network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider,
    redirectUrl,
  });
};

export const useOnboardingData = () => {
  const router = useRouter(); // Expo Router navigation hook
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
    async (loginProvider: LOGIN_PROVIDER_TYPE) => {
      if (!web3auth.ready) {
        console.error("Web3Auth is not initialized.");
        return;
      }

      try {
        const web3authResponse = await web3auth.login({ loginProvider }) as unknown as Web3AuthLoginResponse;

        if (web3auth.connected) {
          const userInfo = await web3auth.userInfo();

          if (web3authResponse?.idToken) {
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
