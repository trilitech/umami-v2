import { TezosNetwork } from "@airgap/tezos";
import { Button, useToast } from "@chakra-ui/react";
import { b58cencode, Prefix, prefix } from "@taquito/utils";
import CustomAuth from "@toruslabs/customauth";
import { TORUS_NETWORK_TYPE } from "@toruslabs/fetch-node-details";
import { useEffect, useState } from "react";
import { useSelectedNetwork } from "./utils/hooks/assetsHooks";

export const parseParams = (url: string) => {
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
  buttonText?: string;
  onReceiveSk: (sk: string) => void;
  width?: string;
  bg?: string;
  isLoading?: boolean;
};

export const DEFAULT_BTN_TEXT = "Connect with Google";

const toTorusNetwork = (n: TezosNetwork): TORUS_NETWORK_TYPE => {
  if (n === TezosNetwork.MAINNET) {
    return "mainnet";
  }

  // Testnet not working
  if (n === TezosNetwork.GHOSTNET) {
    return "testnet";
  }

  const error: never = n;
  throw new Error(error);
};

export const GoogleAuth: React.FC<GoogleAuthProps> = ({
  buttonText = DEFAULT_BTN_TEXT,
  onReceiveSk,
  width,
  bg,
  isLoading = false,
}) => {
  const [SSOisLoading, SetSSOIsLoading] = useState(false);
  const toast = useToast();
  useEffect(() => {
    const internalWindows = window as any;
    if (internalWindows && internalWindows.electronAPI) {
      internalWindows.electronAPI.onDeeplink((_: any, url: string) => {
        const params = parseParams(url);
        window.postMessage(params);
      });
    }
  });
  const umamiNetwork = useSelectedNetwork();
  const torus = new CustomAuth({
    baseUrl: "https://umamiwallet.com/auth/",
    redirectPathName: "redirect.html",
    redirectToOpener: true,
    uxMode: "popup",
    network: toTorusNetwork(umamiNetwork),
  });

  const authenticate = async () => {
    SetSSOIsLoading(true);
    const tmp = {
      prompt: "consent",
      display: "popup",
    };
    await torus.init({ skipSw: true });

    try {
      const result = await torus.triggerAggregateLogin({
        verifierIdentifier: "tezos-google",
        aggregateVerifierType: "single_id_verifier",
        subVerifierDetailsArray: [
          {
            clientId:
              "1070572364808-d31nlkneam5ee6dr0tu28fjjbsdkfta5.apps.googleusercontent.com",
            typeOfLogin: "google",
            verifier: "umami",
            jwtParams: tmp,
          },
        ],
      });

      const sk = b58cencode(result.privateKey, prefix[Prefix.SPSK]);
      onReceiveSk(sk);
    } catch (error: any) {
      toast({ title: "Torus SSO failed", description: error.message });
    }
    SetSSOIsLoading(false);
  };

  return (
    <Button
      isLoading={isLoading || SSOisLoading}
      onClick={authenticate}
      width={width}
      bg={bg}
    >
      {buttonText}
    </Button>
  );
};
