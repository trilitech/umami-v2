import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  FormLabel,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@chakra-ui/react";
import { ContractCall } from "../../../types/Operation";
import useSignWithBeacon from "./useSignWithBeacon";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { TezTile } from "../../AssetTiles/TezTile";
import SignPageFee from "../SignPageFee";
import AddressTile from "../../AddressTile/AddressTile";
import { FormProvider } from "react-hook-form";
import { BeaconSignPageProps } from "./BeaconSignPage";
import JsValueWrap from "../../AccountDrawer/JsValueWrap";
import colors from "../../../style/colors";
import SignButton from "../SignButton";

const ContractCallSignPage: React.FC<BeaconSignPageProps> = ({ operation, onBeaconSuccess }) => {
  const {
    amount: mutezAmount,
    contract,
    entrypoint,
    args,
  } = operation.operations[0] as ContractCall;

  const { isSigning, form, onSign, fee } = useSignWithBeacon(operation, onBeaconSuccess);

  if (!fee) {
    return null;
  }

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader mode="single" operationsType={operation.type} />
          <ModalBody>
            <TezTile mutezAmount={mutezAmount} />

            <Flex mt="12px" alignItems="center" justifyContent="end">
              <SignPageFee fee={fee} />
            </Flex>

            <FormLabel mt="24px">From </FormLabel>
            <AddressTile address={operation.sender.address} />

            <FormLabel mt="24px">To </FormLabel>
            <AddressTile address={contract} />

            <FormLabel mt="24px">Parameter</FormLabel>
            <Accordion allowToggle={true}>
              <AccordionItem bg={colors.gray[800]} border="none" borderRadius="8px">
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    JSON
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <JsValueWrap value={{ entrypoint, values: args }} />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </ModalBody>
          <ModalFooter>
            <SignButton
              isLoading={isSigning}
              signer={operation.signer}
              onSubmit={onSign}
              text={headerText(operation.type, "single")}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};

export default ContractCallSignPage;
