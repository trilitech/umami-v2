import { ExtendedPeerInfo, getSenderId } from "@airgap/beacon-wallet";
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
import { capitalize, noop } from "lodash";
import { Fragment, useEffect, useState } from "react";

import { usePeers, useRemovePeer } from "./beacon";
import { TrashIcon } from "../../assets/icons";
import { AddressPill } from "../../components/AddressPill/AddressPill";
import colors from "../../style/colors";
import { RawPkh, parsePkh } from "../../types/Address";
import { useGetConnectedAccounts, useGetConnectionNetworkType } from "../hooks/beaconHooks";

/**
 * Component displaying a list of connected dApps.
 *
 * Loads dApps data from {@link usePeers} hook & zips it with generated dAppIds.
 */
export const BeaconPeers = () => {
  const { data } = usePeers();
  const [peersWithId, setPeersWithId] = useState<ExtendedPeerInfo[]>([]);

  // senderId will always be set here, even if we haven't saved it in beaconSlice for a dApp.
  useEffect(() => {
    const peerIdPromises = (data || []).map(async peer => ({
      ...peer,
      senderId: peer.senderId || (await getSenderId(peer.publicKey)),
    }));
    Promise.all(peerIdPromises).then(setPeersWithId).catch(noop);
  }, [data]);

  if (peersWithId.length === 0) {
    return (
      <Box>
        <Divider />
        <Text marginTop="31px" color={colors.gray[400]} size="lg">
          Your dApps will appear here
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {peersWithId.map(peerInfo => (
        <PeersDisplay key={peerInfo.name} peerInfo={peerInfo} />
      ))}
    </Box>
  );
};

/**
 * Component for displaying list of connections for given dApp.
 *
 * If there are no saved connections, one row for the dApp will still be displayed.
 *
 * @param peerInfo - peerInfo provided by beacon Api + computed dAppId.
 */
const PeersDisplay = ({ peerInfo }: { peerInfo: ExtendedPeerInfo }) => {
  const getConnectionInfos = useGetConnectedAccounts();
  const connectedAccounts = getConnectionInfos(peerInfo.senderId);

  if (connectedAccounts.length === 0) {
    return (
      <Fragment key={peerInfo.name}>
        <Divider />
        <PeerRow peerInfo={peerInfo} />
      </Fragment>
    );
  }

  return (
    <Box>
      {connectedAccounts.map(accountPkh => (
        <Fragment key={peerInfo.name + accountPkh}>
          <Divider />
          <PeerRow accountPkh={accountPkh} peerInfo={peerInfo} />
        </Fragment>
      ))}
    </Box>
  );
};

/**
 * Component for displaying info about single connected dApp.
 *
 * Each {@link PeerRow} contains info about a single connection & delete button.
 *
 * @param peerInfo - peerInfo provided by beacon Api + computed dAppId.
 * @param accountPkh - accountPkh for which the dApp is connected.
 */
const PeerRow = ({ peerInfo, accountPkh }: { peerInfo: ExtendedPeerInfo; accountPkh?: RawPkh }) => {
  const removePeer = useRemovePeer();

  return (
    <Flex justifyContent="space-between" height="106px" data-testid="peer-row" paddingY="30px">
      <Flex>
        <AspectRatio width="48px" marginRight="16px" ratio={1}>
          <Image width="100%" src={peerInfo.icon} />
        </AspectRatio>
        <Center alignItems="flex-start" flexDirection="column">
          <Heading marginBottom="6px" size="md">
            {peerInfo.name}
          </Heading>
          <StoredPeerInfo accountPkh={accountPkh} peerInfo={peerInfo} />
        </Center>
      </Flex>
      <Center>
        <IconButton
          aria-label="Remove Peer"
          icon={<TrashIcon />}
          onClick={() => removePeer(peerInfo, accountPkh)}
          size="xs"
          variant="circle"
        />
      </Center>
    </Flex>
  );
};

/**
 * Component for displaying additional info about connection with a dApp.
 *
 * Displays {@link AddressPill} with a connected account and network type,
 * if information about the connection is stored in {@link beaconSlice}.
 *
 * @param peerInfo - peerInfo provided by beacon Api + computed dAppId.
 * @param accountPkh - accountPkh for which the dApp is connected.
 */
const StoredPeerInfo = ({
  peerInfo,
  accountPkh,
}: {
  peerInfo: ExtendedPeerInfo;
  accountPkh?: RawPkh;
}) => {
  const getConnectionNetworkType = useGetConnectionNetworkType();

  if (!accountPkh) {
    return null;
  }
  return (
    <Flex>
      <AddressPill marginRight="10px" address={parsePkh(accountPkh)} />
      <Divider marginRight="10px" orientation="vertical" />
      <Text marginTop="2px" marginRight="4px" color={colors.gray[450]} fontWeight={650} size="sm">
        Network:
      </Text>
      <Text marginTop="2px" color={colors.white} data-testid="dapp-connection-network" size="sm">
        {capitalize(getConnectionNetworkType(peerInfo.senderId, accountPkh))}
      </Text>
    </Flex>
  );
};
