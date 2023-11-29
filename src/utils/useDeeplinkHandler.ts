import { useToast } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

import { useAddPeer } from "./beacon/beacon";
import { parseTorusRedirectParams } from "../GoogleAuth";

export const useDeeplinkHandler = () => {
  const toast = useToast();
  const addPeer = useAddPeer();

  const addPeerRef = useRef(addPeer);
  const toastRef = useRef(toast);

  const handleDeepLink = (_: any, _url: string) => {
    // on Windows we have /// instead of // like on other platforms
    const url = _url.replace(":///", "://");

    if (url.startsWith("umami://auth/")) {
      // Deeplink handler for GoogleAuth
      const params = parseTorusRedirectParams(url);
      // we simulate the default toruslabs/CustomAuth flow
      // that's how it works https://github.com/torusresearch/CustomAuth/blob/master/serviceworker/redirect.html
      // so the deeplink is just a bridge between Google's redirect and the CustomAuth code
      window.postMessage(params);
    } else if (url.startsWith("umami://?type=tzip10&data=")) {
      // Deeplink handler for beacon
      const params: URLSearchParams = new URL(url).searchParams;
      const payload = params.get("data");
      if (payload) {
        addPeerRef.current(payload);
      } else {
        toastRef.current({
          title: "Linkhandler",
          description: "Data Payload missing",
        });
      }
    } else {
      toastRef.current({
        title: "Linkhandler",
        description: "Unsupported link type",
      });
    }
  };

  useEffect(() => {
    const internalWindows = window as any;
    if (internalWindows && internalWindows.electronAPI) {
      internalWindows.electronAPI.onDeeplink(handleDeepLink);
    }

    return () => {
      // TODO cleanup deeplink listener
    };
  }, []);
};
