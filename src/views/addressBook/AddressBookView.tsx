import { Grid, GridItem } from "@chakra-ui/layout";
import { TopBar } from "../../components/TopBar";

export default function AddressBookView() {
  return (
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
        <TopBar title="Address Book" />
      </GridItem>
      <GridItem area={"main"}></GridItem>
    </Grid>
  );
}
