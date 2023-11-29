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
import { usePeers, useRemovePeer } from "./beacon";
import { PeerInfo } from "./types";
import { TrashIcon } from "../../assets/icons";
import { Fragment } from "react";
import colors from "../../style/colors";

export const BeaconPeers = () => {
  const { data } = usePeers();
  const removePeer = useRemovePeer();
  const peers = data || [];

  if (peers.length === 0) {
    return null;
  }

  return <PeersDisplay peerInfos={peers} removePeer={removePeer} />;
};

export const PeersDisplay = ({
  peerInfos,
  removePeer,
}: {
  peerInfos: PeerInfo[];
  removePeer: (peer: PeerInfo) => void;
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

const PeerRow = ({ peerInfo, onRemove }: { peerInfo: PeerInfo; onRemove: () => void }) => {
  return (
    <Flex justifyContent="space-between" height="106px" paddingY="30px">
      <Flex>
        <AspectRatio width="48px" marginRight="16px" ratio={1}>
          <Image width="100%" src={peerInfo.icon} />
        </AspectRatio>
        <Center alignItems="flex-start" flexDirection="column">
          <Heading marginLeft={2} size="md">
            {peerInfo.name}
          </Heading>

          <Text marginLeft={2} color={colors.gray[400]} size="sm">
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
