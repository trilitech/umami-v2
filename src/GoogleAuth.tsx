import { Button } from "@chakra-ui/react";
import { b58cencode, Prefix, prefix } from "@taquito/utils";
import { InMemorySigner } from "@taquito/signer";
import CustomAuth from "@toruslabs/customauth";
import { useSelectedNetwork } from "./utils/hooks/assetsHooks";
import { TORUS_NETWORK_TYPE } from "@toruslabs/fetch-node-details";
import { AccountType, SocialAccount } from "./types/Account";
import { useEffect, useState } from "react";

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

export const GoogleAuth: React.FC<{
  buttonText?: string;
  onReceiveSk?: (sk: string) => void;
  onReceiveAccount?: (account: SocialAccount) => void;
  width?: string;
  bg?: string;
}> = ({
  buttonText = "Connect with Google",
  onReceiveSk = (_) => {},
  onReceiveAccount = (_) => {},
  width,
  bg,
}) => {
  const [isLoading, setIsloading] = useState(false);
  useEffect(() => {
    const internalWindows = window as any;
    if (internalWindows && internalWindows.electronAPI) {
      internalWindows.electronAPI.onDeeplink((_: any, url: string) => {
        const params = parseParams(url);
        window.postMessage(params);
      });
    }
  });
  const network = useSelectedNetwork() as TORUS_NETWORK_TYPE;
  const torus = new CustomAuth({
    baseUrl: "https://umamiwallet.com/auth/",
    redirectPathName: "redirect.html",
    redirectToOpener: true,
    uxMode: "popup",
    network,
  });

  const authenticate = async () => {
    setIsloading(true);
    const tmp = {
      prompt: "consent",
      display: "popup",
    };
    await torus.init({ skipSw: true });
    torus
      .triggerAggregateLogin({
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
      })
      .then(async (res) => {
        const sk = b58cencode(res.privateKey, prefix[Prefix.SPSK]);
        const signer = new InMemorySigner(sk);
        onReceiveSk(sk);
        onReceiveAccount({
          type: AccountType.SOCIAL,
          pk: await signer.publicKey(),
          pkh: await signer.publicKeyHash(),
        } as SocialAccount);
        setIsloading(false);
      })
      .catch((error) => {
        console.error("Error", error);
        setIsloading(false);
      });
  };

  return (
    <Button isLoading={isLoading} onClick={authenticate} width={width} bg={bg}>
      {buttonText}
    </Button>
  );
};

export default GoogleAuth;
