import { Divider, useDisclosure } from "@chakra-ui/react";
import { BiPencil } from "react-icons/bi";
import { DeleteContactModal } from "../../components/ContactModal";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import PopoverMenu from "../../components/PopoverMenu";
import { Contact } from "../../types/Contact";
import { useUpsertContactModal } from "../home/useUpsertContactModal";
import Trash from "../../assets/icons/Trash";

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
        <IconAndTextBtn label="Remove" icon={Trash} onClick={onOpenDelete} textFirst />
      </PopoverMenu>
      {editModal}
      <DeleteContactModal isOpen={isOpenDelete} contact={contact} onClose={onCloseDelete} />
    </>
  );
};

export default ContactMenu;
