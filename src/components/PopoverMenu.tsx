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

export const PopoverMenu: React.FC<{
  children: ReactNode;
}> = props => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  return (
    <Popover isOpen={isOpen} onClose={onClose} onOpen={onOpen} placement="bottom-start">
      <PopoverTrigger>
        <Button
          minWidth="24px"
          height="24px"
          padding="0"
          background={isOpen ? colors.green : colors.gray[500]}
          border="none"
          borderRadius="full"
          _hover={{ bg: isOpen ? colors.green : colors.gray[450] }}
          data-testid="popover-cta"
          variant="unstyled"
        >
          <Center>
            <Icon as={BsThreeDots} display="inline" color={colors.white} />
          </Center>
        </Button>
      </PopoverTrigger>
      <PopoverContent width="100px" background={colors.gray[700]}>
        <PopoverBody borderRadius="lg">{props.children}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
