import { useDisclosure } from "@chakra-ui/hooks";
import { Drawer, DrawerBody, DrawerContent, DrawerOverlay, Flex } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import AccountCard from "../../components/AccountDrawer";
import { useAllAccounts } from "../../utils/hooks/getAccountDataHooks";
import { AccountsList } from "./AccountsList";
import { CloseDrawerButton, DrawerTopButtons } from "./DrawerTopButtons";
import { useDynamicModal } from "../../components/DynamicModal";
import { useNavigate, useParams } from "react-router-dom";
import { useAllNfts } from "../../utils/hooks/assetsHooks";
import { fullId } from "../../types/Token";
import colors from "../../style/colors";
import AddressPill from "../../components/AddressPill/AddressPill";
import NFTDrawerCard from "../nfts/NFTDrawerCard";
import { parsePkh } from "../../types/Address";

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
    if (!isNFT) {
      navigate("/home");
    }
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
            {isNFT ? (
              <>
                {drawerNFT && (
                  <>
                    <Flex
                      justifyContent="space-between"
                      color={colors.gray[400]}
                      cursor="pointer"
                      alignItems="center"
                      paddingBottom="30px"
                    >
                      <AddressPill address={parsePkh(ownerPkh)} />
                      <CloseDrawerButton onClose={closeDrawer} />
                    </Flex>
                    <NFTDrawerCard nft={drawerNFT} ownerPkh={ownerPkh} />
                  </>
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
