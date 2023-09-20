import { Divider } from "@chakra-ui/react";
import { BiPencil } from "react-icons/bi";
import { DeleteContactModal } from "../../components/ContactModal";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import PopoverMenu from "../../components/PopoverMenu";
import { Contact } from "../../types/Contact";
import { useOpenUpsertContactModal } from "../home/useUpsertContactModal";
import Trash from "../../assets/icons/Trash";
import { useContext } from "react";
import { DynamicModalContext } from "../../components/DynamicModal";

const ContactMenu: React.FC<{ contact: Contact }> = ({ contact }) => {
  const { openWith } = useContext(DynamicModalContext);
  const openContactModal = useOpenUpsertContactModal();

  return (
    <>
      <PopoverMenu>
        <IconAndTextBtn
          label="Rename"
          icon={BiPencil}
          onClick={() =>
            openContactModal({
              title: "Edit contact",
              buttonText: "Update",
              contact: contact,
            })
          }
          textFirst
        />
        <Divider marginY={1} />
        <IconAndTextBtn
          label="Remove"
          icon={Trash}
          onClick={() => {
            openWith(<DeleteContactModal contact={contact} />);
          }}
          textFirst
        />
      </PopoverMenu>
    </>
  );
};

export default ContactMenu;
