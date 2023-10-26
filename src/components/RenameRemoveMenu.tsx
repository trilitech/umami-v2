import { Button, Divider, Flex, Icon } from "@chakra-ui/react";
import { BiPencil } from "react-icons/bi";
import PopoverMenu from "./PopoverMenu";
import { Text, Box } from "@chakra-ui/react";
import Trash from "../assets/icons/Trash";
import colors from "../style/colors";

const RenameRemoveMenu: React.FC<{ onRename: () => void; onRemove?: () => void }> = ({
  onRename,
  onRemove,
}) => {
  return (
    <Flex alignItems="center">
      <PopoverMenu>
        <Box py="0">
          <Button variant="unstyled" h="24px" onClick={onRename}>
            <Flex alignItems="center">
              <Text mr="4px" color={colors.gray[300]}>
                Rename
              </Text>
              <Icon as={BiPencil} color={colors.gray[450]} />
            </Flex>
          </Button>
          {onRemove && (
            <>
              <Divider my="4px" />
              <Button variant="unstyled" h="24px" onClick={onRemove}>
                <Flex alignItems="center">
                  <Text mr="4px" color={colors.gray[300]}>
                    Remove
                  </Text>
                  <Icon as={Trash} />
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
