import { Button, Divider, DrawerBody, DrawerContent, Heading, Text } from "@chakra-ui/react";

import { useColor } from "../../styles/useColor";
import { DrawerBackButton } from "../BackButton";
import { DrawerCloseButton } from "../CloseButton";
import { EmptyMessage } from "../EmptyMessage";

export const AppsMenu = () => {
  const color = useColor();

  return (
    <DrawerContent>
      <DrawerBackButton />
      <DrawerCloseButton />
      <DrawerBody paddingTop="90px">
        <Heading color={color("900")} size="2xl">
          Apps
        </Heading>
        <Text marginTop="12px" size="lg">
          Connect with Pairing Request
        </Text>
        <Button width="auto" marginTop="18px" padding="0 24px" variant="secondary">
          Connect
        </Button>

        <Divider marginTop={{ base: "36px", lg: "40px" }} />

        <EmptyMessage alignItems="flex-start" marginTop="40px" subtitle="Apps" title="Apps" />
      </DrawerBody>
    </DrawerContent>
  );
};
