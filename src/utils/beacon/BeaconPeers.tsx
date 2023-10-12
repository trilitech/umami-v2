import {
  AspectRatio,
  Flex,
  IconButton,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { usePeers, useRemovePeer } from "./beacon";
import { PeerInfo } from "./types";
import Trash from "../../assets/icons/Trash";

const PeerRow = ({ peerInfo, onRemove }: { peerInfo: PeerInfo; onRemove: () => void }) => {
  return (
    <Tr>
      <Td>
        <Flex alignItems="center">
          <AspectRatio width={4} ratio={1}>
            <Image width="100%" src={peerInfo.icon} />
          </AspectRatio>
          <Text size="sm" ml={2}>
            {peerInfo.name}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Text size="sm" ml={2}>
          {peerInfo.relayServer}
        </Text>
      </Td>
      <Td>
        <IconButton
          onClick={onRemove}
          aria-label="Remove Peer"
          variant="tertiary"
          icon={<Trash />}
        />
      </Td>
    </Tr>
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
    <TableContainer overflowX="unset" overflowY="unset">
      <Table>
        <Thead top={0} bg="umami.gray.900" borderRadius={4}>
          <Tr>
            <Th>Name:</Th>
            <Th>Relay server:</Th>
            <Th>Delete:</Th>
          </Tr>
        </Thead>
        <Tbody>
          {peerInfos.map(peerInfo => (
            <PeerRow
              key={peerInfo.name}
              peerInfo={peerInfo}
              onRemove={() => removePeer(peerInfo)}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
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
