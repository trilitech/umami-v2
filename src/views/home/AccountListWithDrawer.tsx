import { useDisclosure } from "@chakra-ui/hooks";
import { Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import { get } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AccountsList } from "./AccountsList";
import { SelectedAccountContext } from "./SelectedAccountContext";
import { AccountCard } from "../../components/AccountDrawer";
import { DrawerTopButtons } from "../../components/DrawerTopButtons";
import { useDynamicModal } from "../../components/DynamicModal";
import { Account } from "../../types/Account";
import { fullId } from "../../types/Token";
import { useAllNfts } from "../../utils/hooks/assetsHooks";
import { NFTDrawerBody } from "../nfts/NFTDrawerBody";

export const AccountListWithDrawer: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const { ownerPkh, nftId } = useParams();
  const nfts = useAllNfts();
  const drawerNFT = ownerPkh && get(nfts, [ownerPkh], []).find(nft => fullId(nft) === nftId);
  const isNFT = !!drawerNFT;

  const { isOpen, onOpen: openDrawer, onClose } = useDisclosure({ defaultIsOpen: isNFT });
  const { isOpen: isDynamicModalOpen } = useDynamicModal();

  const navigate = useNavigate();
  const closeDrawer = useCallback(() => {
    setSelectedAccount(null);
    onClose();
    navigate("/home");
  }, [onClose, navigate]);

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

  const selectedAccountContextValue = useMemo(
    () => ({
      selectedAccount,
      selectAccount: (account: Account | null) => {
        setSelectedAccount(account);
        openDrawer();
      },
    }),
    [selectedAccount, openDrawer]
  );

  return (
    <SelectedAccountContext.Provider value={selectedAccountContextValue}>
      <AccountsList />
      <Drawer
        autoFocus={false}
        blockScrollOnMount={!isDynamicModalOpen}
        isOpen={isOpen}
        onClose={closeDrawer}
        placement="right"
      >
        <DrawerOverlay />
        <DrawerContent>
          {isNFT && (
            <DrawerBody>
              <NFTDrawerBody nft={{ ...drawerNFT, owner: ownerPkh }} onCloseDrawer={closeDrawer} />
            </DrawerBody>
          )}
          {!isNFT && selectedAccount && (
            <DrawerBody overflow="hidden" overflowY="scroll" paddingRight="0">
              <DrawerTopButtons marginRight="23px" onClose={closeDrawer} />
              <AccountCard accountPkh={selectedAccount.address.pkh} />
            </DrawerBody>
          )}
        </DrawerContent>
      </Drawer>
    </SelectedAccountContext.Provider>
  );
};
