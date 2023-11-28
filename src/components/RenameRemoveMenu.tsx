import { Button, Divider, Flex } from "@chakra-ui/react";
import PopoverMenu from "./PopoverMenu";
import { Text, Box } from "@chakra-ui/react";
import TrashIcon from "../assets/icons/Trash";
import PenIcon from "../assets/icons/Pen";

const RenameRemoveMenu: React.FC<{ onRename: () => void; onRemove?: () => void }> = ({
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

export default RenameRemoveMenu;
