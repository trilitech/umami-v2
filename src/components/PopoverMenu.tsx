import {
  Button,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { BsThreeDots } from "react-icons/bs";
import colors from "../style/colors";

const PopoverMenu: React.FC<{
  children: ReactNode;
}> = (props) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="unstyled" data-testid="popover-cta">
          <Icon
            as={BsThreeDots}
            color={colors.gray[400]}
            _hover={{
              color: colors.gray[300],
            }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent w="100px" bg={colors.gray[900]}>
        <PopoverBody borderRadius="lg">{props.children}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverMenu;
