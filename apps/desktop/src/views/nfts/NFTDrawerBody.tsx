import { Flex } from "@chakra-ui/react";
import { type NFTBalanceWithOwner } from "@umami/core";
import { parsePkh } from "@umami/tezos";

import { NFTDrawerCard } from "./NFTDrawerCard";
import { AddressPill } from "../../components/AddressPill/AddressPill";
import { CloseDrawerButton } from "../../components/CloseDrawerButton";
import colors from "../../style/colors";

export const NFTDrawerBody = ({
  nft,
  onCloseDrawer,
}: {
  nft: NFTBalanceWithOwner;
  onCloseDrawer: () => void;
}) => (
  <>
    <Flex
      alignItems="center"
      justifyContent="space-between"
      paddingBottom="22px"
      color={colors.gray[400]}
      data-testid="nft-drawer-body"
    >
      <AddressPill address={parsePkh(nft.owner)} />
      <CloseDrawerButton onClose={onCloseDrawer} />
    </Flex>
    <NFTDrawerCard nft={nft} />
  </>
);
