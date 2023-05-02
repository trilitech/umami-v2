import { Heading } from "@chakra-ui/react";
import { usePeers } from "../../utils/beacon/Beacon";

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
  return (
    <>
      <Heading>Peers</Heading>
      <div>
        {peers.map((p) => {
          return <Heading>{p.name}</Heading>;
        })}
      </div>
    </>
  );
};

export default BeaconPeers;
