import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAccountFilterWithMapFilter } from "../../components/AccountFilter";
import { NoNFTs } from "../../components/NoItems";
import { TopBar } from "../../components/TopBar";
import { NFT } from "../../types/Asset";
import { useAllNfts } from "../../utils/hooks/assetsHooks";
import { DrawerTopButtons } from "../home/DrawerTopButtons";
import NFTDrawerCard from "./NFTDrawerCard";
import NFTGallery from "./NFTGallery";

const NFTsViewBase = () => {
  const nfts = useAllNfts();
  const [selectedNft, setSelectedNft] = useState<NFT>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { nftId } = useParams();

  const { filterElement, filterMap: filter } = useAccountFilterWithMapFilter();
  const displayedNFTs = filter(nfts);
  const allOwnedNftsRef = useRef(displayedNFTs);
  const nftIdRef = useRef(nftId);
  const onOpenRef = useRef(onOpen);

  useEffect(() => {
    const nftId = nftIdRef.current;
    if (nftId) {
      const nft = allOwnedNftsRef.current.find(n => n.id === parseInt(nftId));
      setSelectedNft(nft);
      onOpenRef.current();
    }
  }, [allOwnedNftsRef, onOpenRef]);

  return (
    <Flex direction="column" height="100%">
      <TopBar title="NFTs" />

      {filterElement}
      {displayedNFTs.length > 0 ? (
        <>
          <Box overflow="scroll">
            <NFTGallery
              onSelect={nft => {
                onOpen();
                setSelectedNft(nft);
              }}
              nfts={displayedNFTs}
            />
          </Box>

          <Drawer placement="right" onClose={onClose} size="md" isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent maxW="594px" bg="umami.gray.900">
              <DrawerBody>
                <DrawerTopButtons onPrevious={() => {}} onNext={() => {}} onClose={onClose} />
                {selectedNft && <NFTDrawerCard nft={selectedNft} />}
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <NoNFTs />
      )}
    </Flex>
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default NFTsViewBase;
