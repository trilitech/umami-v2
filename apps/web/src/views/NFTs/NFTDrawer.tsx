import { DrawerBody, DrawerContent, DrawerHeader } from "@chakra-ui/react";
import { type NFTBalance } from "@umami/core";

import { NFTDrawerCard } from "./NFTDrawerCard";
import { DrawerCloseButton } from "../../components/CloseButton";

export const NFTDrawer = ({ nft }: { nft: NFTBalance }) => (
  <DrawerContent>
    <DrawerHeader justifyContent="flex-end" display="flex" minHeight={{ base: "54px", lg: "70px" }}>
      <DrawerCloseButton />
    </DrawerHeader>
    <DrawerBody>
      <NFTDrawerCard nft={nft} />
    </DrawerBody>
  </DrawerContent>
);
