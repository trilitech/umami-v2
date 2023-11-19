import { useDisclosure } from "@chakra-ui/hooks";
import { Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import AccountCard from "../../components/AccountDrawer";
import { useAllAccounts } from "../../utils/hooks/getAccountDataHooks";
import { AccountsList } from "./AccountsList";
import { DrawerTopButtons } from "./DrawerTopButtons";
import { useDynamicModal } from "../../components/DynamicModal";

const AccountListWithDrawer: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const allAccounts = useAllAccounts();

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { isOpen: isDynamicModalOpen } = useDynamicModal();

  const closeDrawer = useCallback(() => {
    setSelected(null);
    onClose();
  }, [setSelected, onClose]);

  // For some reason the drawer doesn't close on esc for this particular component
  // Until we figure out why, we'll have this crutch
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [closeDrawer]);

  const account = allAccounts.find(account => account.address.pkh === selected);
  return (
    <>
      <AccountsList onOpen={onOpen} selected={selected} onSelect={setSelected} />
      <Drawer
        blockScrollOnMount={!isDynamicModalOpen}
        isOpen={isOpen}
        placement="right"
        onClose={closeDrawer}
        autoFocus={false}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <DrawerTopButtons onClose={closeDrawer} />
            {account && <AccountCard account={account} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AccountListWithDrawer;
