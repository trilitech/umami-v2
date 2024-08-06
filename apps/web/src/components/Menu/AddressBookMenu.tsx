import { Button, Divider, DrawerBody, DrawerContent, Heading, VStack } from "@chakra-ui/react";

import { useColor } from "../../styles/useColor";
import { DrawerBackButton } from "../BackButton";
import { EmptyMessage } from "../EmptyMessage";
import { ModalCloseButton } from "../ModalCloseButton";

export const AddressBookMenu = () => {
  const color = useColor();

  return (
    <DrawerContent>
      <DrawerBackButton />
      <ModalCloseButton />
      <DrawerBody paddingTop="90px">
        <Heading color={color("900")} fontSize="24px">
          Address Book
        </Heading>
        <VStack
          alignItems="flex-start"
          gap="40px"
          marginTop="18px"
          divider={<Divider color={color("100")} />}
        >
          <Button width="auto" padding="0 24px" variant="secondary">
            Add Contact
          </Button>
          <EmptyMessage alignItems="flex-start" subtitle="contacts" title="Contacts" />
        </VStack>
      </DrawerBody>
    </DrawerContent>
  );
};
