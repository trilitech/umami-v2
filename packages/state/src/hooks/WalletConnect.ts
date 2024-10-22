import { useQuery } from "@tanstack/react-query";
import { type NetworkName, type RawPkh } from "@umami/tezos";
import { type ErrorResponse } from "@walletconnect/jsonrpc-utils";
import { type SessionTypes } from "@walletconnect/types";
import { uniq } from "lodash";
import { useDispatch } from "react-redux";

import { useAppSelector } from "./useAppSelector";
import { type DAppWcConnectionInfo, type State, wcActions } from "../slices";
import { walletKit } from "../walletConnect";

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
  return async (session: SessionTypes.Struct, accountPkh: RawPkh, chain: NetworkName) => {
    console.log("adding WC connection", session.topic, accountPkh, chain);
    dispatch(wcActions.addConnection({ topic: session.topic, accountPkh, networkName: chain }));
    await refresh();
  };
};

// remove from slice
export const useRemoveWcConnection = () => {
  const dispatch = useDispatch();
  return (topic: string) => dispatch(wcActions.removeConnection(topic));
};

// remove from WC and slice
export const useRemoveWcPeer = () => {
  const { refresh } = useWcPeers();
  const removeConnectionFromWcSlice = useRemoveWcConnection();

  return async (params: { topic: string; reason: ErrorResponse }) => {
    console.log("disconnecting WC session", params);
    await walletKit
      .disconnectSession(params)
      .then(() => removeConnectionFromWcSlice(params.topic))
      .then(async () => await refresh());
  };
};

// read from WC
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

// read from slice
export const useGetAllWcConnectionInfo = (): State => {
  const connections = useAppSelector(s => s.walletconnect);
  return connections;
};

/**
 * Returns connected account pkh & network by a given topic.
 *
 * @param topic - generated from dApp public key.
 */
export const useGetWcConnectionInfo = (topic: string): DAppWcConnectionInfo | undefined => {
  const connections = useAppSelector(s => s.walletconnect);
  return connections[topic];
};
