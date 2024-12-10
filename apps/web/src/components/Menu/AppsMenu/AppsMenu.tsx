import { Button, Text } from "@chakra-ui/react";
import { useAddPeer, useBeaconPeers, useGetWcPeerListToggle, walletKit } from "@umami/state";
import { type SessionTypes } from "@walletconnect/types";
import { useEffect, useState } from "react";

import { BeaconPeers } from "../../beacon";
import { EmptyMessage } from "../../EmptyMessage";
import { WcPeers, useOnWalletConnect } from "../../WalletConnect";
import { DrawerContentWrapper } from "../DrawerContentWrapper";

export const AppsMenu = () => {
  const onBeaconConnect = useAddPeer();
  const onWalletConnect = useOnWalletConnect();
  const { peers } = useBeaconPeers();
  const [sessions, setSessions] = useState<Record<string, SessionTypes.Struct>>({});
  const isUpdated = useGetWcPeerListToggle();

  useEffect(() => {
    const sessions: Record<string, SessionTypes.Struct> = walletKit.getActiveSessions();
    setSessions(sessions);
  }, [isUpdated]);

  return (
    <DrawerContentWrapper
      actions={
        <>
          <Text marginTop="12px" size="lg">
            Connect with DApps using a Pairing Request via Beacon or WalletConnect.
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
          {peers.length === 0 && !Object.keys(sessions).length ? (
            <EmptyMessage
              alignItems="flex-start"
              marginTop="40px"
              data-testid="beacon-peers-empty"
              subtitle="No Apps to show"
              title="Your Apps will appear here..."
            />
          ) : null}
        </>
      }
      title="Apps"
    >
      <BeaconPeers />
      <WcPeers />
    </DrawerContentWrapper>
  );
};
