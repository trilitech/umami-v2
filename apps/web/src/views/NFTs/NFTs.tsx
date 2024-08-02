import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { type NFTBalance, fullId, sortedByLastUpdate } from "@umami/core";
import { useCurrentAccount, useGetAccountNFTs } from "@umami/state";
import BigNumber from "bignumber.js";
import { useState } from "react";

import { NFTCard } from "./NFTCard";
import { NFTDrawerCard } from "./NFTDrawerCard/NFTDrawerCard";
import { CloseIcon, FilterIcon } from "../../assets/icons";
import { EmptyMessage } from "../../components/EmptyMessage";
import { useColor } from "../../styles/useColor";

export const NFTs = () => {
  const color = useColor();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentNFT, setCurrentNFT] = useState<NFTBalance | null>(null);
  const account = useCurrentAccount()!;
  const nfts = sortedByLastUpdate(useGetAccountNFTs()(account.address.pkh));
  const totalCount = nfts.reduce((acc, nft) => acc.plus(nft.balance), BigNumber(0)).toNumber();

  let gridTemplateColumns = "repeat(auto-fit, minmax(min(100%/2, max(157px, 100%/4)), 1fr))";
  if (nfts.length < 3) {
    gridTemplateColumns = `repeat(auto-fit, min(100% / ${nfts.length} - 6px, 50%))`;
  }

  return (
    <Flex flexDirection="column" gap={{ base: "12px", lg: "30px" }} height="full">
      {nfts.length ? (
        <>
          <Flex justifyContent="space-between">
            <Button size="sm" variant="auxiliary">
              <Icon as={FilterIcon} color={color("400")} />
              <Text color={color("600")} fontWeight="600" size="sm">
                Filter By
              </Text>
            </Button>
            <Heading color={color("600")} data-testid="total-count" size="sm">
              {totalCount}
            </Heading>
          </Flex>
          <SimpleGrid
            gridTemplateColumns={gridTemplateColumns}
            spacingX="12px"
            spacingY={{ base: "18px", lg: "30px" }}
          >
            {nfts.map(nft => (
              <NFTCard
                key={fullId(nft)}
                nft={nft}
                onClick={() => {
                  setCurrentNFT(nft);
                  onOpen();
                }}
              />
            ))}
          </SimpleGrid>
        </>
      ) : (
        <EmptyMessage subtitle="NFTs" title="NFT" />
      )}
      <Drawer isOpen={isOpen && !!currentNFT} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader justifyContent="flex-end" display="flex">
            <Button onClick={onClose} size="sm" variant="auxiliary">
              <Text color={color("600")} fontWeight="600" size="sm">
                Close
              </Text>
              <Icon as={CloseIcon} width="18px" height="18px" color={color("400")} />
            </Button>
          </DrawerHeader>
          <DrawerBody>{currentNFT && <NFTDrawerCard nft={currentNFT} />}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};
