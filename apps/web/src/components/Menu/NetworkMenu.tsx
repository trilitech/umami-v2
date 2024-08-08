import { Button, Divider, Radio, RadioGroup, Stack, VStack } from "@chakra-ui/react";
import { useSelectNetwork, useSelectedNetwork } from "@umami/state";

import { DrawerContentWrapper } from "./DrawerContentWrapper";

export const NetworkMenu = () => {
  const selectNetwork = useSelectNetwork();
  const currentNetwork = useSelectedNetwork();

  return (
    <DrawerContentWrapper title="Network">
      <Button width="fit-content" marginTop="18px" padding="0 24px" variant="secondary">
        Add New
      </Button>
      <Divider marginTop={{ base: "36px", lg: "40px" }} />
      <VStack alignItems="flex-start" gap="24px" marginTop="24px" divider={<Divider />} spacing="0">
        <RadioGroup onChange={selectNetwork} value={currentNetwork.name}>
          <Stack direction="column">
            <Radio value="mainnet">Mainnet</Radio>
            <Radio value="ghostnet">Ghostnet</Radio>
          </Stack>
        </RadioGroup>
      </VStack>
    </DrawerContentWrapper>
  );
};
