import { Button, Divider } from "@chakra-ui/react";

import { DrawerContentWrapper } from "./DrawerContentWrapper";
import { EmptyMessage } from "../EmptyMessage";

export const AddressBookMenu = () => (
  <DrawerContentWrapper title="Address book">
    <Button width="fit-content" marginTop="18px" padding="0 24px" variant="secondary">
      Add Contact
    </Button>
    <Divider marginTop={{ base: "36px", lg: "40px" }} />
    <EmptyMessage alignItems="flex-start" marginTop="40px" subtitle="Contacts" title="Contacts" />
  </DrawerContentWrapper>
);
