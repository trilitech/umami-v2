import {
  Button,
  Center,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { BsThreeDots } from "react-icons/bs";
import colors from "../style/colors";

const PopoverMenu: React.FC<{
  children: ReactNode;
}> = props => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  return (
    <Popover placement="bottom-start" isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <Button
          bg={isOpen ? colors.green : colors.gray[500]}
          _hover={{ bg: isOpen ? colors.green : colors.gray[450] }}
          variant="unstyled"
          borderRadius="full"
          border="none"
          height="24px"
          minWidth="24px"
          data-testid="popover-cta"
          p="0"
        >
          <Center>
            <Icon display="inline" as={BsThreeDots} color={colors.white} />
          </Center>
        </Button>
      </PopoverTrigger>
      <PopoverContent w="100px" bg={colors.gray[900]}>
        <PopoverBody borderRadius="lg">{props.children}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverMenu;
