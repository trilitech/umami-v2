import {
  Box,
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
        <VStack
          alignItems="flex-start"
          gap="40px"
          marginTop="18px"
          divider={<Divider color={color("100")} />}
        >
          <Button width="auto" padding="0 24px" variant="secondary">
            Add New
          </Button>
          <Box>
            <RadioGroup onChange={selectNetwork} value={currentNetwork.name}>
              <Stack direction="column">
                <Radio value="mainnet">Mainnet</Radio>
                <Radio value="ghostnet">Ghostnet</Radio>
              </Stack>
            </RadioGroup>
          </Box>
        </VStack>
      </DrawerBody>
    </DrawerContent>
  );
};
