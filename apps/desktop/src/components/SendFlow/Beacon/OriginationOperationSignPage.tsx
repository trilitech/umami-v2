import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AspectRatio,
  Flex,
  Heading,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { type ContractOrigination } from "@umami/core";
import { capitalize } from "lodash";
import { FormProvider } from "react-hook-form";

import { type BeaconSignPageProps } from "./BeaconSignPageProps";
import { useSignWithBeacon } from "./useSignWithBeacon";
import colors from "../../../style/colors";
import { JsValueWrap } from "../../AccountDrawer/JsValueWrap";
import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { headerText } from "../SignPageHeader";

export const OriginationOperationSignPage = ({ operation, message }: BeaconSignPageProps) => {
  const { isSigning, onSign, network, form, fee } = useSignWithBeacon(operation, message);
  const { code, storage } = operation.operations[0] as ContractOrigination;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <ModalHeader marginBottom="24px">
            <Flex alignItems="center" justifyContent="center">
              Operation Request
            </Flex>
            <Flex alignItems="center" justifyContent="center" marginTop="10px">
              <Heading marginRight="4px" color={colors.gray[450]} size="sm">
                Network:
              </Heading>
              <Text color={colors.gray[400]} size="sm">
                {capitalize(message.network.type)}
              </Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody data-testid="beacon-request-body">
            <Flex
              alignItems="center"
              marginTop="16px"
              padding="15px"
              borderRadius="4px"
              backgroundColor={colors.gray[800]}
            >
              <AspectRatio width="60px" marginRight="12px" ratio={1}>
                <Image borderRadius="4px" src={message.appMetadata.icon} />
              </AspectRatio>
              <Heading size="sm">{message.appMetadata.name}</Heading>
            </Flex>

            <Flex alignItems="center" justifyContent="end" marginTop="12px">
              <SignPageFee fee={fee} />
            </Flex>

            <Accordion marginTop="16px" allowToggle={true}>
              <AccordionItem background={colors.gray[800]} border="none" borderRadius="8px">
                <AccordionButton>
                  <Heading flex="1" textAlign="left" marginY="10px" size="md">
                    Code
                  </Heading>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel overflowY="auto" maxHeight="300px">
                  <JsValueWrap value={code} />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Accordion marginTop="16px" allowToggle={true}>
              <AccordionItem background={colors.gray[800]} border="none" borderRadius="8px">
                <AccordionButton>
                  <Heading flex="1" textAlign="left" marginY="10px" size="md">
                    Storage
                  </Heading>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel overflowY="auto" maxHeight="300px">
                  <JsValueWrap value={storage} />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            <AdvancedSettingsAccordion />
          </ModalBody>
          <ModalFooter padding="16px 0 0 0">
            <SignButton
              isLoading={isSigning}
              network={network}
              onSubmit={onSign}
              signer={operation.signer}
              text={headerText(operation.type, "single")}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
