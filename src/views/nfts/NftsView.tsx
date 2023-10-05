import { Box, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Flex } from "@chakra-ui/react";
import { every, pick } from "lodash";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NoNFTs } from "../../components/NoItems";
import { TopBar } from "../../components/TopBar";
import { useAccountsFilter } from "../../components/useAccountsFilter";
import { fullId } from "../../types/Token";
import { useAllNfts } from "../../utils/hooks/assetsHooks";
import NFTDrawerCard from "./NFTDrawerCard";
import NFTGallery from "./NFTGallery";
import { useDynamicModal } from "../../components/DynamicModal";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { BsArrowBarRight } from "react-icons/bs";
import colors from "../../style/colors";
import AddressPill from "../../components/AddressPill/AddressPill";
import { parsePkh } from "../../types/Address";

const NFTsViewBase = () => {
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
  const noNFTs = every(selectedNFTs, nfts => !nfts || nfts.length === 0);
  const drawerNFT = ownerPkh && (nfts[ownerPkh] || []).find(nft => fullId(nft) === nftId);

  return (
    <Flex direction="column" height="100%">
      <TopBar title="NFTs" />
      {accountsFilter}

      {noNFTs ? (
        <NoNFTs />
      ) : (
        <>
          <Box overflow="scroll">
            <NFTGallery
              onSelect={(owner, nft) => {
                navigate(`/nfts/${owner}/${fullId(nft)}`);
              }}
              nftsByOwner={selectedNFTs}
            />
          </Box>

          <Drawer
            blockScrollOnMount={!isDynamicModalOpen}
            placement="right"
            onClose={openNFTsPage}
            size="md"
            isOpen={!!drawerNFT}
            autoFocus={false}
          >
            <DrawerOverlay />
            <DrawerContent maxW="594px" bg={colors.gray[900]}>
              <DrawerBody>
                {drawerNFT && (
                  <>
                    <Flex
                      justifyContent="space-between"
                      color={colors.gray[400]}
                      cursor="pointer"
                      p={4}
                    >
                      <AddressPill address={parsePkh(ownerPkh)} />
                      <IconAndTextBtn onClick={openNFTsPage} label="Close" icon={BsArrowBarRight} />
                    </Flex>
                    <NFTDrawerCard nft={drawerNFT} ownerPkh={ownerPkh} />
                  </>
                )}
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </Flex>
  );
};

export default NFTsViewBase;
