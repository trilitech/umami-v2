import { useDisclosure } from "@chakra-ui/hooks";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
} from "@chakra-ui/react";
import AccountCard from "../../components/AccountCard.tsx";
import accountsSlice from "../../utils/store/accountsSlice";
import { useAppDispatch } from "../../utils/store/hooks";
import { DrawerTopButtons } from "./DrawerTopButtons";

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
          <DrawerTopButtons
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
