import { PeerInfo } from "@airgap/beacon-wallet";
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
import { BsTrash } from "react-icons/bs";
import { usePeers, useRemovePeer } from "./beacon";

// Displays the list of beacon peers

const peerRow = (peerInfo: PeerInfo, onRemove: () => void) => {
  console.log(peerInfo);
  return (
    <Tr>
      <Td>
        <Flex alignItems={"center"}>
          <AspectRatio width={4} ratio={1}>
            <Image width="100%" src={(peerInfo as any).icon} />
          </AspectRatio>
          <Text size={"sm"} ml={2}>
            {peerInfo.name}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Text size={"sm"} ml={2}>
          {(peerInfo as any).relayServer}
        </Text>
      </Td>
      <Td>
        <IconButton
          onClick={onRemove}
          aria-label="Remove Peer"
          icon={<BsTrash />}
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
          {peerInfos.map((peerInfo) =>
            peerRow(peerInfo, () => removePeer(peerInfo))
          )}
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
    return (
      <Text mt={4} color={"text.dark"}>
        Paste a peer request or open a deeplink from inside a dApp...
      </Text>
    );
  }

  return <PeersDisplay peerInfos={peers} removePeer={removePeer} />;
};

export default BeaconPeers;
