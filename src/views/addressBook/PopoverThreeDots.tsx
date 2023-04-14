import {
  Button,
  Divider,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import colors from "../../style/colors";
import { Contact } from "../../types/Contact";
import { BiPencil } from "react-icons/bi";
import { useAppDispatch } from "../../utils/store/hooks";
import { contactsActions } from "../../utils/store/contactsSlice";
import {
  UpsertContactModal,
  DeleteContactModal,
} from "../../components/ContactModal";
import { BsThreeDots, BsTrash } from "react-icons/bs";
import { TextAndIconBtn } from "../../components/TextAndIconBtn";

const PopoverThreeDots: React.FC<{ contact: Contact }> = ({ contact }) => {
  const {
    isOpen: isOepnEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const dispatch = useAppDispatch();
  const onEditContact = (updatedContact: Contact) => {
    dispatch(contactsActions.upsert(updatedContact));
    onCloseEdit();
  };
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Button variant="unstyled">
            <Icon
              as={BsThreeDots}
              color={colors.gray[600]}
              _hover={{
                color: colors.gray[300],
              }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent w="100px" bg={colors.gray[900]}>
          <PopoverBody borderRadius="lg">
            <TextAndIconBtn
              text="Rename"
              icon={BiPencil}
              onClick={onOpenEdit}
            />
            <Divider marginY={1} />
            <TextAndIconBtn
              text="Remove"
              icon={BsTrash}
              onClick={onOpenDelete}
            />
          </PopoverBody>
        </PopoverContent>
      </Popover>

      <UpsertContactModal
        title="Edit Contact"
        buttonText="Update"
        isOpen={isOepnEdit}
        contactToEdit={contact}
        onSubmitContact={onEditContact}
        onClose={onCloseEdit}
      />
      <DeleteContactModal
        isOpen={isOpenDelete}
        contact={contact}
        onClose={onCloseDelete}
      />
    </>
  );
};

export default PopoverThreeDots;
