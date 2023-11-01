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
import TrashIcon from "../../assets/icons/Trash";
import { Fragment } from "react";
import colors from "../../style/colors";

const PeerRow = ({ peerInfo, onRemove }: { peerInfo: PeerInfo; onRemove: () => void }) => {
  return (
    <Flex height="106px" paddingY="30px" justifyContent="space-between">
      <Flex>
        <AspectRatio width="48px" marginRight="16px" ratio={1}>
          <Image width="100%" src={peerInfo.icon} />
        </AspectRatio>
        <Center alignItems="flex-start" flexDirection="column">
          <Heading size="md" ml={2}>
            {peerInfo.name}
          </Heading>

          <Text size="sm" color={colors.gray[400]} ml={2}>
            {peerInfo.relayServer}
          </Text>
        </Center>
      </Flex>
      <Center>
        <IconButton
          onClick={onRemove}
          aria-label="Remove Peer"
          size="xs"
          variant="circle"
          icon={<TrashIcon />}
        />
      </Center>
    </Flex>
  );
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
          <PeerRow peerInfo={peerInfo} onRemove={() => removePeer(peerInfo)} />
        </Fragment>
      ))}
    </Box>
  );
};

const BeaconPeers = () => {
  const { data } = usePeers();
  const removePeer = useRemovePeer();
  const peers = data || [];

  if (peers.length === 0) {
    return null;
  }

  return <PeersDisplay peerInfos={peers} removePeer={removePeer} />;
};

export default BeaconPeers;
