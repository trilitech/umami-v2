import { useQuery } from "@tanstack/react-query";
import { type NetworkName, type RawPkh } from "@umami/tezos";
import { type ErrorResponse } from "@walletconnect/jsonrpc-utils";
import { type SessionTypes } from "@walletconnect/types";
import { uniq } from "lodash";
import { useDispatch } from "react-redux";

import { useAppSelector } from "./useAppSelector";
import { type DAppWcConnectionInfo, wcActions } from "../slices";
import { walletKit } from "../walletConnect";

/**
 * Returns connected account pkh & network by a given topic.
 *
 * @param topic - generated from dApp public key.
 */
export const useGetWcConnectionInfo = (topic: string): DAppWcConnectionInfo | undefined => {
  const connections = useAppSelector(s => s.walletconnect);
  return connections[topic];
};

export const useGetWcPeersForAccounts = () => {
  const connections = useAppSelector(s => s.walletconnect);

  return (pkhs: RawPkh[]) =>
    uniq(
      Object.entries(connections)
        .filter(([_, connectionInfo]) => pkhs.includes(connectionInfo.accountPkh))
        .map(([topic, _]) => topic)
    );
};

/**
 * Returns function for removing all connections from {@link wcSlice}.
 */
export const useResetWcConnections = () => {
  const dispatch = useDispatch();
  return () => dispatch(wcActions.reset());
};

/**
 * Returns function for adding connection info to {@link wcSlice}.
 */
export const useAddWcConnection = () => {
  const { refresh } = useWcPeers();
  const dispatch = useDispatch();
  return (session: SessionTypes.Struct, accountPkh: RawPkh, chain: NetworkName) => {
    dispatch(wcActions.addConnection({ topic: session.topic, accountPkh, networkName: chain }));
    void refresh();
  };
};

/**
 * Returns function for removing connection from {@link wcSlice}.
 */
export const useRemoveWcConnection = () => {
  const dispatch = useDispatch();
  return (topic: string) => dispatch(wcActions.removeConnection(topic));
};

export const useWcPeers = () => {
  const query = useQuery<Record<string, SessionTypes.Struct>>({
    queryKey: ["wcPeers"],
    queryFn: async () => {
      const wcPeers: Record<string, SessionTypes.Struct> = walletKit.getActiveSessions();
      console.log("Active WC sessions:", wcPeers);
      return wcPeers;
    },
    initialData: {},
  });

  return { peers: query.data, refresh: query.refetch };
};

export const useRemoveWcPeer = () => {
  const { refresh } = useWcPeers();
  const removeConnectionFromWcSlice = useRemoveWcConnection();

  return (params: { topic: string; reason: ErrorResponse }) => {
    console.log("disconnecting WC session", params);
    walletKit
      .disconnectSession(params)
      .then(() => removeConnectionFromWcSlice(params.topic))
      .finally(() => void refresh());
  };
};

// export const useRemoveWcPeerBySenderId = () => {
//   const { peers } = useWcPeers();
//   const removePeer = useRemoveWcPeer();

//   return (topic: string) =>
//     Promise.all(peers.filter(peerInfo => topic === peerInfo.topic).map(removePeer));
// };

// export const useRemoveWcPeersByAccounts = () => {
//   const getPeersForAccounts = useGetWcPeersForAccounts();
//   const removePeerBySenderId = useRemoveWcPeerBySenderId();

//   return (pkhs: RawPkh[]) => Promise.all(getPeersForAccounts(pkhs).map(removePeerBySenderId));
// };

// export const useAddWcPeer = () => {
//   const { refresh } = useWcPeers();
//   const toast = useToast();

//   return (payload: string) =>
//     new Serializer()
//       .deserialize(payload)
//       .then(parsePeerInfo)
//       .then(peer => WalletClient.addPeer(peer as ExtendedPeerInfo))
//       .then(() => refresh())
//       .catch(e => {
//         toast({
//           description:
//             "Wc sync code in the clipboard is invalid. Please copy a wc sync code from the dApp",
//           status: "error",
//         });
//         console.error(e);
//       });
// };
