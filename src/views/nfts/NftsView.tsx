import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { every, pick, sumBy } from "lodash";
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
import colors from "../../style/colors";
import AddressPill from "../../components/AddressPill/AddressPill";
import { parsePkh } from "../../types/Address";
import { CloseDrawerButton } from "../home/DrawerTopButtons";

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
  const totalNFTs = sumBy(Object.values(selectedNFTs).flat(), nft => Number(nft?.balance || 0));

  const noNFTs = every(selectedNFTs, nfts => !nfts || nfts.length === 0);
  const drawerNFT = ownerPkh && (nfts[ownerPkh] || []).find(nft => fullId(nft) === nftId);

  return (
    <Flex direction="column" height="100%">
      <TopBar
        title={
          <Flex alignItems="end">
            <Heading size="xl" mr="6px">
              NFTs
            </Heading>
            <Text size="xs" color={colors.gray[450]}>
              ({totalNFTs})
            </Text>
          </Flex>
        }
      />
      {accountsFilter}

      {noNFTs ? (
        <NoNFTs />
      ) : (
        <>
          <Box overflowY="scroll">
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
            isOpen={!!drawerNFT}
            autoFocus={false}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerBody>
                {drawerNFT && (
                  <>
                    <Flex
                      justifyContent="space-between"
                      color={colors.gray[400]}
                      cursor="pointer"
                      alignItems="center"
                      paddingBottom="30px"
                    >
                      <AddressPill address={parsePkh(ownerPkh)} />
                      <CloseDrawerButton onClose={openNFTsPage} />
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
