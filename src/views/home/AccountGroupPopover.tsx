import { Box, Button, Divider, Flex, Text } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";

import { TrashIcon } from "../../assets/icons/Trash";
import { PopoverMenu } from "../../components/PopoverMenu";
import colors from "../../style/colors";

export const AccountGroupPopover: React.FC<{
  onRemove: () => void;
  onCreate?: () => void;
}> = ({ onRemove, onCreate }) => {
  return (
    <PopoverMenu>
      <Box paddingY="0">
        <Button
          height={onCreate ? "24px" : "28px"}
          data-testid="popover-remove"
          onClick={onRemove}
          variant="popover"
        >
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
