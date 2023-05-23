import { PeerInfo } from "@airgap/beacon-wallet";
import {
  AspectRatio,
  Flex,
  Heading,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { BsTrash } from "react-icons/bs";
import { usePeers, useRefreshPeers, walletClient } from "./beacon";

// Displays the list of beacon peers

export const PeerDisplay = ({ peerInfo }: { peerInfo: PeerInfo }) => {
  const refreshPeers = useRefreshPeers();
  const icon = (peerInfo as any).icon;
  return (
    <Flex key={peerInfo.name} mt={2} mb={2}>
      <Flex flex={1} alignItems="center">
        <AspectRatio width={12} ratio={4 / 4}>
          <Image width="100%" src={icon} />
        </AspectRatio>
        <Heading size={"sm"} ml={4}>
          {peerInfo.name}
        </Heading>
      </Flex>

      <IconButton
        onClick={() => {
          walletClient.removePeer(peerInfo as any).then(refreshPeers); // Bug in types
        }}
        aria-label="Delete Peer"
        icon={<BsTrash />}
      />
    </Flex>
  );
};

const BeaconPeers = () => {
  const { data } = usePeers();
  const peers = data || [];
  return (
    <>
      <Heading>Peers</Heading>
      {peers.map((peerInfo) => (
        <PeerDisplay peerInfo={peerInfo} />
      ))}
    </>
  );
};

export default BeaconPeers;
