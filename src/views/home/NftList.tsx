import {
  AspectRatio,
  Box,
  Image,
  SimpleGrid,
  Tab,
  TabList,
  Tabs,
} from "@chakra-ui/react";
import { useAllNfts } from "../../utils/hooks/assetsHooks";
export const NftList = () => {
  const nfts = useAllNfts();

  const allOwnedNfts = Object.values(nfts).flat();

  return (
    <Tabs
      height={"100%"}
      display={"flex"}
      flexDirection="column"
      bg="umami.gray.900"
      borderRadius={4}
      // color scheme not working even when put in 50-900 range
      // TODO Fix
      // https://chakra-ui.com/docs/components/tabs
    >
      <TabList>
        <Tab>All NFTs</Tab>
      </TabList>
      <Box overflow={"scroll"} p={4}>
        <SimpleGrid columns={4} spacing={4}>
          {allOwnedNfts.map((nft, i) => {
            return (
              <AspectRatio key={nft.contract + i} width={"100%"} ratio={4 / 4}>
                <Image width="100%" height={40} src={nft.metadata.displayUri} />
              </AspectRatio>
            );
          })}
        </SimpleGrid>
      </Box>
    </Tabs>
  );
};
