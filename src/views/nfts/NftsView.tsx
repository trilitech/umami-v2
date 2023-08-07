import { Box, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Flex } from "@chakra-ui/react";
import { every, pick } from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import { NoNFTs } from "../../components/NoItems";
import { TopBar } from "../../components/TopBar";
import { useAccountsFilter } from "../../components/useAccountsFilter";
import { fullId } from "../../types/Token";
import { useAllNfts } from "../../utils/hooks/assetsHooks";
import { DrawerTopButtons } from "../home/DrawerTopButtons";
import NFTDrawerCard from "./NFTDrawerCard";
import NFTGallery from "./NFTGallery";

const NFTsViewBase = () => {
  const nfts = useAllNfts();
  const { accountsFilter, selectedAccounts } = useAccountsFilter();
  const navigate = useNavigate();
  const { ownerPkh, nftId } = useParams();

  const drawerOnClose = () => {
    navigate(`/nfts`);
  };
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
            placement="right"
            onClose={drawerOnClose}
            size="md"
            isOpen={!!drawerNFT}
            autoFocus={false}
          >
            <DrawerOverlay />
            <DrawerContent maxW="594px" bg="umami.gray.900">
              <DrawerBody>
                <DrawerTopButtons onClose={drawerOnClose} />
                {drawerNFT && <NFTDrawerCard nft={drawerNFT} ownerPkh={ownerPkh} />}
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </Flex>
  );
};

export default NFTsViewBase;
