import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import { SignPage } from "./SignPage";
import colors from "../../../style/colors";
import { RawPkh, parseContractPkh, parsePkh } from "../../../types/Address";
import { FA2Transfer } from "../../../types/Operation";
import { NFTBalance } from "../../../types/TokenBalance";
import { KnownAccountsAutocomplete, OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import { FormErrorMessage } from "../../FormErrorMessage";
import { FormPageHeader } from "../FormPageHeader";
import {
  useAddToBatchFormAction,
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../onSubmitFormActionHooks";
import { SendNFTRecapTile } from "../SendNFTRecapTile";
import { FormPagePropsWithSender, FormSubmitButtons, formDefaultValues } from "../utils";

export type FormValues = {
  quantity: number;
  sender: RawPkh;
  recipient: RawPkh;
};

export const FormPage: React.FC<
  FormPagePropsWithSender<FormValues> & { nft: NFTBalance }
> = props => {
  const { nft } = props;

  const openSignPage = useOpenSignPageFormAction({
    SignPage,
    signPageExtraData: { nft },
    FormPage,
    defaultFormPageProps: props,
    toOperation: toOperation(nft),
  });

  const addToBatch = useAddToBatchFormAction(toOperation(nft));

  const {
    onFormSubmitActionHandlers: [onSingleSubmit, onBatchSubmit],
    isLoading,
  } = useHandleOnSubmitFormActions([openSignPage, addToBatch]);

  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: { quantity: 1, ...formDefaultValues(props) },
  });
  const {
    formState: { isValid, errors },
    register,
    handleSubmit,
  } = form;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <FormPageHeader />
          <ModalBody>
            <Flex marginBottom="12px">
              <SendNFTRecapTile nft={props.nft} />
            </Flex>
            <Flex alignItems="center">
              <Heading marginRight="4px" color={colors.gray[450]} size="sm">
                Owned:
              </Heading>
              <Text color={colors.gray[400]} data-testid="nft-owned" size="sm">
                {nft.balance}
              </Text>
            </Flex>

            <FormControl marginTop="24px" isInvalid={!!errors.quantity}>
              <FormLabel>
                <Flex alignItems="center">
                  <Heading marginRight="8px" size="md">
                    Quantity:
                  </Heading>
                  <Flex alignItems="center">
                    <InputGroup width="75px">
                      <Input
                        width="60px"
                        color="white"
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
                    </InputGroup>
                    <Text data-testid="out-of-nft">out of {nft.balance}</Text>
                  </Flex>
                </Flex>
              </FormLabel>
              {errors.quantity && (
                <FormErrorMessage data-testid="quantity-error">
                  {errors.quantity.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl marginTop="24px" isInvalid={!!errors.sender}>
              <OwnedAccountsAutocomplete
                allowUnknown={false}
                inputName="sender"
                isDisabled
                label="From"
              />
              {errors.sender && (
                <FormErrorMessage data-testid="from-error">
                  {errors.sender.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl marginTop="24px" isInvalid={!!errors.recipient}>
              <KnownAccountsAutocomplete allowUnknown inputName="recipient" label="To" />
              {errors.recipient && (
                <FormErrorMessage data-testid="recipient-error">
                  {errors.recipient.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <FormSubmitButtons
              isLoading={isLoading}
              isValid={isValid}
              onAddToBatch={handleSubmit(onBatchSubmit)}
              onSingleSubmit={handleSubmit(onSingleSubmit)}
            />
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
