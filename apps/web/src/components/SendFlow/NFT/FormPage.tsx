import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
  VStack,
} from "@chakra-ui/react";
import hj from "@hotjar/browser";
import { useMultiForm } from "@umami/components";
import { type FA2Transfer, type NFTBalance } from "@umami/core";
import { useCurrentAccount } from "@umami/state";
import { type RawPkh, parseContractPkh, parsePkh } from "@umami/tezos";
import { FormProvider } from "react-hook-form";

import { NFTTile } from "./NFTTile";
import { SignPage } from "./SignPage";
import { ChevronDownIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { KnownAccountsAutocomplete } from "../../AddressAutocomplete";
import { FormPageHeader } from "../FormPageHeader";
import { usePreviewOperation } from "../onSubmitFormActionHooks";
import { type FormPageProps, FormSubmitButton, formDefaultValues } from "../utils";

export type FormValues = {
  quantity: number;
  sender: RawPkh;
  recipient: RawPkh;
};

export const FormPage = (props: FormPageProps<FormValues> & { nft: NFTBalance }) => {
  const { nft } = props;
  const sender = useCurrentAccount()!;
  const color = useColor();
  const { previewOperation, isLoading } = usePreviewOperation(toOperation(nft), SignPage, { nft });
  const form = useMultiForm<FormValues>({
    mode: "onBlur",
    defaultValues: { quantity: 1, ...formDefaultValues({ ...props, sender }) },
  });

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = form;

  hj.stateChange("send_flow/nft_form_page");

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form onSubmit={handleSubmit(previewOperation)}>
          <FormPageHeader />

          <ModalBody>
            <VStack spacing="24px">
              <NFTTile nft={props.nft} />

              <FormControl isInvalid={!!errors.quantity}>
                <FormLabel>
                  <Flex justifyContent="space-between">
                    <Heading marginRight="8px" size="md">
                      Quantity
                    </Heading>

                    <Flex>
                      <Heading marginRight="4px" color={color("700")} size="md">
                        Owned:
                      </Heading>
                      <Text color={color("700")} data-testid="nft-owned" size="md">
                        {nft.balance}
                      </Text>
                    </Flex>
                  </Flex>
                </FormLabel>

                <InputGroup>
                  <Input
                    data-testid="quantity-input"
                    step={1}
                    type="number"
                    {...register("quantity", {
                      required: "Quantity is required",
                      max: {
                        value: nft.balance,
                        message: `Max quantity is ${nft.balance}`,
                      },
                      min: {
                        value: 1,
                        message: "Min quantity is 1",
                      },
                    })}
                  />

                  <InputRightElement
                    marginRight="10px"
                    color={color("400")}
                    fontSize="sm"
                    _hover={{ color: color("500") }}
                    cursor="pointer"
                    onClick={e => e.stopPropagation()}
                  >
                    <Icon as={ChevronDownIcon} width="24px" height="24px" />
                  </InputRightElement>
                </InputGroup>

                {errors.quantity && (
                  <FormErrorMessage data-testid="quantity-error">
                    {errors.quantity.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.recipient}>
                <KnownAccountsAutocomplete allowUnknown inputName="recipient" label="To" />
                {errors.recipient && (
                  <FormErrorMessage data-testid="recipient-error">
                    {errors.recipient.message}
                  </FormErrorMessage>
                )}
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <FormSubmitButton isLoading={isLoading} />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};

const toOperation =
  (nft: NFTBalance) =>
  (formValues: FormValues): FA2Transfer => ({
    type: "fa2",
    sender: parsePkh(formValues.sender),
    recipient: parsePkh(formValues.recipient),
    contract: parseContractPkh(nft.contract),
    tokenId: nft.tokenId,
    amount: formValues.quantity.toString(), // We assume NFT has 0 decimals
  });
