import { Button, ListItem, OrderedList, VStack, useToast } from "@chakra-ui/react";

import { USBIcon } from "../../../assets/icons";
import { makeDerivationPath } from "../../../utils/account/derivationPathUtils";
import { useRestoreLedger } from "../../../utils/hooks/setAccountDataHooks";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { getPk } from "../../../utils/ledger/pk";
import { withTimeout } from "../../../utils/withTimeout";
import { ModalContentWrapper } from "../ModalContentWrapper";
import { RestoreLedgerStep } from "../useOnboardingModal";

const LEDGER_TIMEOUT = 60 * 1000; // 1 minute

export const RestoreLedger = ({
  closeModal,
  account,
}: {
  closeModal: () => void;
  account: RestoreLedgerStep["account"];
}) => {
  const restoreLedger = useRestoreLedger();
  const toast = useToast();
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();

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

  const connectLedger = () =>
    handleAsyncAction(
      () =>
        withTimeout(async () => {
          toast({
            title: "Request sent to Ledger",
            description: "Open the Tezos app on your Ledger and approve the operation",
            status: "info",
          });
          const derivationPath = makeDerivationPath(account.derivationPath, 0);
          const { pk, pkh } = await getPk(derivationPath);
          restoreLedger(derivationPath, pk, pkh, account.label);
          closeModal();
        }, LEDGER_TIMEOUT),
      error => {
        if (error.name === "PublicKeyRetrievalError") {
          return {
            title: "Request rejected",
            description: "Please unlock your Ledger and open the Tezos app",
          };
        } else if (error.name === "InvalidStateError") {
          return {
            title: "Request pending",
            description: "Check your ledger...",
          };
        }

        return {
          title: "Ledger error",
          description: error.message || error.name,
        };
      }
    );

  return (
    <ModalContentWrapper
      icon={<USBIcon />}
      subtitle="Complete the steps to connect."
      title="Connect Ledger"
    >
      <VStack overflowY="auto" spacing="24px">
        <OrderedList spacing={4}>
          {noticeItems.map((item, index) => {
            return <ListItem key={index}>{item.content}</ListItem>;
          })}
        </OrderedList>
        <Button width="100%" isLoading={isLoading} onClick={connectLedger} size="lg">
          Export Public Key
        </Button>
      </VStack>
    </ModalContentWrapper>
  );
};
