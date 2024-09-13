import { Button, Divider, Text } from "@chakra-ui/react";
import { onConnect, useAddPeer } from "@umami/state";

import { BeaconPeers } from "../../beacon";
import PairingsPage from "../../SendFlow/WalletConnect/pairings";
import { DrawerContentWrapper } from "../DrawerContentWrapper";

export const AppsMenu = () => {
  const addPeer = useAddPeer();

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
          navigator.clipboard.readText().then(
            // if payload starts with wc, call OnConnect else call addPeer
            payload => (payload.startsWith("wc:") ? onConnect(payload) : addPeer(payload))
          )
        }
        variant="secondary"
      >
        Connect
      </Button>
      <Divider marginTop={{ base: "36px", lg: "40px" }} />
      <BeaconPeers />
      <PairingsPage />
    </DrawerContentWrapper>
  );
};
