import { DrawerBody, DrawerHeader } from "@chakra-ui/react";
import { type NFTBalance } from "@umami/core";

import { NFTDrawerCard } from "./NFTDrawerCard";
import { DrawerCloseButton } from "../../components/CloseButton";
import { useColor } from "../../styles/useColor";

export const NFTDrawer = ({ nft }: { nft: NFTBalance }) => {
  const color = useColor();
  const bgColor = color("255, 255, 255", "34, 34, 63");

  return (
    <>
      <DrawerHeader
        position="absolute"
        zIndex="1"
        justifyContent="flex-end"
        display="flex"
        width="100%"
        minHeight={{ base: "54px", md: "70px" }}
        backdropFilter="blur(10px)"
        backgroundColor={`rgba(${bgColor}, 0.9)`}
      >
        <DrawerCloseButton />
      </DrawerHeader>
      <DrawerBody paddingTop={{ base: "54px", md: "70px" }}>
        <NFTDrawerCard nft={nft} />
      </DrawerBody>
    </>
  );
};
