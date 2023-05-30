import { useToast } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useAddPeer } from "./beacon/beacon";
import { parseParams } from "../GoogleAuth";

export const useDeeplinkHandler = () => {
  const toast = useToast();
  const addPeer = useAddPeer();

  const addPeerRef = useRef(addPeer);
  const toastRef = useRef(toast);

  const handleDeepLink = (_: any, url: string) => {
    // Print for debugging
    console.log("onDeeplink", url);
    if (url.startsWith("umami://auth/")) {
      // Deeplink handler for Kukai
      const params = parseParams(url);
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
      // TODO cleanup deeplink listner
    };
  }, []);
};
