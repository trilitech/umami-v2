import { useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export const useOnboardingData = () => {
  const strings = {
    continueWith: 'Continue with:',
    loginWith: 'Login with Auth0',
    logout: 'Logout',
    or: 'or',
    createWallet: 'Create a new wallet',
    alreadyHaveWallet: 'I already have a wallet',
    byProceeding: "By proceeding, you agree to Umami's",
    terms: 'Terms of Use',
    and: 'and',
    privacyPolicy: 'Privacy Policy',
  }

  const [userInfo, setUserInfo] = useState<{params?: {code: string}, name?: string;} | null>(null);
  const [accessToken, setAccessToken] = useState<string>();

  const discovery = {
    authorizationEndpoint: "https://dev-42dxj5lb7kap5fte.uk.auth0.com/authorize",
    tokenEndpoint: "https://dev-42dxj5lb7kap5fte.uk.auth0.com/oauth/token",
    revocationEndpoint: "https://dev-42dxj5lb7kap5fte.uk.auth0.com/oauth/revoke",
  };
  const redirectUri = AuthSession.makeRedirectUri({ preferLocalhost: true
  });
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: "CQmr09K34i2z756hLjrVXAqTVBj9TNhH",
      scopes: ["openid", "profile", "email"],
      redirectUri,
    },
    discovery
  );

  useEffect(() => {
    if(userInfo?.params?.code){
      void fetchToken(userInfo?.params.code, request?.codeVerifier ?? '')
    }
  }, []);

  const fetchToken = async (code: string, codeVerifier: string) => {
    const tokenResponse = await fetch("https://dev-42dxj5lb7kap5fte.uk.auth0.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: "CQmr09K34i2z756hLjrVXAqTVBj9TNhH",
        redirect_uri: redirectUri,
        code,
        code_verifier: codeVerifier,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("Token exchange failed:", tokenData);
      return;
    }

    console.log("Access Token:", tokenData.access_token);
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;

      // Exchange the authorization code for an access token
      fetch("https://dev-42dxj5lb7kap5fte.uk.auth0.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: "CQmr09K34i2z756hLjrVXAqTVBj9TNhH",
          redirect_uri: redirectUri,
          code,
          code_verifier: request?.codeVerifier,
          grant_type: "authorization_code",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const accessToken = data.access_token;
          setAccessToken(accessToken);

          fetch("https://dev-42dxj5lb7kap5fte.uk.auth0.com/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
            .then((response) => response.json())
            .then((user) => setUserInfo(user));
        });
    }
  }, [response]);

  const logout = async () => {
    try {
      const logoutUrl = `https://dev-42dxj5lb7kap5fte.uk.auth0.com/v2/logout?client_id=CQmr09K34i2z756hLjrVXAqTVBj9TNhH&returnTo=${encodeURIComponent(
        redirectUri
      )}`;

      const result = await WebBrowser.openAuthSessionAsync(logoutUrl);

      if (result.type === "dismiss" || result.type === "success") {
        console.log("Logout successful");
        setUserInfo(null); // Clear local user state
      } else {
        console.error("Logout failed:", result);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const openBrowser = async (link: string) => {
    const result = await WebBrowser.openBrowserAsync(link);
    console.log(result);
  };

  const openTerms = () => openBrowser('https://umamiwallet.com/tos.html');

  const openPrivacy = () => openBrowser('https://umamiwallet.com/privacypolicy.html')

  return {
    accessToken,
    strings,
    userInfo,
    openTerms,
    openPrivacy,
    logout,
    promptAsync
  }
}
