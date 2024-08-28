import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useDynamicDrawerContext, useDynamicModalContext } from "@umami/components";
import { type Contact } from "@umami/core";
import { useSortedContacts } from "@umami/state";

import { DeleteContactModal } from "./DeleteContactModal";
import { EditContactMenu } from "./EditContactMenu";
import { EditIcon, ThreeDotsIcon, TrashIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { ActionsDropdown } from "../../ActionsDropdown";
import { CopyAddressButton } from "../../CopyAddressButton";
import { EmptyMessage } from "../../EmptyMessage";
import { DrawerContentWrapper } from "../DrawerContentWrapper";

type ContactItemProps = {
  contact: Contact;
};

const ContactItem = ({ contact }: ContactItemProps) => {
  const { openWith: openDrawer } = useDynamicDrawerContext();
  const { openWith: openModal } = useDynamicModalContext();
  const color = useColor();

  const isLongAddress = useBreakpointValue({ base: false, md: true });

  const actions = (
    <Box>
      <Button
        data-testid="edit-network"
        onClick={e => {
          e.stopPropagation();
          return openDrawer(<EditContactMenu contact={contact} />);
        }}
        variant="dropdownOption"
      >
        <EditIcon />
        <Text color={color("900")} fontWeight="600">
          Edit
        </Text>
      </Button>
      <Button
        data-testid="remove-network"
        onClick={() => openModal(<DeleteContactModal contact={contact} />)}
        variant="dropdownOption"
      >
        <TrashIcon />
        <Text color={color("900")} fontWeight="600">
          Remove
        </Text>
      </Button>
    </Box>
  );

  return (
    <Center
      key={contact.pkh}
      alignItems="center"
      justifyContent="space-between"
      width="full"
      height="60px"
      data-testid="peer-row"
    >
      <Flex height="100%">
        <Center alignItems="flex-start" flexDirection="column" gap="6px">
          <Heading color={color("900")} size="lg">
            {contact.name}
          </Heading>
          <CopyAddressButton address={contact.pkh} isLong={isLongAddress} />
        </Center>
      </Flex>
      <ActionsDropdown actions={actions}>
        <IconButton color={color("500")} aria-label="Remove Peer" icon={<ThreeDotsIcon />} />
      </ActionsDropdown>
    </Center>
  );
};

export const AddressBookMenu = () => {
  const { openWith } = useDynamicDrawerContext();
  const contacts = useSortedContacts();

  return (
    <DrawerContentWrapper title="Address book">
      <Button
        width="fit-content"
        marginTop="18px"
        padding="0 24px"
        onClick={() => openWith(<EditContactMenu />)}
        variant="secondary"
      >
        Add Contact
      </Button>
      <Divider marginTop={{ base: "36px", lg: "40px" }} />
      {contacts.length ? (
        <VStack
          alignItems="flex-start"
          gap="24px"
          marginTop="24px"
          divider={<Divider />}
          spacing="0"
        >
          {contacts.map(contact => (
            <ContactItem key={contact.pkh} contact={contact} />
          ))}
        </VStack>
      ) : (
        <EmptyMessage
          alignItems="flex-start"
          marginTop="40px"
          subtitle="Your Contacts will appear here..."
          title="No Contacts to show"
        />
      )}
    </DrawerContentWrapper>
  );
};
