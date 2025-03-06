import { WalletClient } from "@umami/state";
import { useCustomToast } from "@umami/utils";
import { type PropsWithChildren, useEffect } from "react";

import { useHandleBeaconMessage } from "./useHandleBeaconMessage";

export const BeaconProvider = ({ children }: PropsWithChildren) => {
  const toast = useCustomToast();

  const handleBeaconMessage = useHandleBeaconMessage();

  useEffect(() => {
    WalletClient.init()
      .then(() => WalletClient.connect(handleBeaconMessage))
      .catch((error: any) => {
        toast({
          status: error,
          description: `Failed to connect to Beacon: ${error.message}`,
        });
      });
  });

  return children;
};
