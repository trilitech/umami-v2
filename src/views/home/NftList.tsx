import { Link, TabList, Tabs } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { NFTsGrid } from "../../components/AccountCard/AssetsPanel/NFTsGrid";
import NestedScroll from "../../components/NestedScroll";
import SmallTab from "../../components/SmallTab";
import { useAllNfts } from "../../utils/hooks/assetsHooks";
import colors from "../../style/colors";
export const NftList = () => {
  const nfts = useAllNfts();

  return (
    <Tabs height="100%" display="flex" flexDirection="column" borderRadius={4}>
      <TabList justifyContent="space-between">
        <SmallTab>Recent NFTs</SmallTab>
        <Link
          as={ReactRouterLink}
          to="/nfts"
          marginTop="8px"
          display="inline-block"
          marginRight="12px"
          fontSize="14px"
          color={colors.gray[400]}
          _hover={{ color: colors.gray[300] }}
        >
          View All
        </Link>
      </TabList>

      <NestedScroll>
        <NFTsGrid nftsByOwner={nfts} columns={4} spacing={4} />
      </NestedScroll>
    </Tabs>
  );
};
