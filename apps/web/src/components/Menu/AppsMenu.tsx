import { Button, Divider, Text } from "@chakra-ui/react";

import { DrawerContentWrapper } from "./DrawerContentWrapper";
import { EmptyMessage } from "../EmptyMessage";

export const AppsMenu = () => (
  <DrawerContentWrapper title="Apps">
    <Text marginTop="12px" size="lg">
      Connect with Pairing Request
    </Text>
    <Button width="fit-content" marginTop="18px" padding="0 24px" variant="secondary">
      Connect
    </Button>
    <Divider marginTop={{ base: "36px", lg: "40px" }} />
    <EmptyMessage alignItems="flex-start" marginTop="40px" subtitle="Apps" title="Apps" />
  </DrawerContentWrapper>
);
