import { useAppSelector } from "../../utils/store/hooks";

import { Grid, GridItem, Image } from "@chakra-ui/react";
export const NftList = () => {
  const tokens = useAppSelector((s) => s.assets.balances);

  const tokensList = Object.values(tokens).flatMap((b) => b.tokens);

  return (
    <Grid
      h="800px"
      templateRows="repeat(12, 1fr)"
      templateColumns="repeat(6, 1fr)"
      gap={4}
    >
      {tokensList.map((t, i) => {
        const url = t.token?.metadata?.displayUri?.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );

        return (
          <GridItem key={t.id} rowSpan={1} colSpan={1} bg="#363636">
            <Image key={url} boxSize="100px" objectFit="cover" src={url} />
          </GridItem>
        );

        //   <AccountTile
        //     selected={a.pkh === selected}
        //     onClick={(_) => dispatch(setSelected(a.pkh))}
        //     key={a.pkh}
        //     address={a.pkh}
        //     label="bar"
        //     balance={balance}
        //   />
      })}
    </Grid>
  );
};
