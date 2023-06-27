import { Button, VStack, useToast, ListItem, OrderedList } from "@chakra-ui/react";
import { useState } from "react";
import { RestoreLedgerStep } from "../useOnboardingModal";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { getPk } from "../../../utils/ledger/pk";
import { useRestoreLedger } from "../../../utils/hooks/accountHooks";

const RestoreLedger = ({
  closeModal,
  account,
}: {
  closeModal: () => void;
  account: RestoreLedgerStep["account"];
}) => {
  const [isLoading, setIsloading] = useState(false);
  const restoreLedger = useRestoreLedger();
  const toast = useToast();

  const noticeItems = [
    {
      content: "Plug your Ledger into your computer using a USB cable.",
    },
    {
      content: "Unlock your Ledger.",
    },
    {
      content: "Make sure your Ledger has the latest firmware version.",
    },
    {
      content: "Install and open the Tezos Wallet app on your Ledger.",
    },
    {
      content: "Click the button below and confirm the action on your Ledger.",
    },
  ];

  const connectLedger = async () => {
    setIsloading(true);
    try {
      toast({
        title: "Request sent to Ledger",
        description: "Open the Tezos app on your Ledger and accept the request",
      });
      const { pk, pkh } = await getPk(account.derivationPath);
      restoreLedger(account.derivationPath, pk, pkh, account.label);
      closeModal();
    } catch (error: any) {
      if (error.name === "PublicKeyRetrievalError") {
        toast({
          title: "Request rejected",
          description: "Please unlock your Ledger and open the Tezos app",
        });
      } else if (error.name === "InvalidStateError") {
        toast({
          title: "Request pending",
          description: "Check your ledger...",
        });
      } else if (error.name !== undefined) {
        toast({ title: "Request cancelled", description: error.name });
      } else {
        toast({ title: "Ledger Error", description: error.message });
      }
    }
    setIsloading(false);
  };

  return (
    <ModalContentWrapper
      icon={SupportedIcons.document}
      title="Connect Ledger"
      subtitle="Complete the steps to connect."
    >
      <VStack spacing="24px" overflowY="auto">
        <OrderedList spacing={4}>
          {noticeItems.map((item, index) => {
            return <ListItem key={index}>{item.content}</ListItem>;
          })}
        </OrderedList>
        <Button
          bg="umami.blue"
          w="100%"
          minH="48px"
          size="lg"
          isLoading={isLoading}
          onClick={connectLedger}
          overflowX="unset"
        >
          Export Public Key
        </Button>
      </VStack>
    </ModalContentWrapper>
  );
};

export default RestoreLedger;
