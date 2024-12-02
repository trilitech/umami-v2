import { Button, Text } from "@chakra-ui/react";
import { useAddPeer } from "@umami/state";

import { BeaconPeers } from "../../beacon";
import { useOnWalletConnect } from "../../WalletConnect";
import { DrawerContentWrapper } from "../DrawerContentWrapper";

export const AppsMenu = () => {
  const onBeaconConnect = useAddPeer();
  const onWalletConnect = useOnWalletConnect();

  return (
    <DrawerContentWrapper
      actions={
        <>
          <Text marginTop="12px" size="lg">
            Connect with Pairing Request for Beacon or WalletConnect
          </Text>
          <Button
            width="fit-content"
            marginTop="18px"
            padding="0 24px"
            onClick={() =>
              navigator.clipboard
                .readText()
                .then(payload =>
                  payload.startsWith("wc:") ? onWalletConnect(payload) : onBeaconConnect(payload)
                )
            }
            variant="primary"
          >
            Connect
          </Button>
        </>
      }
      title="Apps"
    >
      <BeaconPeers />
    </DrawerContentWrapper>
  );
};
