import { Button, Divider, DrawerBody, DrawerContent, Heading } from "@chakra-ui/react";

import { useColor } from "../../styles/useColor";
import { DrawerBackButton } from "../BackButton";
import { DrawerCloseButton } from "../CloseButton";
import { EmptyMessage } from "../EmptyMessage";

export const AddressBookMenu = () => {
  const color = useColor();

  return (
    <DrawerContent>
      <DrawerBackButton />
      <DrawerCloseButton />
      <DrawerBody paddingTop="90px">
        <Heading color={color("900")} size="2xl">
          Address Book
        </Heading>
        <Button width="auto" marginTop="18px" padding="0 24px" variant="secondary">
          Add Contact
        </Button>

        <Divider marginTop={{ base: "36px", lg: "40px" }} />

        <EmptyMessage
          alignItems="flex-start"
          marginTop="40px"
          subtitle="Contacts"
          title="Contacts"
        />
      </DrawerBody>
    </DrawerContent>
  );
};
