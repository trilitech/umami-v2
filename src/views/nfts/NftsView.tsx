import { Box, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Flex } from "@chakra-ui/react";
import { every, pick, sumBy } from "lodash";
import { useEffect, useState } from "react";

import { NFTDrawerBody } from "./NFTDrawerBody";
import { NFTGallery } from "./NFTGallery";
import { useDynamicModal } from "../../components/DynamicModal";
import { NoNFTs } from "../../components/NoItems";
import { TopBar } from "../../components/TopBar";
import { useAccountsFilter } from "../../components/useAccountsFilter";
import { useAllNfts } from "../../utils/hooks/assetsHooks";
import { NFTWithOwner } from "../../utils/token/utils";

export const NFTsView = () => {
  const nfts = useAllNfts();

  const { isOpen: isDynamicModalOpen } = useDynamicModal();
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
        <NoNFTs />
      ) : (
        <>
          <Box overflowY="scroll">
            <NFTGallery nftsByOwner={selectedNFTs} onSelect={nft => setDrawerNFT(nft)} />
          </Box>

          <Drawer
            autoFocus={false}
            blockScrollOnMount={!isDynamicModalOpen}
            isOpen={!!drawerNFT}
            onClose={() => setDrawerNFT(undefined)}
            placement="right"
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerBody>
                {drawerNFT && (
                  <NFTDrawerBody
                    nft={drawerNFT}
                    onCloseDrawer={() => setDrawerNFT(undefined)}
                    ownerPkh={drawerNFT.owner}
                  />
                )}
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </Flex>
  );
};
