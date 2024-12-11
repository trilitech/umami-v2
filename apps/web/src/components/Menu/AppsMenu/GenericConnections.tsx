import { type ExtendedPeerInfo, type NetworkType } from "@airgap/beacon-wallet";
import { Center, Divider, Flex, Heading, IconButton, Image, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import {
  useBeaconPeers,
  useDisconnectWalletConnectPeer,
  useGetBeaconConnectionInfo,
  useGetWcPeerListToggle,
  useRemoveBeaconPeer,
  walletKit,
} from "@umami/state";
import { type RawPkh, parsePkh } from "@umami/tezos";
import { type SessionTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";
import capitalize from "lodash/capitalize";
import { useMemo } from "react";

import { CodeSandboxIcon, TrashIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { AddressPill } from "../../AddressPill";
import { EmptyMessage } from "../../EmptyMessage";

type ExtendedPeerSession = {
  id: string;
  name: string;
  icon: string;
  type: string;
  sessionInfo: SessionTypes.Struct;
  accountPkh: RawPkh;
  networkType: NetworkType;
} & ExtendedPeerInfo;

export const GenericConnections = () => {
  // TODO: remove this once we have a proper way to subscribe to wc peer list updates
  const isUpdated = useGetWcPeerListToggle();

  const { peers: beaconPeers } = useBeaconPeers();
  const { data: wcPeers } = useQuery({
    queryKey: ["wcPeers", isUpdated],
    queryFn: () => walletKit.getActiveSessions(),
    initialData: {},
  });

  const peers = useMemo(
    () =>
      [
        ...beaconPeers,
        ...Object.entries(wcPeers).map(([topic, session]) => ({
          id: topic,
          name: session.peer.metadata.name,
          icon: session.peer.metadata.icons[0],
          type: "wc",
          sessionInfo: session,
          accountPkh: session.namespaces.tezos.accounts[0].split(":")[2],
          networkType: session.namespaces.tezos.chains?.[0].split(":")[1],
        })),
      ] as ExtendedPeerSession[],
    [beaconPeers, wcPeers]
  );

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
        <PeerRow key={peerInfo.id} peerInfo={peerInfo} />
      ))}
    </VStack>
  );
};

const PeerRow = ({ peerInfo }: { peerInfo: ExtendedPeerSession }) => {
  const color = useColor();
  const removePeer = useRemoveBeaconPeer();
  const disconnectWalletConnectPeer = useDisconnectWalletConnectPeer();

  const handleRemovePeer = () => {
    if (peerInfo.type === "wc") {
      return disconnectWalletConnectPeer({
        topic: peerInfo.sessionInfo.topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
    } else {
      return removePeer(peerInfo);
    }
  };

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
        onClick={handleRemovePeer}
        variant="iconButtonSolid"
      />
    </Center>
  );
};

const StoredPeerInfo = ({ peerInfo }: { peerInfo: ExtendedPeerSession }) => {
  const beaconConnectionInfo = useGetBeaconConnectionInfo(peerInfo.senderId);

  const connectionInfo = peerInfo.type === "wc" ? peerInfo : beaconConnectionInfo;

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
