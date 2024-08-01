import { Flex, Heading, Icon, SimpleGrid } from "@chakra-ui/react";
import { fullId, sortedByLastUpdate } from "@umami/core";
import { useCurrentAccount, useGetAccountNFTs } from "@umami/state";
import BigNumber from "bignumber.js";

import { NFTCard } from "./NFTCard";
import { FilterIcon } from "../../assets/icons";
import { EmptyMessage } from "../../components/EmptyMessage";
import { useColor } from "../../styles/useColor";

export const NFTs = () => {
  const color = useColor();
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
            <Flex alignItems="center" gap="4px">
              <Icon as={FilterIcon} color={color("400")} />
              <Heading color={color("600")} size="sm">
                Filter By
              </Heading>
            </Flex>
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
              <NFTCard key={fullId(nft)} nft={nft} />
            ))}
          </SimpleGrid>
        </>
      ) : (
        <EmptyMessage subtitle="NFTs" title="NFT" />
      )}
    </Flex>
  );
};
