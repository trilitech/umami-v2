import { Button, Flex, Heading, Icon, SimpleGrid, Text } from "@chakra-ui/react";
import { useDynamicDrawerContext } from "@umami/components";
import { fullId, sortedByLastUpdate } from "@umami/core";
import { useCurrentAccount, useGetAccountNFTs } from "@umami/state";
import BigNumber from "bignumber.js";

import { NFTCard } from "./NFTCard";
import { NFTDrawer } from "./NFTDrawer";
import { FilterIcon } from "../../assets/icons";
import { EmptyMessage } from "../../components/EmptyMessage";
import { useColor } from "../../styles/useColor";

export const NFTs = () => {
  const color = useColor();
  const { openWith } = useDynamicDrawerContext();
  const account = useCurrentAccount()!;
  const nfts = sortedByLastUpdate(useGetAccountNFTs()(account.address.pkh));
  const totalCount = nfts.reduce((acc, nft) => acc.plus(nft.balance), BigNumber(0)).toNumber();

  let gridTemplateColumns = "repeat(auto-fit, minmax(min(100%/2, max(157px, 100%/5)), 1fr))";
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
                onClick={() => openWith(<NFTDrawer nft={nft} />)}
              />
            ))}
          </SimpleGrid>
        </>
      ) : (
        <EmptyMessage subtitle="NFTs" title="NFT" />
      )}
    </Flex>
  );
};
