import { type PartialTezosOperation } from "@airgap/beacon-wallet";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  FormLabel,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";

import { Header } from "./Header";
import { useColor } from "../../../styles/useColor";
import { AddressTile } from "../../AddressTile/AddressTile";
import { JsValueWrap } from "../../JsValueWrap";
import { useSignWithBeacon } from "../Beacon/useSignWithBeacon";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { type SdkSignPageProps } from "../utils";
import { useSignWithWalletConnect } from "../WalletConnect/useSignWithWalletConnect";

export const BatchSignPage = (
  signProps: SdkSignPageProps,
  operationDetails: PartialTezosOperation[]
) => {
  const color = useColor();

  const beaconCalculatedProps = useSignWithBeacon({ ...signProps });
  const walletConnectCalculatedProps = useSignWithWalletConnect({ ...signProps });
  const calculatedProps =
    signProps.headerProps.requestId.sdkType === "beacon"
      ? beaconCalculatedProps
      : walletConnectCalculatedProps;

  const { isSigning, onSign, network, fee } = calculatedProps;
  const { signer, operations } = signProps.operation;
  const transactionCount = operations.length;
  const form = useForm({ defaultValues: { executeParams: signProps.operation.estimates } });

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <Header headerProps={signProps.headerProps} />

          <ModalBody>
            <Accordion allowToggle>
              <AccordionItem background={color("100")} border="none" borderRadius="8px">
                <AccordionButton>
                  <Heading flex="1" textAlign="left" paddingY="6px" size="sm">
                    Operations
                  </Heading>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <JsValueWrap overflowY="auto" maxHeight="200px" value={operationDetails} />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            <FormLabel marginTop="16px">From</FormLabel>
            <AddressTile address={signer.address} />
            <Flex alignItems="center" justifyContent="space-between" marginY="12px" paddingX="4px">
              <Flex>
                <Text marginRight="4px" color={color("450")} size="sm">
                  Transactions:
                </Text>
                <Text color={color("400")} data-testid="transaction-length" size="sm">
                  {transactionCount}
                </Text>
              </Flex>
              <SignPageFee fee={fee} />
            </Flex>
          </ModalBody>

          <ModalFooter>
            <SignButton isLoading={isSigning} network={network} onSubmit={onSign} signer={signer} />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
