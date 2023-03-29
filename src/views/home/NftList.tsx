import { useAppSelector } from "../../utils/store/hooks";

import {
  AspectRatio,
  Box,
  Image,
  SimpleGrid,
  Tab,
  TabList,
  Tabs,
} from "@chakra-ui/react";
import { getIPFSurl } from "../../utils/token/nftUtils";
export const NftList = () => {
  const tokens = useAppSelector((s) => s.assets.balances.tokens);

  const tokensList = Object.values(tokens).flat();

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
          {tokensList.map((t, i) => {
            const displayUri = t.token?.metadata?.displayUri;

            const url = displayUri && getIPFSurl(displayUri);
            return (
              <AspectRatio key={t.id} width={"100%"} ratio={4 / 4}>
                <Image width="100%" height={40} src={url} />
              </AspectRatio>
            );
          })}
        </SimpleGrid>
      </Box>
    </Tabs>
  );
};
