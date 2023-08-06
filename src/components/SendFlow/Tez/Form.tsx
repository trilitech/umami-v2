import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import colors from "../../../style/colors";
import { Account } from "../../../types/Account";
import { parsePkh, RawPkh } from "../../../types/Address";
import { tezToMutez } from "../../../utils/format";
import { useGetBestSignerForAccount, useGetOwnedAccount } from "../../../utils/hooks/accountHooks";
import { useSelectedNetwork } from "../../../utils/hooks/assetsHooks";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { useAppDispatch } from "../../../utils/redux/hooks";
import { estimateAndUpdateBatch } from "../../../utils/redux/thunks/estimateAndUpdateBatch";
import { TEZ } from "../../../utils/tezos";
import { estimateTotalFee } from "../../../views/batch/batchUtils";
import { KnownAccountsAutocomplete, OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import { DynamicModalContext } from "../../DynamicModal";
import { makeFormOperations } from "../../sendForm/types";
import Sign from "./Sign";

export type FormValues = {
  sender: RawPkh;
  recipient: RawPkh;
  prettyAmount: string;
};

export type FormProps = { sender?: Account; form?: FormValues };

const defaultValues = ({ sender, form }: FormProps) => {
  if (form) {
    return form;
  } else if (sender) {
    return { sender: sender.address.pkh };
  } else {
    return {};
  }
};

const Tez: React.FC<FormProps> = props => {
  const toast = useToast();
  const getAccount = useGetOwnedAccount();
  const getSigner = useGetBestSignerForAccount();
  const network = useSelectedNetwork();
  const dispatch = useAppDispatch();
  const { openWith } = useContext(DynamicModalContext);
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();

  const senderSelectorDisabled = !!props.sender;

  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: defaultValues(props),
  });
  const {
    formState: { isValid, errors },
    register,
    handleSubmit,
  } = form;

  const buildOperations = (formValues: FormValues) => {
    const sender = getAccount(formValues.sender);
    const recipient = parsePkh(formValues.recipient);
    const signer = getSigner(sender);
    return makeFormOperations(sender, signer, [
      { type: "tez", amount: tezToMutez(formValues.prettyAmount).toString(), recipient },
    ]);
  };

  const onSingleSubmit = async (formValues: FormValues) => {
    handleAsyncAction(async () => {
      const operations = buildOperations(formValues);
      openWith(
        <Sign
          goBack={() => openWith(<Tez {...props} form={formValues} />)}
          operations={operations}
          fee={await estimateTotalFee(operations, network)}
          mode="single"
        />
      );
    });
  };

  const onAddToBatch = async (formValues: FormValues) => {
    handleAsyncAction(async () => {
      const operations = buildOperations(formValues);
      await dispatch(estimateAndUpdateBatch(operations, network));
      toast({ title: "Transaction added to batch!", status: "success" });
    });
  };

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <ModalHeader textAlign="center" p="40px 0 32px 0">
            <Text size="2xl" fontWeight="600">
              Send
            </Text>
            <Text textAlign="center" size="sm" color={colors.gray[400]}>
              Send one or insert into batch.
            </Text>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <FormControl mb={2} isInvalid={!!errors.sender}>
              <OwnedAccountsAutocomplete
                label="From"
                isDisabled={!!senderSelectorDisabled}
                inputName="sender"
                allowUnknown={false}
              />
              {errors.sender && <FormErrorMessage>{errors.sender.message}</FormErrorMessage>}
            </FormControl>
            <FormControl mb={2} isInvalid={!!errors.recipient}>
              <KnownAccountsAutocomplete label="To" inputName="recipient" allowUnknown />
              {errors.recipient && <FormErrorMessage>{errors.recipient.message}</FormErrorMessage>}
            </FormControl>

            <FormControl mb={2} mt={2} isInvalid={!!errors.prettyAmount}>
              <FormLabel>Amount</FormLabel>

              <InputGroup>
                <Input
                  isDisabled={isLoading}
                  type="number"
                  step="any"
                  variant="filled"
                  {...register("prettyAmount", {
                    // TODO: add validation on format (no more than 6 decimals after dot)
                    required: "Amount is required",
                  })}
                  placeholder="0.000000"
                />
                <InputRightElement data-testid="currency">{TEZ}</InputRightElement>
              </InputGroup>
              {/* TODO: make a custom FormErrorMessage because its styling cannot be applied through theme.ts */}
              {errors.prettyAmount && (
                <FormErrorMessage>{errors.prettyAmount.message}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Box width="100%">
              <Button
                onClick={handleSubmit(onSingleSubmit)}
                width="100%"
                isLoading={isLoading}
                type="submit"
                isDisabled={!isValid}
                variant="primary"
                mb="16px"
              >
                Preview
              </Button>
              <Button
                onClick={handleSubmit(onAddToBatch)}
                width="100%"
                isLoading={isLoading}
                type="submit"
                isDisabled={!isValid}
                variant="tertiary"
              >
                Insert Into Batch
              </Button>
            </Box>
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
export default Tez;
