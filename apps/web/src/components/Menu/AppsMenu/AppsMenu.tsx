import { Button, Text } from "@chakra-ui/react";
import { useAddPeer } from "@umami/state";

import { BeaconPeers } from "../../beacon";
import { DrawerContentWrapper } from "../DrawerContentWrapper";

export const AppsMenu = () => {
  const addPeer = useAddPeer();

  return (
    <DrawerContentWrapper
      actions={
        <>
          <Text marginTop="12px" size="lg">
            Connect with Pairing Request
          </Text>
          <Button
            width="fit-content"
            marginTop="18px"
            padding="0 24px"
            onClick={() => navigator.clipboard.readText().then(addPeer)}
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
