import {
  AspectRatio,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { BsArrowDownUp } from "react-icons/bs";
import { TbFilter } from "react-icons/tb";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { TopBar } from "../../components/TopBar";
import { NFT } from "../../types/Asset";
import { useAllNfts } from "../../utils/hooks/assetsHooks";
import { DrawerTopButtons } from "../home/DrawerTopButtons";
import { useSendFormModal } from "../home/useSendFormModal";
import NFTGallery from "./NFTGallery";

export const FilterController: React.FC = () => {
  return (
    <Flex alignItems={"center"} mb={4} mt={4}>
      <IconAndTextBtn icon={TbFilter} label="Filter" flex={1} />
      <IconAndTextBtn icon={BsArrowDownUp} label="Sort by Newest" mr={4} />
      <IconAndTextBtn icon={AiOutlineUnorderedList} label="List View" />
    </Flex>
  );
};

const NFTDrawerCard = ({ nft }: { nft: NFT }) => {
  const { modalElement, onOpen } = useSendFormModal();
  return (
    <Box>
      <AspectRatio width={"100%"} ratio={4 / 4}>
        <Image width="100%" src={nft.metadata.displayUri} />
      </AspectRatio>
      <Heading mt={4} size="lg">
        {nft.metadata.name}
      </Heading>

      <Button
        mt={4}
        bg="umami.blue"
        onClick={(_) => {
          onOpen({
            mode: {
              type: "nft",
              data: nft,
            },
          });
        }}
      >
        Send
      </Button>
      {modalElement}
    </Box>
  );
};
const NFTsViewBase = () => {
  const nfts = useAllNfts();

  const allOwnedNfts = Object.values(nfts).flat();

  const [selectedNft, setSelectedNft] = useState<NFT>();
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Flex direction="column" height={"100%"}>
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
        <DrawerContent bg="umami.gray.900">
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
    </Flex>
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default NFTsViewBase;
