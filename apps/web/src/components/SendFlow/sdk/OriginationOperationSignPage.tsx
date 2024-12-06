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
import { FormProvider, useForm } from "react-hook-form";

import { CodeSandboxIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
import { JsValueWrap } from "../../JsValueWrap";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { type CalculatedSignProps, type SdkSignPageProps } from "../utils";

export const OriginationOperationSignPage = ({
  operation,
  headerProps,
  isSigning,
  onSign,
  network,
  fee,
}: SdkSignPageProps & CalculatedSignProps) => {
  const color = useColor();
  const { code, storage } = operation.operations[0] as ContractOrigination;
  const form = useForm({ defaultValues: { executeParams: operation.estimates } });

  return (
    <FormProvider {...form}>
      <ModalContent data-testid="OriginationOperationSignPage">
        <form>
          <ModalHeader marginBottom="24px">
            <Flex alignItems="center" justifyContent="center">
              Operation Request
            </Flex>
            <Flex alignItems="center" justifyContent="center" marginTop="10px">
              <Heading marginRight="4px" color={color("700")} size="sm">
                Network:
              </Heading>
              <Text color={color("700")} fontWeight="400" size="sm">
                {capitalize(headerProps.network.name)}
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
              backgroundColor={color("100")}
            >
              <AspectRatio width="60px" marginRight="12px" ratio={1}>
                <Image
                  borderRadius="4px"
                  objectFit="cover"
                  fallback={<CodeSandboxIcon width="36px" height="36px" />}
                  src={headerProps.appIcon}
                />
              </AspectRatio>
              <Heading size="sm">{headerProps.appName}</Heading>
            </Flex>

            <Flex alignItems="center" justifyContent="end" marginTop="12px">
              <SignPageFee fee={fee} />
            </Flex>

            <Accordion marginTop="16px" allowToggle={true}>
              <AccordionItem background={color("100")} border="none" borderRadius="8px">
                <AccordionButton>
                  <Heading flex="1" textAlign="left" marginY="10px" size="md">
                    Code
                  </Heading>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel overflowY="auto" maxHeight="300px" padding="10px 0 0">
                  <JsValueWrap value={code} />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Accordion marginTop="16px" allowToggle={true}>
              <AccordionItem background={color("100")} border="none" borderRadius="8px">
                <AccordionButton>
                  <Heading flex="1" textAlign="left" marginY="10px" size="md">
                    Storage
                  </Heading>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel overflowY="auto" maxHeight="300px" padding="10px 0 0">
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
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
