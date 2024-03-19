import { Flex } from "@chakra-ui/react";

import { NFTDrawerCard } from "./NFTDrawerCard";
import { AddressPill } from "../../components/AddressPill/AddressPill";
import { CloseDrawerButton } from "../../components/CloseDrawerButton";
import colors from "../../style/colors";
import { parsePkh } from "../../types/Address";
import { NFTWithOwner } from "../../utils/token/utils";

export const NFTDrawerBody = ({
  nft,
  onCloseDrawer,
}: {
  nft: NFTWithOwner;
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
