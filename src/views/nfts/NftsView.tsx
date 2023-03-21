import { Grid, GridItem } from "@chakra-ui/layout";
import { TopBar } from "../../components/TopBar";

export default function NFTsView() {
  return (
    // TODO refactor
    // Sorry we have to repeat all this boiler plate grid setup code.

    <Grid
      h="100%"
      templateAreas={`
                  "header header"
                  "main main"
                  "main main"
                  `}
      gridTemplateRows={"0fr 1fr 1fr"}
      gridTemplateColumns={"1fr 1fr"}
      gap="1"
    >
      <GridItem area={"header"}>
        <TopBar title="NFTs" />
      </GridItem>
      <GridItem area={"main"}></GridItem>
    </Grid>
  );
}
