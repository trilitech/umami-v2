import { Divider, useDisclosure } from "@chakra-ui/react";
import { BiPencil } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { DeleteContactModal } from "../../components/ContactModal";
import PopoverMenu from "../../components/PopoverMenu";
import { TextAndIconBtn } from "../../components/TextAndIconBtn";
import { Contact } from "../../types/Contact";
import { useUpsertContactModal } from "../home/useUpsertContactModal";

const ContactMenu: React.FC<{ contact: Contact }> = ({ contact }) => {
  const { modalElement: editModal, onOpen: onOpenEdit } = useUpsertContactModal();

  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  return (
    <>
      <PopoverMenu>
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
        <TextAndIconBtn text="Remove" icon={BsTrash} onClick={onOpenDelete} />
      </PopoverMenu>
      {editModal}
      <DeleteContactModal isOpen={isOpenDelete} contact={contact} onClose={onCloseDelete} />
    </>
  );
};

export default ContactMenu;
