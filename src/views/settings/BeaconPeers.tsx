import React from "react";
import { useQuery } from "react-query";

// Displays the list of beacon peers
const BeaconPeers = () => {
  // const peersQuery = useQuery("beaconPeers", beaconClient.getPeers);
  // Gives a handle to
  // peersQuery.loading
  // peersQuery.data
  // peersQuery.error

  // When refresh is needed, (for example if you removed or added a peer) refresh "beaconPeers" query.
  // I think there is an API with react query that allows you to say:
  // "beaconPeers is stale" and it will refresh

  return <div>BeaconClients</div>;
};

export default BeaconPeers;
