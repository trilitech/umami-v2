import { getSenderId } from "@airgap/beacon-wallet";
import {
  AspectRatio,
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";

import { usePeers, useRemovePeer } from "./beacon";
import { PeerInfoWithId } from "./types";
import { TrashIcon } from "../../assets/icons";
import { AddressPill } from "../../components/AddressPill/AddressPill";
import colors from "../../style/colors";
import { parsePkh } from "../../types/Address";
import { useGetConnectedAccount } from "../hooks/beaconHooks";

/**
 * Component displaying a list of connected dApps.
 *
 * Loads dApps data from {@link usePeers} hook & zips it with generated dAppIds.
 */
export const BeaconPeers = () => {
  const { data } = usePeers();

  const removePeer = useRemovePeer();
  const [peersWithId, setPeersWithId] = useState<PeerInfoWithId[]>([]);

  // senderId will always be set here, even if we haven't saved it in beaconSlice for a dApp.
  useEffect(() => {
    (async () => {
      const newPeers = await Promise.all(
        (data || []).map(async peer => ({ ...peer, senderId: await getSenderId(peer.publicKey) }))
      );
      setPeersWithId(newPeers);
    })();
  }, [data]);

  if (peersWithId.length === 0) {
    return null;
  }

  return <PeersDisplay peerInfos={peersWithId} removePeer={removePeer} />;
};

/**
 * Component for displaying a list of connected dApps.
 *
 * Each {@link PeerRow} contains info about a single dApp & delete button.
 *
 * @param peerInfos - peerInfo provided by beacon Api + computed dAppId.
 * @param removePeer - hook for deleting dApp connections.
 */
const PeersDisplay = ({
  peerInfos,
  removePeer,
}: {
  peerInfos: PeerInfoWithId[];
  removePeer: (peer: PeerInfoWithId) => void;
}) => {
  return (
    <Box>
      {peerInfos.map(peerInfo => (
        <Fragment key={peerInfo.name}>
          <Divider />
          <PeerRow onRemove={() => removePeer(peerInfo)} peerInfo={peerInfo} />
        </Fragment>
      ))}
    </Box>
  );
};

/**
 * Component for displaying info about single connected dApp.
 *
 * @param peerInfo - peerInfo provided by beacon Api + computed dAppId.
 * @param onRemove - action for deleting dApp connection.
 */
const PeerRow = ({ peerInfo, onRemove }: { peerInfo: PeerInfoWithId; onRemove: () => void }) => {
  return (
    <Flex justifyContent="space-between" height="106px" data-testid="peer-row" paddingY="30px">
      <Flex>
        <AspectRatio width="48px" marginRight="16px" ratio={1}>
          <Image width="100%" src={peerInfo.icon} />
        </AspectRatio>
        <Center alignItems="flex-start" flexDirection="column">
          <Heading marginBottom="11px" marginLeft="8px" size="md">
            {peerInfo.name}
          </Heading>
          <StoredPeerInfo peerInfo={peerInfo} />
        </Center>
      </Flex>
      <Center>
        <IconButton
          aria-label="Remove Peer"
          icon={<TrashIcon />}
          onClick={onRemove}
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
 * Displays {@link AddressPill} with a connected account,
 * if information about the connection is stored in {@link beaconSlice}.
 *
 * @param peerInfo - peerInfo provided by beacon Api + computed dAppId.
 */
const StoredPeerInfo = ({ peerInfo }: { peerInfo: PeerInfoWithId }) => {
  const connectedAccountPkh = useGetConnectedAccount(peerInfo.senderId);

  if (!connectedAccountPkh) {
    return null;
  }
  return (
    <Flex>
      <Text marginRight="6px" marginLeft="8px" color={colors.gray[400]} size="sm">
        Connected to:
      </Text>
      <AddressPill address={parsePkh(connectedAccountPkh)} />
    </Flex>
  );
};
