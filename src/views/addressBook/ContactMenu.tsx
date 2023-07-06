import { Divider, useDisclosure } from "@chakra-ui/react";
import { BiPencil } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { DeleteContactModal } from "../../components/ContactModal";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import PopoverMenu from "../../components/PopoverMenu";
import { Contact } from "../../types/Contact";
import { useUpsertContactModal } from "../home/useUpsertContactModal";

const ContactMenu: React.FC<{ contact: Contact }> = ({ contact }) => {
  const { modalElement: editModal, onOpen: onOpenEdit } = useUpsertContactModal();

  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  return (
    <>
      <PopoverMenu>
        <IconAndTextBtn
          label="Rename"
          icon={BiPencil}
          onClick={() =>
            onOpenEdit({
              title: "Edit contact",
              buttonText: "Update",
              contact: contact,
            })
          }
          textFirst
        />
        <Divider marginY={1} />
        <IconAndTextBtn label="Remove" icon={BsTrash} onClick={onOpenDelete} textFirst />
      </PopoverMenu>
      {editModal}
      <DeleteContactModal isOpen={isOpenDelete} contact={contact} onClose={onCloseDelete} />
    </>
  );
};

export default ContactMenu;
