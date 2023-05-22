import { Divider } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import PopoverMenu from "../../components/PopoverMenu";
import { TextAndIconBtn } from "../../components/TextAndIconBtn";

const AccountPopover: React.FC<{
  onDelete: () => void;
  onCreate: () => void;
}> = ({ onDelete, onCreate }) => {
  return (
    <PopoverMenu>
      <TextAndIconBtn text="Remove" icon={BsTrash} onClick={onDelete} />
      <Divider marginY={1} />
      <TextAndIconBtn text="Create" icon={AiOutlinePlus} onClick={onCreate} />
    </PopoverMenu>
  );
};

export default AccountPopover;
