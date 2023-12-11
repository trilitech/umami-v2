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
import colors from "../../style/colors";

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

export const PeersDisplay = ({
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

const PeerRow = ({ peerInfo, onRemove }: { peerInfo: PeerInfoWithId; onRemove: () => void }) => {
  return (
    <Flex justifyContent="space-between" height="106px" data-testid="peer-row" paddingY="30px">
      <Flex>
        <AspectRatio width="48px" marginRight="16px" ratio={1}>
          <Image width="100%" src={peerInfo.icon} />
        </AspectRatio>
        <Center alignItems="flex-start" flexDirection="column">
          <Heading marginLeft="8px" size="md">
            {peerInfo.name}
          </Heading>
          <Text marginLeft="8px" color={colors.gray[400]} size="sm">
            {peerInfo.relayServer}
          </Text>
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
