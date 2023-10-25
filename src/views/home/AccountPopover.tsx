import { Divider } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import PopoverMenu from "../../components/PopoverMenu";
import Trash from "../../assets/icons/Trash";
import colors from "../../style/colors";

const AccountPopover: React.FC<{
  onDelete: () => void;
  onCreate?: () => void;
}> = ({ onDelete, onCreate }) => {
  return (
    <PopoverMenu>
      <IconAndTextBtn
        label="Remove"
        icon={Trash}
        onClick={onDelete}
        textFirst
        stroke={colors.gray[400]}
      />
      {onCreate && (
        <>
          <Divider marginY={1} />
          <IconAndTextBtn label="Create" icon={AiOutlinePlus} onClick={onCreate} textFirst />
        </>
      )}
    </PopoverMenu>
  );
};

export default AccountPopover;
