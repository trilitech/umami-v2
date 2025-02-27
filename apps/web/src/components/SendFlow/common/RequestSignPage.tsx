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
import hj from "@hotjar/browser";
import {
  type ContractCall,
  type ContractOrigination,
  type Delegation,
  type Stake,
  type TezTransfer,
  Titles,
  type Unstake,
} from "@umami/core";
import { useAccountTotalFinalizableUnstakeAmount } from "@umami/state";
import { type Address } from "@umami/tezos";
import { CustomError } from "@umami/utils";
import { FormProvider, useForm } from "react-hook-form";

import { Header } from "./Header";
import { useColor } from "../../../styles/useColor";
import { AddressTile } from "../../AddressTile/AddressTile";
import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
import { TezTile } from "../../AssetTiles/TezTile";
import { HintsAccordion } from "../../HintsAccordion";
import { JsValueWrap } from "../../JsValueWrap";
import { useSignWithBeacon } from "../Beacon/useSignWithBeacon";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { type SdkSignPageProps } from "../utils";
import { useSignWithWalletConnect } from "../WalletConnect/useSignWithWalletConnect";

export const SingleSignPage = (signProps: SdkSignPageProps) => {
  const color = useColor();

  const totalFinalizableAmount = useAccountTotalFinalizableUnstakeAmount(
    signProps.operation.signer.address.pkh
  );
  const operation = signProps.operation.operations[0];
  const operationType = signProps.operation.operations.length === 1 ? operation.type : "batch";
  const network = signProps.headerProps.network;

  const beaconCalculatedProps = useSignWithBeacon({ ...signProps });
  const walletConnectCalculatedProps = useSignWithWalletConnect({ ...signProps });
  const calculatedProps =
    signProps.headerProps.requestId.sdkType === "beacon"
      ? beaconCalculatedProps
      : walletConnectCalculatedProps;
  const onSign = calculatedProps.onSign;
  const form = useForm({ defaultValues: { executeParams: signProps.operation.estimates } });

  /**
   * FA1/2 are impossible to get here because we don't parse them
   * instead we get a generic contract call
   * contract_origination is not supported yet
   * check {@link beacon#partialOperationToOperation} for details
   */

  if (!(operationType in Titles)) {
    throw new CustomError("Unsupported operation type");
  }

  const fields: Record<string, any> = {};

  switch (operationType) {
    case "tez":
      fields["mutezAmount"] = (operation as TezTransfer).amount;
      fields["from"] = signProps.operation.sender.address;
      fields["to"] = (operation as TezTransfer).recipient;
      break;
    case "contract_call":
      fields["mutezAmount"] = (operation as ContractCall).amount;
      fields["contract"] = (operation as ContractCall).contract;
      fields["entrypoint"] = (operation as ContractCall).entrypoint;
      fields["args"] = (operation as ContractCall).args;
      break;
    case "delegation":
      fields["from"] = signProps.operation.signer.address;
      fields["to"] = (operation as Delegation).recipient;
      break;
    case "undelegation":
      break;
    case "contract_origination":
      fields["code"] = (operation as ContractOrigination).code;
      fields["storage"] = (operation as ContractOrigination).storage;
      break;
    case "stake":
      fields["from"] = signProps.operation.sender.address;
      fields["mutezAmount"] = (operation as Stake).amount;
      break;
    case "unstake":
      fields["from"] = signProps.operation.sender.address;
      fields["mutezAmount"] = (operation as Unstake).amount;
      break;
    case "finalize_unstake":
      fields["from"] = signProps.operation.sender.address;
      fields["mutezAmount"] = totalFinalizableAmount;
      break;
    case "batch":
      fields["from"] = signProps.operation.signer.address;
      fields["operations"] = signProps.operation.operations;
      fields["transactionCount"] = signProps.operation.operations.length;
      break;
    case "fa2": {
      throw new Error('Not implemented yet: "fa2" case');
    }
    case "fa1.2": {
      throw new Error('Not implemented yet: "fa1.2" case');
    }
  }

  const AddressLabelAndTile = (heading: string, address: Address | undefined) => {
    if (!address) {
      return null;
    }
    return (
      <Flex flexDirection="column">
        <FormLabel marginTop="24px">{heading}</FormLabel>
        <AddressTile address={address} />
      </Flex>
    );
  };

  const JsLabelAndCode = (heading: string, code: any | undefined) => {
    if (!code) {
      return null;
    }
    return (
      <Flex flexDirection="column">
        <Accordion marginTop="16px" allowToggle={true}>
          <AccordionItem background={color("100")} border="none" borderRadius="8px">
            <AccordionButton>
              <Heading flex="1" textAlign="left" marginY="10px" size="md">
                {heading}
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel overflowY="auto" maxHeight="300px" padding="10px 0 0">
              <JsValueWrap value={code} />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    );
  };

  const TransactionCount = (transactionCount: number | undefined) => {
    if (!transactionCount) {
      return null;
    }
    return (
      <Flex alignItems="center" justifyContent="space-between" marginY="12px" paddingX="4px">
        <Flex>
          <Text marginRight="4px" color={color("450")} size="sm">
            Transactions:
          </Text>
          <Text color={color("400")} data-testid="transaction-length" size="sm">
            {transactionCount}
          </Text>
        </Flex>
      </Flex>
    );
  };

  hj.stateChange(`single_sign_page/${operationType}`);

  const formFields = {
    mutezAmount: TezTile({ mutezAmount: fields["mutezAmount"] }),
    from: AddressLabelAndTile("From", fields["from"]),
    to: AddressLabelAndTile("To", fields["to"]),
    contract: AddressLabelAndTile("Contract", fields["contract"]),
    code: JsLabelAndCode("Code", fields["code"]),
    storage: JsLabelAndCode("Storage", fields["storage"]),
    entrypoint: JsLabelAndCode("Entrypoint", {
      entrypoint: fields["entrypoint"],
      values: fields["args"],
    }),
    operations: JsLabelAndCode("Operations", fields["operations"]),
    transactionCount: TransactionCount(fields["transactionCount"]),
  };

  const renderField = (key: keyof typeof formFields) => formFields[key];

  return (
    <FormProvider {...form}>
      <ModalContent data-testid={operationType}>
        <form>
          <Header headerProps={signProps.headerProps} title={Titles[operationType]} />
          <HintsAccordion signPage={operationType} />
          <ModalBody>
            {fields["mutezAmount"] && renderField("mutezAmount")}

            <Flex alignItems="center" justifyContent="end" marginTop="12px">
              <SignPageFee fee={calculatedProps.fee} />
            </Flex>

            {renderField("from")}
            {renderField("to")}
            {renderField("contract")}
            {renderField("code")}
            {renderField("storage")}
            {renderField("entrypoint")}

            {renderField("operations")}
            {renderField("transactionCount")}

            <AdvancedSettingsAccordion />
          </ModalBody>
          <ModalFooter>
            <SignButton
              isLoading={calculatedProps.isSigning}
              network={network}
              onSubmit={onSign}
              signer={signProps.operation.signer}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
