import { useDisclosure } from "@chakra-ui/hooks";
import { Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import { get } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AccountsList } from "./AccountsList";
import { DrawerTopButtons } from "./DrawerTopButtons";
import { AccountCard } from "../../components/AccountDrawer";
import { useDynamicModal } from "../../components/DynamicModal";
import { fullId } from "../../types/Token";
import { useAllNfts } from "../../utils/hooks/assetsHooks";
import { useAllAccounts } from "../../utils/hooks/getAccountDataHooks";
import { NFTDrawerBody } from "../nfts/NFTDrawerBody";

export const AccountListWithDrawer: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const allAccounts = useAllAccounts();

  const { ownerPkh, nftId } = useParams();
  const nfts = useAllNfts();
  const drawerNFT = ownerPkh && get(nfts, [ownerPkh], []).find(nft => fullId(nft) === nftId);
  const isNFT = !!drawerNFT;

  const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: isNFT });
  const { isOpen: isDynamicModalOpen } = useDynamicModal();

  const navigate = useNavigate();
  const closeDrawer = useCallback(() => {
    setSelected(null);
    onClose();
    navigate("/home");
  }, [setSelected, onClose, navigate]);

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
      <AccountsList onOpen={onOpen} onSelect={setSelected} selected={selected} />
      <Drawer
        autoFocus={false}
        blockScrollOnMount={!isDynamicModalOpen}
        isOpen={isOpen}
        onClose={closeDrawer}
        placement="right"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            {isNFT ? (
              <NFTDrawerBody nft={drawerNFT} onCloseDrawer={closeDrawer} ownerPkh={ownerPkh} />
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
