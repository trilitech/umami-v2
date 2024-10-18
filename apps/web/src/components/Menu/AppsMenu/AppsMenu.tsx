import { Button, Divider, Text } from "@chakra-ui/react";
import { useAddPeer } from "@umami/state";

import { BeaconPeers } from "../../beacon";
import { WcPeers, useOnWalletConnect } from "../../WalletConnect";
import { DrawerContentWrapper } from "../DrawerContentWrapper";

export const AppsMenu = () => {
  const addPeer = useAddPeer();
  const onWalletConnect = useOnWalletConnect();

  return (
    <DrawerContentWrapper title="Apps">
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
              payload.startsWith("wc:") ? onWalletConnect(payload) : addPeer(payload)
            )
        }
        variant="secondary"
      >
        Connect
      </Button>
      <Divider marginTop={{ base: "36px", md: "40px" }} />
      <BeaconPeers />
      <WcPeers />
    </DrawerContentWrapper>
  );
};
