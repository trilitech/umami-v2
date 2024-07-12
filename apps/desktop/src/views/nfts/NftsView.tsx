import { Box, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Flex } from "@chakra-ui/react";
import { type NFTWithOwner } from "@umami/core";
import { useAllNfts } from "@umami/state";
import { every, pick, sumBy } from "lodash";
import { useEffect, useState } from "react";

import { NFTDrawerBody } from "./NFTDrawerBody";
import { NFTGallery } from "./NFTGallery";
import { SelectedNFTContext } from "./SelectedNFTContext";
import { NoNFTs } from "../../components/NoItems";
import { TopBar } from "../../components/TopBar";
import { useAccountsFilter } from "../../components/useAccountsFilter";

export const NFTsView = () => {
  const nfts = useAllNfts();

  const { accountsFilter, selectedAccounts } = useAccountsFilter();

  const [drawerNFT, setDrawerNFT] = useState<NFTWithOwner | undefined>(undefined);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerNFT(undefined);
      }
    };
    document.addEventListener("keydown", onEscape);

    return () => document.removeEventListener("keydown", onEscape);
  }, []);

  const selectedNFTs = pick(
    nfts,
    selectedAccounts.map(account => account.address.pkh)
  );
  const totalNFTs = sumBy(Object.values(selectedNFTs).flat(), nft => Number(nft?.balance || 0));

  const noNFTs = every(selectedNFTs, nfts => !nfts || nfts.length === 0);

  return (
    <Flex flexDirection="column" height="100%">
      <TopBar subtitle={`(${totalNFTs})`} title="NFTs" />
      {accountsFilter}

      {noNFTs ? (
        <NoNFTs size="lg" />
      ) : (
        <SelectedNFTContext.Provider
          value={{ setSelectedNFT: setDrawerNFT, selectedNFT: drawerNFT }}
        >
          <Box overflowY="scroll">
            <NFTGallery nftsByOwner={selectedNFTs} />
          </Box>

          <Drawer
            autoFocus={false}
            blockScrollOnMount={false}
            isOpen={!!drawerNFT}
            onClose={() => setDrawerNFT(undefined)}
            placement="right"
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerBody>
                {drawerNFT && (
                  <NFTDrawerBody nft={drawerNFT} onCloseDrawer={() => setDrawerNFT(undefined)} />
                )}
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </SelectedNFTContext.Provider>
      )}
    </Flex>
  );
};
