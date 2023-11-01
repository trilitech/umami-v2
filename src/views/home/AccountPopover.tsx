import { Divider } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import PopoverMenu from "../../components/PopoverMenu";
import TrashIcon from "../../assets/icons/Trash";
import colors from "../../style/colors";

const AccountPopover: React.FC<{
  onDelete: () => void;
  onCreate?: () => void;
}> = ({ onDelete, onCreate }) => {
  return (
    <PopoverMenu>
      <IconAndTextBtn label="Remove" icon={TrashIcon} onClick={onDelete} textFirst />
      {onCreate && (
        <>
          <Divider marginY={1} />
          <IconAndTextBtn
            label="Create"
            icon={AiOutlinePlus}
            iconColor={colors.gray[450]}
            onClick={onCreate}
            textFirst
          />
        </>
      )}
    </PopoverMenu>
  );
};

export default AccountPopover;
