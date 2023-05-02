import { PeerInfo } from "@airgap/beacon-wallet";
import { Button, Flex, Heading } from "@chakra-ui/react";
import {
  refreshPeers,
  usePeers,
  walletClient,
} from "../../utils/beacon/Beacon";

// Displays the list of beacon peers

const BeaconPeers = () => {
  const { data, error } = usePeers();
  // const peersQuery = useQuery("beaconPeers", beaconClient.getPeers);
  // Gives a handle to
  // peersQuery.loading
  // peersQuery.data
  // peersQuery.error

  // When refresh is needed, (for example if you removed or added a peer) refresh "beaconPeers" query.
  // I think there is an API with react query that allows you to say:
  // "beaconPeers is stale" and it will refresh

  const peers = data || [];
  console.log(peers);
  return (
    <>
      <Heading>Peers</Heading>
      <div>
        {peers.map((p: PeerInfo) => {
          return (
            <Flex key={p.name}>
              <Heading>{p.name}</Heading>
              <Button
                onClick={() => {
                  // How can I remove only one Peer
                  walletClient.removeAllPeers().then(refreshPeers);
                }}
              >
                remove Peer
              </Button>
            </Flex>
          );
        })}
      </div>
    </>
  );
};

export default BeaconPeers;
