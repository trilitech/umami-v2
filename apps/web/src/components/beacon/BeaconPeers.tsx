import { type ExtendedPeerInfo } from "@airgap/beacon-wallet";
import { Center, Divider, Flex, Heading, IconButton, Image, Text, VStack } from "@chakra-ui/react";
import { useGetConnectionInfo, usePeers, useRemovePeer } from "@umami/state";
import { parsePkh } from "@umami/tezos";
import capitalize from "lodash/capitalize";

import { CodeSandboxIcon, StubIcon as TrashIcon } from "../../assets/icons";
import { AddressPill } from "../../components/AddressPill/AddressPill";
import { useColor } from "../../styles/useColor";
import { EmptyMessage } from "../EmptyMessage";

/**
 * Component displaying a list of connected dApps.
 *
 * Loads dApps data from {@link usePeers} hook & zips it with generated dAppIds.
 */
export const BeaconPeers = () => {
  const { peers } = usePeers();

  if (peers.length === 0) {
    return (
      <EmptyMessage
        alignItems="flex-start"
        marginTop="40px"
        data-testid="beacon-peers-empty"
        subtitle="No Apps to show"
        title="Your Apps will appear here..."
      />
    );
  }

  return (
    <VStack
      alignItems="flex-start"
      gap="24px"
      marginTop="24px"
      data-testid="beacon-peers"
      divider={<Divider />}
      spacing="0"
    >
      {peers.map(peerInfo => (
        <PeerRow key={peerInfo.senderId} peerInfo={peerInfo} />
      ))}
    </VStack>
  );
};

/**
 * Component for displaying info about single connected dApp.
 *
 * @param peerInfo - peerInfo provided by beacon Api + computed dAppId.
 * @param onRemove - action for deleting dApp connection.
 */
const PeerRow = ({ peerInfo }: { peerInfo: ExtendedPeerInfo }) => {
  const color = useColor();
  const removePeer = useRemovePeer();

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
            src={peerInfo.icon}
          />
        </Center>
        <Center alignItems="flex-start" flexDirection="column" gap="6px">
          <Heading color={color("900")} size="lg">
            {peerInfo.name}
          </Heading>
          <StoredPeerInfo peerInfo={peerInfo} />
        </Center>
      </Flex>
      <IconButton
        color={color("500")}
        aria-label="Remove Peer"
        icon={<TrashIcon />}
        onClick={() => removePeer(peerInfo)}
      />
    </Center>
  );
};

/**
 * Component for displaying additional info about connection with a dApp.
 *
 * Displays {@link AddressPill} with a connected account and network type,
 * if information about the connection is stored in {@link beaconSlice}.
 *
 * @param peerInfo - peerInfo provided by beacon Api + computed dAppId.
 */
const StoredPeerInfo = ({ peerInfo }: { peerInfo: ExtendedPeerInfo }) => {
  const connectionInfo = useGetConnectionInfo(peerInfo.senderId);

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
        {capitalize(connectionInfo.networkType)}
      </Text>
    </Flex>
  );
};
