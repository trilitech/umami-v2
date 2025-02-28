import { Box, Button, Flex } from "@chakra-ui/react";
import hj from "@hotjar/browser";
import { useAddPeer } from "@umami/state";

import { useOnWalletConnect } from "../../WalletConnect";
import { DrawerContentWrapper } from "../DrawerContentWrapper";
import { GenericConnections } from "./GenericConnections";
import { InfoMark } from "../../InfoMark";

export const AppsMenu = () => {
  const onBeaconConnect = useAddPeer();
  const onWalletConnect = useOnWalletConnect();

  hj.stateChange("menu/apps");

  return (
    <DrawerContentWrapper
      actions={
        <>
          <Flex>
            <Flex alignItems="center" flexWrap="wrap" marginTop="12px">
              <Box as="span" fontSize="lg">
                Connect with Apps using a Pairing request via Beacon or WalletConnect.{" "}
                <InfoMark label="To get the connect link, open the dApp and click on the QR code to copy the connect URL. Then, return to the Umami Wallet and click the 'Connect' button." />
              </Box>
            </Flex>
          </Flex>
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
      <GenericConnections />
    </DrawerContentWrapper>
  );
};
