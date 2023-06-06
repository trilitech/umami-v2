import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { BsArrowDownUp } from "react-icons/bs";
import { TbFilter } from "react-icons/tb";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { TopBar } from "../../components/TopBar";
import { NFT } from "../../types/Asset";
import { useAllNfts } from "../../utils/hooks/assetsHooks";
import { DrawerTopButtons } from "../home/DrawerTopButtons";
import NFTDrawerCard from "./NFTDrawerCard";
import NFTGallery from "./NFTGallery";
import { useParams } from "react-router-dom";
import NoItems from "../../components/NoItems";
import { navigateToExternalLink } from "../../utils/helpers";

export const FilterController: React.FC = () => {
  return (
    <Flex alignItems={"center"} mb={4} mt={4}>
      <IconAndTextBtn icon={TbFilter} label="Filter" flex={1} />
      <IconAndTextBtn icon={BsArrowDownUp} label="Sort by Newest" mr={4} />
      <IconAndTextBtn icon={AiOutlineUnorderedList} label="List View" />
    </Flex>
  );
};

const NFTsViewBase = () => {
  const nfts = useAllNfts();
  const allOwnedNfts = Object.values(nfts).flat();
  const [selectedNft, setSelectedNft] = useState<NFT>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { nftId } = useParams();

  const allOwnedNftsRef = useRef(allOwnedNfts);
  const nftIdRef = useRef(nftId);
  const onOpenRef = useRef(onOpen);

  useEffect(() => {
    const nftId = nftIdRef.current;
    if (nftId) {
      const nft = allOwnedNftsRef.current.find((n) => n.id === parseInt(nftId));
      setSelectedNft(nft);
      onOpenRef.current();
    }
  }, [allOwnedNftsRef, onOpenRef]);

  return (
    <Flex direction="column" height={"100%"}>
      {allOwnedNfts.length > 0 ? (
        <>
          <TopBar title="NFTs" />
          <FilterController />
          <Box overflow={"scroll"}>
            <NFTGallery
              onSelect={(nft) => {
                onOpen();
                setSelectedNft(nft);
              }}
              nfts={allOwnedNfts}
            />
          </Box>

          <Drawer placement="right" onClose={onClose} size="md" isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent maxW="594px" bg="umami.gray.900">
              <DrawerBody>
                <DrawerTopButtons
                  onPrevious={() => {}}
                  onNext={() => {}}
                  onClose={onClose}
                />
                {selectedNft && <NFTDrawerCard nft={selectedNft} />}
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <NoItems
          text="No NFTs found"
          primaryText="Buy your first NFT"
          onClickPrimary={() => {
            navigateToExternalLink(`https://objkt.com`);
          }}
        />
      )}
    </Flex>
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default NFTsViewBase;
