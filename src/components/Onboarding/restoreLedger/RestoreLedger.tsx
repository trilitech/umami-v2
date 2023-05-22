import {
  Button,
  VStack,
  useToast,
  ListItem,
  OrderedList,
} from "@chakra-ui/react";
import { useState } from "react";
import { LedgerSigner } from "@taquito/ledger-signer";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import {
  Step,
  StepType,
  TemporaryLedgerAccountConfig,
} from "../useOnboardingModal";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";

const RestoreLedger = ({
  setStep,
  config,
}: {
  setStep: (step: Step) => void;
  config: TemporaryLedgerAccountConfig;
}) => {
  const [isLoading, setIsloading] = useState(false);
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
      const transport = await TransportWebHID.create();
      const ledgerSigner = new LedgerSigner(
        transport,
        config.derivationPath,
        true
      );
      const pk = await ledgerSigner.publicKey();
      const pkh = await ledgerSigner.publicKeyHash();
      toast({
        title: "Request sent to Ledger",
        description: "Open the Tezos app on your Ledger and accept the request",
      });
      config.pk = pk;
      config.pkh = pkh;

      setStep({ type: StepType.nameAccount, config });
      await transport.close();
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
      <VStack spacing={"24px"} overflow={"scroll"}>
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
        >
          Export Public Key
        </Button>
      </VStack>
    </ModalContentWrapper>
  );
};

export default RestoreLedger;
