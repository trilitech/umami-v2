import { DrawerBody, DrawerHeader } from "@chakra-ui/react";
import { type NFTBalance } from "@umami/core";

import { NFTDrawerCard } from "./NFTDrawerCard";
import { DrawerCloseButton } from "../../components/CloseButton";

export const NFTDrawer = ({ nft }: { nft: NFTBalance }) => (
  <>
    <DrawerHeader justifyContent="flex-end" display="flex" minHeight={{ base: "54px", md: "70px" }}>
      <DrawerCloseButton />
    </DrawerHeader>
    <DrawerBody>
      <NFTDrawerCard nft={nft} />
    </DrawerBody>
  </>
);
