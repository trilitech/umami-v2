import { Box, Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import { useDynamicDrawerContext } from "@umami/components";
import { fullId } from "@umami/core";
import BigNumber from "bignumber.js";
import { range } from "lodash";

import { NFTCard } from "./NFTCard";
import { NFTDrawer } from "./NFTDrawer";
import { NFTFilter, useNFTFilter } from "./NFTFilter";
import { EmptyMessage, VerifyMessage } from "../../components/EmptyMessage";
import { useCheckVerified } from "../../components/Onboarding/useCheckVerified";
import { ViewOverlay } from "../../components/ViewOverlay/ViewOverlay";
import { useColor } from "../../styles/useColor";

export const NFTs = () => {
  const isVerified = useCheckVerified();
  const color = useColor();
  const { openWith } = useDynamicDrawerContext();
  const { nfts, options: nftFilterOptions, getCheckboxProps } = useNFTFilter();
  const totalCount = nfts.reduce((acc, nft) => acc.plus(nft.balance), BigNumber(0)).toNumber();

  const gridTemplateColumns = {
    base: "repeat(auto-fit, minmax(min(100%/2, max(157px, 100%/5)), 1fr))",
    lg: "repeat(auto-fit, minmax(min(100%/2, max(236px, 100%/5)), 1fr))",
  };

  return (
    <>
      <Flex zIndex={1} flexDirection="column" flexGrow={1} gap={{ base: "12px", lg: "30px" }}>
        {nfts.length ? (
          <>
            <Flex justifyContent="space-between">
              <NFTFilter getCheckboxProps={getCheckboxProps} options={nftFilterOptions} />
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
              {/* empty boxes to make up to a full row */}
              {range(4 - (nfts.length % 4)).map(index => (
                <Box key={index} />
              ))}
            </SimpleGrid>
          </>
        ) : isVerified ? (
          <EmptyMessage
            margin="auto"
            cta="Buy your first NFT"
            ctaUrl="https://objkt.com/"
            subtitle={"Explore and purchase unique digital assets\n to start your collection."}
            title="Browse NFTs"
          />
        ) : (
          <VerifyMessage />
        )}
      </Flex>
      {!nfts.length && <ViewOverlay iconType="nfts" />}
    </>
  );
};
