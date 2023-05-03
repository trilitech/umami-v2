import { PeerInfo } from "@airgap/beacon-wallet";
import {
  AspectRatio,
  Flex,
  Heading,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { BsTrash } from "react-icons/bs";
import { refreshPeers, usePeers, walletClient } from "./beacon";

// Displays the list of beacon peers

const renderPeer = (p: PeerInfo) => {
  const icon = (p as any).icon;
  return (
    <Flex key={p.name} mt={2} mb={2}>
      <Flex flex={1} alignItems="center">
        <AspectRatio width={12} ratio={4 / 4}>
          <Image width="100%" src={icon} />
        </AspectRatio>
        <Heading size={"sm"} ml={4}>
          {p.name}
        </Heading>
      </Flex>

      <IconButton
        onClick={() => {
          walletClient.removePeer(p as any).then(refreshPeers);
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
      {peers.map(renderPeer)}
    </>
  );
};

export default BeaconPeers;
