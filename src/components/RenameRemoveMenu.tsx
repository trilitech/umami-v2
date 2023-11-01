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
        <Box py="0">
          <Button variant="popover" h={onRemove ? "24px" : "28px"} onClick={onRename}>
            <Flex alignItems="center">
              <Text mr="4px">Rename</Text>
              <PenIcon />
            </Flex>
          </Button>
          {onRemove && (
            <>
              <Divider my="4px" />
              <Button variant="popover" onClick={onRemove}>
                <Flex alignItems="center">
                  <Text mr="4px">Remove</Text>
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
