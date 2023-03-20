import { useAppSelector } from "../../utils/store/hooks";

import { GridItem, Image, SimpleGrid } from "@chakra-ui/react";
export const NftList = () => {
  const tokens = useAppSelector((s) => s.assets.balances);

  const tokensList = Object.values(tokens).flatMap((b) => b.tokens);

  return (
    <SimpleGrid columns={4} spacing={4}>
      {tokensList.map((t, i) => {
        const url = t.token?.metadata?.displayUri?.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );

        return (
          <GridItem key={t.id} rowSpan={1} colSpan={1} bg="#363636">
            <Image
              key={url}
              objectFit="cover"
              width="100%"
              height={40}
              src={url}
            />
          </GridItem>
        );
      })}
    </SimpleGrid>
  );
};
