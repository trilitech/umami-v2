import { Divider } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import PopoverMenu from "../../components/PopoverMenu";

const AccountPopover: React.FC<{
  onDelete: () => void;
  onCreate: () => void;
}> = ({ onDelete, onCreate }) => {
  return (
    <PopoverMenu>
      <IconAndTextBtn label="Remove" icon={BsTrash} onClick={onDelete} textFirst />
      <Divider marginY={1} />
      <IconAndTextBtn label="Create" icon={AiOutlinePlus} onClick={onCreate} textFirst />
    </PopoverMenu>
  );
};

export default AccountPopover;
