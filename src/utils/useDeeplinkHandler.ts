import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAddPeer } from "./beacon/beacon";
import { parseParams } from "../GoogleAuth";

export const useDeeplinkHandler = () => {
  const toast = useToast();
  const addPeer = useAddPeer();
  useEffect(() => {
    const internalWindows = window as any;
    if (internalWindows && internalWindows.electronAPI) {
      internalWindows.electronAPI.onDeeplink((_: any, url: string) => {
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
            addPeer(payload);
          } else {
            toast({
              title: "Linkhandler",
              description: "Data Payload missing",
            });
          }
        } else {
          toast({ title: "Linkhandler", description: "Unsupported link type" });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only a single time on mount
};
