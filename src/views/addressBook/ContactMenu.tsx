import { Divider, Flex } from "@chakra-ui/react";
import { BiPencil } from "react-icons/bi";
import { DeleteContactModal, UpsertContactModal } from "../../components/ContactModal";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import PopoverMenu from "../../components/PopoverMenu";
import { Contact } from "../../types/Contact";
import Trash from "../../assets/icons/Trash";
import { useContext } from "react";
import { DynamicModalContext } from "../../components/DynamicModal";

const ContactMenu: React.FC<{ contact: Contact }> = ({ contact }) => {
  const { openWith } = useContext(DynamicModalContext);

  return (
    <Flex alignItems="center">
      <PopoverMenu>
        <IconAndTextBtn
          label="Rename"
          icon={BiPencil}
          onClick={() =>
            openWith(
              <UpsertContactModal title="Edit contact" buttonText="Update" contact={contact} />
            )
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
    </Flex>
  );
};

export default ContactMenu;
