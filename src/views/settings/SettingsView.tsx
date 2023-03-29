import { Button } from "@chakra-ui/button";
import { Grid, GridItem } from "@chakra-ui/layout";
import { TopBar } from "../../components/TopBar";
import { useReset } from "../../utils/hooks/accountHooks";

export default function SettingsView() {
  const reset = useReset();
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
      ml={5}
    >
      <GridItem area={"header"}>
        <TopBar title="Settings" />
        <Button onClick={reset}>logout</Button>
      </GridItem>
      <GridItem area={"main"}></GridItem>
    </Grid>
  );
}
