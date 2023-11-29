import { Box, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Flex } from "@chakra-ui/react";
import { every, get, pick, sumBy } from "lodash";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { NFTDrawerBody } from "./NFTDrawerBody";
import { NFTGallery } from "./NFTGallery";
import { useDynamicModal } from "../../components/DynamicModal";
import { NoNFTs } from "../../components/NoItems";
import { TopBar } from "../../components/TopBar";
import { useAccountsFilter } from "../../components/useAccountsFilter";
import { fullId } from "../../types/Token";
import { useAllNfts } from "../../utils/hooks/assetsHooks";

export const NFTsView = () => {
  const nfts = useAllNfts();
  const { accountsFilter, selectedAccounts } = useAccountsFilter();
  const navigate = useNavigate();
  const { ownerPkh, nftId } = useParams();
  const { isOpen: isDynamicModalOpen } = useDynamicModal();

  const openNFTsPage = useCallback(() => {
    navigate(`/nfts`);
  }, [navigate]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        openNFTsPage();
      }
    };
    document.addEventListener("keydown", onEscape);

    return () => document.removeEventListener("keydown", onEscape);
  }, [openNFTsPage]);

  const selectedNFTs = pick(
    nfts,
    selectedAccounts.map(account => account.address.pkh)
  );
  const totalNFTs = sumBy(Object.values(selectedNFTs).flat(), nft => Number(nft?.balance || 0));

  const noNFTs = every(selectedNFTs, nfts => !nfts || nfts.length === 0);
  const drawerNFT = ownerPkh && get(nfts, [ownerPkh], []).find(nft => fullId(nft) === nftId);

  return (
    <Flex flexDirection="column" height="100%">
      <TopBar subtitle={`(${totalNFTs})`} title="NFTs" />
      {accountsFilter}

      {noNFTs ? (
        <NoNFTs />
      ) : (
        <>
          <Box overflowY="scroll">
            <NFTGallery
              nftsByOwner={selectedNFTs}
              onSelect={nft => {
                navigate(`/nfts/${nft.owner}/${fullId(nft)}`);
              }}
            />
          </Box>

          <Drawer
            autoFocus={false}
            blockScrollOnMount={!isDynamicModalOpen}
            isOpen={!!drawerNFT}
            onClose={openNFTsPage}
            placement="right"
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerBody>
                {drawerNFT && (
                  <NFTDrawerBody nft={drawerNFT} onCloseDrawer={openNFTsPage} ownerPkh={ownerPkh} />
                )}
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </Flex>
  );
};
