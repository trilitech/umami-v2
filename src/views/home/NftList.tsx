import { Tab, TabList, Tabs } from "@chakra-ui/react";
import { NFTsGrid } from "../../components/AccountCard/AssetsPannel/NFTsGrid";
import { useAllNfts } from "../../utils/hooks/assetsHooks";
export const NftList = () => {
  const nfts = useAllNfts();

  const allOwnedNfts = Object.values(nfts).flat();

  return (
    <Tabs
      height="100%"
      display="flex"
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
      <NFTsGrid nfts={allOwnedNfts} columns={4} spacing={4} />
    </Tabs>
  );
};
