import { Flex } from "@chakra-ui/react";
import colors from "../../style/colors";
import AddressPill from "../../components/AddressPill/AddressPill";
import { RawPkh, parsePkh } from "../../types/Address";
import { CloseDrawerButton } from "../home/DrawerTopButtons";
import NFTDrawerCard from "./NFTDrawerCard";
import { NFTBalance } from "../../types/TokenBalance";

const NFTDrawerBody = ({
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

export default NFTDrawerBody;
