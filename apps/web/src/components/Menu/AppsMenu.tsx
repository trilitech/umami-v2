import {
  Button,
  Divider,
  DrawerBody,
  DrawerContent,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useColor } from "../../styles/useColor";
import { DrawerBackButton } from "../BackButton";
import { CloseButton } from "../CloseButton";
import { EmptyMessage } from "../EmptyMessage";

export const AppsMenu = () => {
  const color = useColor();

  return (
    <DrawerContent>
      <DrawerBackButton />
      <CloseButton />
      <DrawerBody paddingTop="90px">
        <Heading color={color("900")} size="2xl">
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
