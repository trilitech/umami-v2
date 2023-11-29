import { Box, Button, Divider, Text, Flex } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { PopoverMenu } from "../../components/PopoverMenu";
import { TrashIcon } from "../../assets/icons/Trash";
import colors from "../../style/colors";

const AccountGroupPopover: React.FC<{
  onRemove: () => void;
  onCreate?: () => void;
}> = ({ onRemove, onCreate }) => {
  return (
    <PopoverMenu>
      <Box paddingY="0">
        <Button height={onCreate ? "24px" : "28px"} onClick={onRemove} variant="popover">
          <Flex alignItems="center" justifyContent="space-between" flex={1}>
            <Text marginRight="4px">Remove</Text>
            <TrashIcon />
          </Flex>
        </Button>
        {onCreate && (
          <>
            <Divider marginY="4px" />
            <Button onClick={onCreate} variant="popover">
              <Flex alignItems="center" justifyContent="space-between" flex={1}>
                <Text marginRight="4px">Create</Text>
                <AiOutlinePlus color={colors.gray[450]} />
              </Flex>
            </Button>
          </>
        )}
      </Box>
    </PopoverMenu>
  );
};

export default AccountGroupPopover;
