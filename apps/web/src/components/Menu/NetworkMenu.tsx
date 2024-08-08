import {
  Button,
  Divider,
  DrawerBody,
  DrawerContent,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useSelectNetwork, useSelectedNetwork } from "@umami/state";

import { useColor } from "../../styles/useColor";
import { DrawerBackButton } from "../BackButton";
import { DrawerCloseButton } from "../CloseButton";

export const NetworkMenu = () => {
  const selectNetwork = useSelectNetwork();
  const currentNetwork = useSelectedNetwork();

  const color = useColor();

  return (
    <DrawerContent>
      <DrawerBackButton />
      <DrawerCloseButton />
      <DrawerBody paddingTop="90px">
        <Heading color={color("900")} size="2xl">
          Network
        </Heading>
        <Button width="auto" marginTop="18px" padding="0 24px" variant="secondary">
          Add New
        </Button>

        <Divider marginTop={{ base: "36px", lg: "40px" }} />

        <VStack
          alignItems="flex-start"
          gap="24px"
          marginTop="24px"
          divider={<Divider />}
          spacing="0"
        >
          <RadioGroup onChange={selectNetwork} value={currentNetwork.name}>
            <Stack direction="column">
              <Radio value="mainnet">Mainnet</Radio>
              <Radio value="ghostnet">Ghostnet</Radio>
            </Stack>
          </RadioGroup>
        </VStack>
      </DrawerBody>
    </DrawerContent>
  );
};
