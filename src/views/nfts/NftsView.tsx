import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { BsArrowDownUp } from "react-icons/bs";
import { TbFilter } from "react-icons/tb";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { TopBar } from "../../components/TopBar";
import { useAllNfts } from "../../utils/hooks/assetsHooks";
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

const NFTsViewBase = () => {
  const nfts = useAllNfts();
  const allNfts = Object.values(nfts).flat();

  return (
    <Flex direction="column" height={"100%"}>
      <TopBar title="NFTs" />
      <FilterController />
      <Box overflow={"scroll"}>
        <NFTGallery nfts={allNfts} />
      </Box>
    </Flex>
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default NFTsViewBase;
