import { Center, Divider, Flex, IconButton, Image, Text, VStack } from "@chakra-ui/react";
import { useDisconnectWalletConnectPeer, useGetWcPeerListToggle, walletKit } from "@umami/state";
import { parsePkh } from "@umami/tezos";
import { type SessionTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";
import capitalize from "lodash/capitalize";
import { useEffect, useState } from "react";

import { CodeSandboxIcon, StubIcon as TrashIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { AddressPill } from "../AddressPill";

/**
 * Component displaying a list of connected dApps.
 *
 * Loads dApps data from WalletConnect API and displays it in a list.
 */
export const WcPeers = () => {
  const [sessions, setSessions] = useState<Record<string, SessionTypes.Struct>>({});
  const isUpdated = useGetWcPeerListToggle();

  useEffect(() => {
    const sessions: Record<string, SessionTypes.Struct> = walletKit.getActiveSessions();
    setSessions(sessions);
  }, [isUpdated]);

  if (!Object.keys(sessions).length) {
    return <></>;
  }

  return (
    <VStack
      alignItems="flex-start"
      gap="24px"
      marginTop="24px"
      data-testid="wc-peers"
      divider={<Divider />}
      spacing="0"
    >
      {
        // loop peers and print PeerRow
        Object.entries(sessions).map(([topic, sessionInfo]) => (
          <PeerRow key={topic} sessionInfo={sessionInfo} />
        ))
      }
    </VStack>
  );
};

/**
 * Component for displaying info about single connected dApp.
 *
 * @param sessionInfo - sessionInfo provided by wc Api + computed dAppId.
 * @param onRemove - action for deleting dApp connection.
 */
const PeerRow = ({ sessionInfo }: { sessionInfo: SessionTypes.Struct }) => {
  const color = useColor();
  const disconnectWalletConnectPeer = useDisconnectWalletConnectPeer();

  return (
    <Center
      alignItems="center"
      justifyContent="space-between"
      width="full"
      height="60px"
      data-testid="peer-row"
    >
      <Flex height="100%">
        <Center width="60px" marginRight="12px">
          <Image
            objectFit="cover"
            fallback={<CodeSandboxIcon width="36px" height="36px" />}
            src={sessionInfo.peer.metadata.icons[0]}
          />
        </Center>
        <Center alignItems="flex-start" flexDirection="column" gap="6px">
          <Text color={color("900")} size="lg">
            {sessionInfo.peer.metadata.name}
          </Text>
          <StoredSessionInfo sessionInfo={sessionInfo} />
        </Center>
      </Flex>
      <IconButton
        color={color("500")}
        aria-label="Remove Peer"
        icon={<TrashIcon />}
        onClick={() =>
          disconnectWalletConnectPeer({
            topic: sessionInfo.topic,
            reason: getSdkError("USER_DISCONNECTED"),
          })
        }
        variant="iconButtonSolid"
      />
    </Center>
  );
};

/**
 * Component for displaying additional info about connection with a dApp.
 *
 * Displays {@link AddressPill} with a connected account and network type.
 *
 * @param sessionInfo - sessionInfo provided by WalletConnect Api.
 * Account is stored in format: tezos:ghostnet:tz1...
 * Network is stored in format: tezos:mainnet
 */
const StoredSessionInfo = ({ sessionInfo }: { sessionInfo: SessionTypes.Struct }) => (
  <Flex>
    <AddressPill
      marginRight="10px"
      address={parsePkh(sessionInfo.namespaces.tezos.accounts[0].split(":")[2])}
    />
    <Divider marginRight="10px" orientation="vertical" />
    <Text marginTop="2px" marginRight="4px" fontWeight={600} size="sm">
      Network:
    </Text>
    <Text marginTop="2px" data-testid="dapp-connection-network" size="sm">
      {capitalize(sessionInfo.namespaces.tezos.chains?.[0].split(":")[1] ?? "")}
    </Text>
  </Flex>
);
