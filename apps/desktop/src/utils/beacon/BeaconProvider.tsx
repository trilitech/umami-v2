import { useToast } from "@chakra-ui/react";
import { WalletClient } from "@umami/state";
import { type PropsWithChildren, useEffect } from "react";

import { useHandleBeaconMessage } from "./useHandleBeaconMessage";

export const BeaconProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const toast = useToast();

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
