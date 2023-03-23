import { useDisclosure } from "@chakra-ui/hooks";
import Icon from "@chakra-ui/icon";
import { Flex } from "@chakra-ui/layout";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
} from "@chakra-ui/react";
import { BsArrowBarRight, BsArrowLeft, BsArrowRight } from "react-icons/bs";
import AccountCard from "../../components/AccountCard.tsx";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import accountsSlice from "../../utils/store/accountsSlice";
import { useAppDispatch } from "../../utils/store/hooks";

const TopButons: React.FC<{
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}> = ({ onPrevious, onNext, onClose }) => {
  return (
    <Flex
      justifyContent={"space-between"}
      color="umami.gray.400"
      cursor="pointer"
      p={4}
    >
      <Box>
        <Icon
          onClick={onPrevious}
          cursor="pointer"
          w={6}
          h={6}
          ml={2}
          mr={1}
          as={BsArrowLeft}
        />
        <Icon
          onClick={onNext}
          cursor="pointer"
          w={6}
          h={6}
          ml={1}
          mr={4}
          as={BsArrowRight}
        />
      </Box>
      <IconAndTextBtn onClick={onClose} label="Close" icon={BsArrowBarRight} />
    </Flex>
  );
};

const AccountDisplayDrawer: React.FC<{
  initiator: (onOpen: () => void) => React.ReactElement;
}> = (props) => {
  const dispatch = useAppDispatch();

  const { isOpen, onClose: closeDrawer, onOpen } = useDisclosure();
  const handleClose = () => {
    dispatch(accountsSlice.actions.setSelected(null));
    closeDrawer();
  };

  const el = props.initiator(onOpen);

  return (
    <>
      {el}
      <Drawer isOpen={isOpen} placement="right" onClose={handleClose} size="md">
        <DrawerOverlay />
        <DrawerContent bg="umami.gray.900">
          <TopButons
            onPrevious={() => {}}
            onNext={() => {}}
            onClose={handleClose}
          />
          <DrawerBody>
            <AccountCard />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AccountDisplayDrawer;
