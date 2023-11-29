import { Button, Divider, Flex, Text, Box } from "@chakra-ui/react";
import { PenIcon, TrashIcon } from "../assets/icons";
import { PopoverMenu } from "./PopoverMenu";

export const RenameRemoveMenu: React.FC<{ onRename: () => void; onRemove?: () => void }> = ({
  onRename,
  onRemove,
}) => {
  return (
    <Flex alignItems="center">
      <PopoverMenu>
        <Box paddingY="0">
          <Button height={onRemove ? "24px" : "28px"} onClick={onRename} variant="popover">
            <Flex alignItems="center">
              <Text marginRight="4px">Rename</Text>
              <PenIcon />
            </Flex>
          </Button>
          {onRemove && (
            <>
              <Divider marginY="4px" />
              <Button onClick={onRemove} variant="popover">
                <Flex alignItems="center">
                  <Text marginRight="4px">Remove</Text>
                  <TrashIcon />
                </Flex>
              </Button>
            </>
          )}
        </Box>
      </PopoverMenu>
    </Flex>
  );
};
