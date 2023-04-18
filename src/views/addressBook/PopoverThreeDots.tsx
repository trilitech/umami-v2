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
import { DeleteContactModal } from "../../components/ContactModal";
import { BsThreeDots, BsTrash } from "react-icons/bs";
import { TextAndIconBtn } from "../../components/TextAndIconBtn";
import { useUpsertContactModal } from "../home/useUpsertContactModal";

const PopoverThreeDots: React.FC<{ contact: Contact }> = ({ contact }) => {
  const { modalElement: editModal, onOpen: onOpenEdit } =
    useUpsertContactModal();

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

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
              onClick={() =>
                onOpenEdit({
                  title: "Edit contact",
                  buttonText: "Update",
                  isEdit: true,
                  contactToDisplay: contact,
                })
              }
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

      {editModal}
      <DeleteContactModal
        isOpen={isOpenDelete}
        contact={contact}
        onClose={onCloseDelete}
      />
    </>
  );
};

export default PopoverThreeDots;
