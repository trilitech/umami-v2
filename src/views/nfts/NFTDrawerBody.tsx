import { Flex } from "@chakra-ui/react";

import { NFTDrawerCard } from "./NFTDrawerCard";
import { AddressPill } from "../../components/AddressPill/AddressPill";
import colors from "../../style/colors";
import { RawPkh, parsePkh } from "../../types/Address";
import { NFTBalance } from "../../types/TokenBalance";
import { CloseDrawerButton } from "../home/DrawerTopButtons";

export const NFTDrawerBody = ({
  ownerPkh,
  nft,
  onCloseDrawer,
}: {
  ownerPkh: RawPkh;
  nft: NFTBalance;
  onCloseDrawer: () => void;
}) => {
  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        paddingBottom="30px"
        color={colors.gray[400]}
        cursor="pointer"
        data-testid="nft-drawer-body"
      >
        <AddressPill address={parsePkh(ownerPkh)} />
        <CloseDrawerButton onClose={onCloseDrawer} />
      </Flex>
      <NFTDrawerCard nft={nft} ownerPkh={ownerPkh} />
    </>
  );
};
