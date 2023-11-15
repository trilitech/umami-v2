import { useDisclosure } from "@chakra-ui/hooks";
import { Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import AccountCard from "../../components/AccountDrawer";
import { useAllAccounts } from "../../utils/hooks/getAccountDataHooks";
import { AccountsList } from "./AccountsList";
import { DrawerTopButtons } from "./DrawerTopButtons";
import { useDynamicModal } from "../../components/DynamicModal";
import { useNavigate, useParams } from "react-router-dom";
import { useAllNfts } from "../../utils/hooks/assetsHooks";
import { fullId } from "../../types/Token";

import NFTDrawerBody from "../nfts/NFTDrawerBody";

const AccountListWithDrawer: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const allAccounts = useAllAccounts();

  const { ownerPkh, nftId } = useParams();
  const isNFT = ownerPkh !== undefined && nftId !== undefined;
  const nfts = useAllNfts();
  const drawerNFT = ownerPkh && (nfts[ownerPkh] || []).find(nft => fullId(nft) === nftId);

  const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: isNFT });
  const { isOpen: isDynamicModalOpen } = useDynamicModal();

  const navigate = useNavigate();
  const closeDrawer = useCallback(() => {
    setSelected(null);
    onClose();
    if (isNFT) {
      navigate("/home");
    }
  }, [setSelected, onClose, navigate, isNFT]);

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
            {isNFT ? (
              <>
                {drawerNFT && (
                  <NFTDrawerBody ownerPkh={ownerPkh} nft={drawerNFT} onCloseDrawer={closeDrawer} />
                )}
              </>
            ) : (
              <>
                <DrawerTopButtons onClose={closeDrawer} />
                {account && <AccountCard account={account} />}
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AccountListWithDrawer;
