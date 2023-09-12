import { useDisclosure } from "@chakra-ui/hooks";
import { Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import { useState } from "react";
import AccountCard from "../../components/AccountDrawer";
import { useAllAccounts } from "../../utils/hooks/accountHooks";
import { AccountsList } from "./AccountsList";
import { DrawerTopButtons } from "./DrawerTopButtons";

const AccountListWithDrawer: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const allAccounts = useAllAccounts();

  const { isOpen, onClose: closeDrawer, onOpen } = useDisclosure();

  const handleClose = () => {
    setSelected(null);
    closeDrawer();
  };

  const account = allAccounts.find(account => account.address.pkh === selected);
  return (
    <>
      <AccountsList
        onOpen={onOpen}
        selected={selected}
        onSelect={pkh => {
          setSelected(pkh);
        }}
      />
      <Drawer isOpen={isOpen} placement="right" onClose={handleClose} size="md" autoFocus={false}>
        <DrawerOverlay />
        <DrawerContent maxW="594px" bg="umami.gray.900">
          <DrawerTopButtons onClose={handleClose} />
          <DrawerBody>{account && <AccountCard account={account} />}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AccountListWithDrawer;
