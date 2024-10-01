import { Center, Divider, Flex, Heading, IconButton, Image, Text, VStack } from "@chakra-ui/react";
import { useGetWcConnectionInfo, useRemoveWcPeer, useWcPeers } from "@umami/state";
import { parsePkh } from "@umami/tezos";
import { type SessionTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";
import capitalize from "lodash/capitalize";

import { CodeSandboxIcon, StubIcon as TrashIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { AddressPill } from "../AddressPill/AddressPill";
import { EmptyMessage } from "../EmptyMessage";

/**
 * Component displaying a list of connected dApps.
 *
 * Loads dApps data from {@link useWcPeers} hook & zips it with generated dAppIds.
 */
export const WcPeers = () => {
  // const wcPeers: Record<string, SessionTypes.Struct> = walletKit.getActiveSessions();
  const { peers: wcPeers } = useWcPeers();

  console.log("wcPeers", wcPeers);

  if (Object.keys(wcPeers).length === 0) {
    return (
      <EmptyMessage
        alignItems="flex-start"
        marginTop="40px"
        data-testid="wc-peers-empty"
        subtitle="No WalltConnect Apps to show"
        title="Your WalletConnect Apps will appear here..."
      />
    );
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
        Object.entries(wcPeers).map(([topic, peerInfo]) => (
          <PeerRow key={topic} peerInfo={peerInfo} />
        ))
      }
    </VStack>
  );
};

/**
 * Component for displaying info about single connected dApp.
 *
 * @param peerInfo - peerInfo provided by wc Api + computed dAppId.
 * @param onRemove - action for deleting dApp connection.
 */
const PeerRow = ({ peerInfo }: { peerInfo: SessionTypes.Struct }) => {
  const color = useColor();
  const removeWcPeer = useRemoveWcPeer();

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
            src={peerInfo.peer.metadata.icons[0]}
          />
        </Center>
        <Center alignItems="flex-start" flexDirection="column" gap="6px">
          <Heading color={color("900")} size="lg">
            {peerInfo.peer.metadata.name}
          </Heading>
          <StoredPeerInfo peerInfo={peerInfo} />
        </Center>
      </Flex>
      <IconButton
        color={color("500")}
        aria-label="Remove Peer"
        icon={<TrashIcon />}
        onClick={() =>
          removeWcPeer({ topic: peerInfo.topic, reason: getSdkError("USER_DISCONNECTED") })
        }
        variant="iconButtonSolid"
      />
    </Center>
  );
};

/**
 * Component for displaying additional info about connection with a dApp.
 *
 * Displays {@link AddressPill} with a connected account and network type,
 * if information about the connection is stored in {@link wcSlice}.
 *
 * @param peerInfo - peerInfo provided by wc Api + computed dAppId.
 */
const StoredPeerInfo = ({ peerInfo }: { peerInfo: SessionTypes.Struct }) => {
  const connectionInfo = useGetWcConnectionInfo(peerInfo.topic);

  if (!connectionInfo) {
    return null;
  }

  return (
    <Flex>
      <AddressPill marginRight="10px" address={parsePkh(connectionInfo.accountPkh)} />
      <Divider marginRight="10px" orientation="vertical" />
      <Text marginTop="2px" marginRight="4px" fontWeight={600} size="sm">
        Network:
      </Text>
      <Text marginTop="2px" data-testid="dapp-connection-network" size="sm">
        {capitalize(connectionInfo.networkName)}
      </Text>
    </Flex>
  );
};
