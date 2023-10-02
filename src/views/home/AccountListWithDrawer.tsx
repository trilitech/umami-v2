import { useDisclosure } from "@chakra-ui/hooks";
import { Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AccountCard from "../../components/AccountDrawer";
import { useAllAccounts } from "../../utils/hooks/accountHooks";
import { AccountsList } from "./AccountsList";
import { DrawerTopButtons } from "./DrawerTopButtons";
import { useDynamicModal } from "../../components/DynamicModal";
import colors from "../../style/colors";

const AccountListWithDrawer: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const allAccounts = useAllAccounts();

  const { isOpen, onClose: closeDrawer, onOpen } = useDisclosure();
  const { isOpen: isDynamicModalOpen } = useDynamicModal();

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
        size="md"
        autoFocus={false}
      >
        <DrawerOverlay />
        <DrawerContent maxW="594px" bg={colors.gray[900]}>
          <DrawerTopButtons onClose={closeDrawer} />
          <DrawerBody>{account && <AccountCard account={account} />}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AccountListWithDrawer;
