import { Box, Button, Divider, Flex, Text } from "@chakra-ui/react";

import { PlusIcon } from "../../assets/icons";
import { TrashIcon } from "../../assets/icons/Trash";
import { PopoverMenu } from "../../components/PopoverMenu";

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
            <TrashIcon stroke="inherit" />
          </Flex>
        </Button>
        {onCreate && (
          <>
            <Divider marginY="4px" />
            <Button onClick={onCreate} variant="popover">
              <Flex alignItems="center" justifyContent="space-between" flex={1}>
                <Text marginRight="4px">Create</Text>
                <PlusIcon width="18px" height="18px" stroke="inherit" />
              </Flex>
            </Button>
          </>
        )}
      </Box>
    </PopoverMenu>
  );
};
