import { type ExtendedPeerInfo, getSenderId } from "@airgap/beacon-wallet";
import {
  AspectRatio,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import { useAddPeer, useGetConnectionInfo, usePeers, useRemovePeer } from "@umami/state";
import { parsePkh } from "@umami/tezos";
import { capitalize } from "lodash";
import { Fragment, useEffect, useState } from "react";

import { DrawerContentWrapper } from "./DrawerContentWrapper";
import { TrashIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { AddressPill } from "../AddressPill";
import { EmptyMessage } from "../EmptyMessage";

export const BeaconPeers = () => {
  const { peers } = usePeers();

  const [peersWithId, setPeersWithId] = useState<ExtendedPeerInfo[]>([]);

  // senderId will always be set here, even if we haven't saved it in beaconSlice for a dApp.
  useEffect(() => {
    const peerIdPromises = peers.map(async peer => ({
      ...peer,
      senderId: peer.senderId || (await getSenderId(peer.publicKey)),
    }));

    Promise.all(peerIdPromises)
      .then(setPeersWithId)
      .catch(() => {});
  }, [peers]);

  if (peersWithId.length === 0) {
    return (
      <Box data-testid="beacon-peers-empty">
        <Divider />
        <EmptyMessage alignItems="flex-start" marginTop="40px" subtitle="Apps" title="Apps" />
      </Box>
    );
  }

  return <PeersDisplay data-testid="beacon-peers" peerInfos={peersWithId} />;
};

const PeerRow = ({ peerInfo }: { peerInfo: ExtendedPeerInfo }) => {
  const removePeer = useRemovePeer();

  return (
    <Flex justifyContent="space-between" height="106px" data-testid="peer-row" paddingY="30px">
      <Flex>
        <AspectRatio width="48px" marginRight="16px" ratio={1}>
          <Image width="100%" src={peerInfo.icon} />
        </AspectRatio>
        <Center alignItems="flex-start" flexDirection="column">
          <Heading marginBottom="6px" size="md">
            {peerInfo.name}
          </Heading>
          <StoredPeerInfo peerInfo={peerInfo} />
        </Center>
      </Flex>
      <Center>
        <IconButton
          aria-label="Remove Peer"
          icon={<TrashIcon />}
          onClick={() => removePeer(peerInfo)}
          size="xs"
          variant="circle"
        />
      </Center>
    </Flex>
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
  const color = useColor();

  if (!connectionInfo) {
    return null;
  }
  return (
    <Flex>
      <AddressPill marginRight="10px" address={parsePkh(connectionInfo.accountPkh)} />
      <Divider marginRight="10px" orientation="vertical" />
      <Text marginTop="2px" marginRight="4px" color={color("450")} fontWeight={650} size="sm">
        Network:
      </Text>
      <Text marginTop="2px" data-testid="dapp-connection-network" size="sm">
        {capitalize(connectionInfo.networkType)}
      </Text>
    </Flex>
  );
};

const PeersDisplay = ({ peerInfos }: { peerInfos: ExtendedPeerInfo[] }) => (
  <Box>
    {peerInfos.map(peerInfo => (
      <Fragment key={peerInfo.senderId}>
        <Divider />
        <PeerRow peerInfo={peerInfo} />
      </Fragment>
    ))}
  </Box>
);

export const AppsMenu = () => {
  const addPeer = useAddPeer();

  return (
    <DrawerContentWrapper title="Apps">
      <Text marginTop="12px" size="lg">
        Connect with Pairing Request
      </Text>
      <Button
        width="fit-content"
        marginTop="18px"
        padding="0 24px"
        onClick={() => navigator.clipboard.readText().then(text => addPeer(text))}
        variant="secondary"
      >
        Connect
      </Button>
      <Divider marginTop={{ base: "36px", lg: "40px" }} />
      <BeaconPeers />
    </DrawerContentWrapper>
  );
};
