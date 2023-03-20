import { useAppSelector } from "../../utils/store/hooks";

import { AspectRatio, GridItem, Image, SimpleGrid } from "@chakra-ui/react";
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
          <AspectRatio width={"100%"} ratio={4 / 4}>
            <Image key={t.id} width="100%" height={40} src={url} />
          </AspectRatio>
        );
      })}
    </SimpleGrid>
  );
};
