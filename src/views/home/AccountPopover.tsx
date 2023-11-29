import { Divider } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { PopoverMenu } from "../../components/PopoverMenu";
import { TrashIcon } from "../../assets/icons";
import colors from "../../style/colors";

export const AccountPopover: React.FC<{
  onDelete: () => void;
  onCreate?: () => void;
}> = ({ onDelete, onCreate }) => {
  return (
    <PopoverMenu>
      <IconAndTextBtn icon={TrashIcon} label="Remove" onClick={onDelete} textFirst />
      {onCreate && (
        <>
          <Divider marginY={1} />
          <IconAndTextBtn
            icon={AiOutlinePlus}
            iconColor={colors.gray[450]}
            label="Create"
            onClick={onCreate}
            textFirst
          />
        </>
      )}
    </PopoverMenu>
  );
};
