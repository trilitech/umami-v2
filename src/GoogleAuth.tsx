import { IconButton } from "@chakra-ui/react";
import { Prefix, b58cencode, prefix } from "@taquito/utils";
import CustomAuth from "@toruslabs/customauth";
import { FcGoogle } from "react-icons/fc";

import colors from "./style/colors";
import { useAsyncActionHandler } from "./utils/hooks/useAsyncActionHandler";
import { withTimeout } from "./utils/withTimeout";

// These parameters are built by
// https://github.com/torusresearch/CustomAuth/blob/master/serviceworker/redirect.html
export const parseTorusRedirectParams = (url: string) => {
  const correctUrl = url.replace("umami://auth/", "");
  const params = new URLSearchParams(correctUrl);
  const instanceParams = {
    insanceId: params.get("instanceId"),
    verifier: params.get("verifier"),
    typeOfLogin: params.get("typeOfLogin"),
    redirectToOpener: params.get("redirectToOpener"),
  };

  const hashParams = {
    state: params.get("state"),
    access_token: params.get("access_token"),
    token_type: params.get("token_type"),
    expires_in: params.get("expires_in"),
    scope: params.get("scope"),
    id_token: params.get("id_token"),
    authuser: params.get("authuser"),
    hd: params.get("hd"),
    prompt: params.get("prompt"),
  };

  const data = { instanceParams, hashParams };
  const result = {
    channel: params.get("channel"),
    data: data,
    error: params.get("error"),
  };

  return result;
};

export type GoogleAuthProps = {
  onSuccessfulAuth: (sk: string, email: string) => void;
  isDisabled?: boolean;
};

const LOGIN_TIMEOUT = 60 * 1000; // 1 minute

export const getGoogleCredentials = async () => {
  const torus = new CustomAuth({
    web3AuthClientId:
      "BBHmFdLXgGDzSiizRVMWtyL_7Dsoxu5B8zep2Pns8sGELslgXDbktJewVDVDDBlknEKkMCtzISLjJtxk60SK2-g",
    baseUrl: "https://umamiwallet.com/auth/v2/",
    redirectPathName: "redirect.html",
    redirectToOpener: true,
    uxMode: "popup",
    network: "mainnet",
  });
  await torus.init({ skipSw: true });

  const result = await torus.triggerAggregateLogin({
    verifierIdentifier: "tezos-google",
    aggregateVerifierType: "single_id_verifier",
    subVerifierDetailsArray: [
      {
        clientId: "1070572364808-d31nlkneam5ee6dr0tu28fjjbsdkfta5.apps.googleusercontent.com",
        typeOfLogin: "google",
        verifier: "umami",
      },
    ],
  });
  const privateKey = result.finalKeyData.privKey || result.oAuthKeyData.privKey;
  const secretKey = b58cencode(privateKey, prefix[Prefix.SPSK]);

  return {
    secretKey,
    email: result.userInfo[0].email,
  };
};

export const useGetGoogleCredentials = () => {
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();

  return {
    isLoading,
    getCredentials: async (onSuccessfulAuth: GoogleAuthProps["onSuccessfulAuth"]) =>
      handleAsyncAction(
        () =>
          withTimeout(async () => {
            const { secretKey, email } = await getGoogleCredentials();
            return onSuccessfulAuth(secretKey, email);
          }, LOGIN_TIMEOUT),
        {
          title: "Social login failed",
        }
      ),
  };
};

export const GoogleAuth: React.FC<GoogleAuthProps> = ({ onSuccessfulAuth, isDisabled }) => {
  const { isLoading, getCredentials } = useGetGoogleCredentials();
  // TODO: correct the BG colours when we have the design ready
  return (
    <IconButton
      width="48px"
      background="white"
      borderRadius="full"
      _disabled={{ bg: colors.gray[900] }}
      aria-label="Google SSO"
      icon={<FcGoogle size="24px" />}
      isDisabled={isDisabled}
      isLoading={isLoading}
      onClick={() => getCredentials(onSuccessfulAuth)}
      size="lg"
      variant="outline"
    />
  );
};
