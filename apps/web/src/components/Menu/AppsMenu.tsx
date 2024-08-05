import {
  Button,
  Divider,
  DrawerBody,
  DrawerContent,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useDynamicDrawerContext } from "@umami/components";

import { useColor } from "../../styles/useColor";
import { EmptyMessage } from "../EmptyMessage";
import { ModalCloseButton } from "../ModalCloseButton";
import { ModalBackButton } from "../Onboarding/ModalBackButton";

export const AppsMenu = () => {
  const { goBack } = useDynamicDrawerContext();
  const color = useColor();

  return (
    <DrawerContent>
      <ModalBackButton onClick={goBack} />
      <ModalCloseButton />
      <DrawerBody paddingTop="90px">
        <Heading color={color("900")} fontSize="24px">
          Apps
        </Heading>
        <Text marginTop="12px" size="lg">
          Connect with Pairing Request
        </Text>
        <VStack
          alignItems="flex-start"
          gap="40px"
          marginTop="18px"
          divider={<Divider color={color("100")} />}
        >
          <Button width="auto" padding="0 24px" variant="secondary">
            Connect
          </Button>
          <EmptyMessage alignItems="flex-start" subtitle="Apps" title="Apps" />
        </VStack>
      </DrawerBody>
    </DrawerContent>
  );
};
