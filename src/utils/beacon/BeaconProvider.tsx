import { useToast } from "@chakra-ui/react";
import { PropsWithChildren, useEffect } from "react";

import { useHandleBeaconMessage } from "./useHandleBeaconMessage";
import { WalletClient } from "./WalletClient";

export const BeaconProvider: React.FC<PropsWithChildren<object>> = ({ children }) => {
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
