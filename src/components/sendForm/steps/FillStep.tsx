import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { TransferParams } from "@taquito/taquito";
import { validateAddress, ValidationResult } from "@taquito/utils";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Asset, NFT } from "../../../types/Asset";
import { tezToMutez } from "../../../utils/format";
import { useBatchIsSimulating } from "../../../utils/hooks/assetsHooks";
import { BakerSelector } from "../../../views/delegations/BakerSelector";
import { ConnectedAccountSelector } from "../../AccountSelector/AccountSelector";
import { RecipentAutoComplete } from "../../RecipientAutoComplete/RecipientAutoComplete";
import { SendNFTRecapTile } from "../components/SendNFTRecapTile";
import { OperationValue, SendFormMode } from "../types";

export const DelegateForm = ({
  onSubmit,
  isLoading,
  undelegate = false,
  sender,
  recipient,
  disabled = false,
}: {
  isLoading: boolean;
  onSubmit: (a: { sender: string; baker?: string }) => void;
  undelegate?: boolean;
  sender?: string;
  recipient?: string;
  disabled?: boolean;
}) => {
  const { formState, control, handleSubmit } = useForm<{
    sender: string;
    baker: string | undefined;
  }>({
    mode: "onBlur",
    defaultValues: { sender, baker: recipient },
  });
  const { isValid } = formState;
  const subTitle = undelegate ? "Remove delegation" : "Delegate";
  return (
    <ModalContent bg="umami.gray.900">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalCloseButton />
        <ModalHeader textAlign={"center"}>Delegation</ModalHeader>
        <Text textAlign={"center"}>{subTitle}</Text>
        <ModalBody>
          <FormControl mb={2}>
            <FormLabel>From</FormLabel>
            <Controller
              rules={{ required: true }}
              control={control}
              name="sender"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <ConnectedAccountSelector
                  isDisabled={undelegate || disabled}
                  selected={value}
                  onSelect={(a) => {
                    onChange(a.pkh);
                  }}
                />
              )}
            />
          </FormControl>

          {undelegate ? null : (
            <FormControl mb={2}>
              <FormLabel>Baker</FormLabel>
              <Controller
                rules={{ required: true }}
                control={control}
                name="baker"
                render={({ field: { onChange, value } }) => (
                  <BakerSelector
                    disabled={disabled}
                    selected={value}
                    onSelect={onChange}
                  />
                )}
              />
            </FormControl>
          )}
        </ModalBody>
        <ModalFooter>
          <Box width={"100%"}>
            <Button
              width={"100%"}
              isLoading={isLoading}
              type="submit"
              isDisabled={!isValid || isLoading}
              variant="ghost"
              mb={2}
            >
              Preview
            </Button>
          </Box>
        </ModalFooter>
      </form>
    </ModalContent>
  );
};

const getAmountSymbol = (asset?: Asset) => {
  if (!asset) {
    return "tez";
  }
  if (asset instanceof NFT) {
    return "editions";
  }

  return asset.symbol();
};

export const SendTezOrNFTForm = ({
  token,
  sender,
  onSubmit,
  onSubmitBatch,
  isLoading,
  recipient,
  parameter,
  amount,
  disabled,
}: {
  onSubmit: (v: { sender: string; recipient: string; amount: string }) => void;
  onSubmitBatch: (v: {
    sender: string;
    recipient: string;
    amount: string;
  }) => void;
  sender?: string;
  token?: Asset;
  isLoading?: boolean;
  recipient?: string;
  disabled?: boolean;
  amount?: string;
  parameter?: TransferParams["parameter"];
}) => {
  const isNFT = token instanceof NFT;
  const mandatoryNftSender = isNFT ? token?.owner : undefined;
  const getBatchIsSimulating = useBatchIsSimulating();

  const {
    formState: { isValid, errors },
    control,
    register,
    getValues,
    handleSubmit,
  } = useForm<{
    sender: string;
    recipient: string;
    amount: string;
  }>({
    mode: "onBlur",
    defaultValues: {
      sender: mandatoryNftSender || sender,
      amount: isNFT ? "1" : amount,
      recipient,
    },
  });

  const senderFormValue = getValues().sender;
  const batchIsSimulating =
    senderFormValue !== "" && getBatchIsSimulating(senderFormValue);

  const simulating = isLoading || batchIsSimulating;

  return (
    <ModalContent bg="umami.gray.900">
      <form>
        <ModalCloseButton />
        <ModalHeader textAlign={"center"}>Send</ModalHeader>
        <Text textAlign={"center"}>Send one or insert into batch.</Text>
        <ModalBody>
          <FormControl mb={2}>
            <FormLabel>From</FormLabel>
            <Controller
              rules={{ required: true }}
              control={control}
              name="sender"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <ConnectedAccountSelector
                  isDisabled={isNFT || simulating || disabled}
                  selected={value}
                  onSelect={(a) => {
                    onChange(a.pkh);
                  }}
                />
              )}
            />
          </FormControl>
          <FormControl mb={2} isInvalid={!!errors.recipient}>
            <FormLabel>To</FormLabel>
            <Controller
              rules={{
                required: true,
                validate: (val) =>
                  validateAddress(val) === ValidationResult.VALID ||
                  "Invalid address",
              }}
              control={control}
              name="recipient"
              render={({ field: { onChange, value } }) => (
                <RecipentAutoComplete
                  isDisabled={disabled}
                  initialPkhValue={recipient}
                  onValidPkh={(pkh) => {
                    onChange(pkh === null ? "" : pkh);
                  }}
                />
              )}
            />
            {errors.recipient && (
              <FormErrorMessage>{errors.recipient.message}</FormErrorMessage>
            )}
          </FormControl>

          {token instanceof NFT ? <SendNFTRecapTile nft={token} /> : null}

          <FormControl mb={2} mt={2}>
            <FormLabel>Amount</FormLabel>
            <InputGroup>
              <Input
                isDisabled={simulating || disabled}
                step={isNFT ? 1 : "any"}
                type={"number"}
                {...register("amount", {
                  required: true,
                })}
                placeholder="Enter amount..."
              />
              <InputRightAddon
                data-testid="currency"
                children={getAmountSymbol(token)}
              />
            </InputGroup>
          </FormControl>

          {parameter && (
            <FormControl mb={2} mt={2}>
              <FormLabel>Parameter</FormLabel>
              <Textarea
                isDisabled={true}
                value={JSON.stringify(parameter, null, 4)}
              ></Textarea>
            </FormControl>
          )}
        </ModalBody>
        <ModalFooter>
          <Box width={"100%"}>
            <Button
              onClick={handleSubmit(onSubmit)}
              width={"100%"}
              isLoading={isLoading}
              type="submit"
              isDisabled={!isValid || simulating}
              variant="ghost"
              mb={2}
            >
              Preview
            </Button>
            <Button
              onClick={handleSubmit(onSubmitBatch)}
              width={"100%"}
              isLoading={batchIsSimulating}
              type="submit"
              isDisabled={!isValid || simulating}
              variant="ghost"
              mb={2}
            >
              Insert Into Batch
            </Button>
          </Box>
        </ModalFooter>
      </form>
    </ModalContent>
  );
};

export const FillStep: React.FC<{
  onSubmit: (v: OperationValue) => void;
  onSubmitBatch: (v: OperationValue) => void;
  isLoading: boolean;
  sender?: string;
  recipient?: string;
  amount?: string;
  disabled?: boolean;
  parameter?: TransferParams["parameter"];
  mode: SendFormMode;
}> = ({
  onSubmit,
  isLoading,
  sender,
  recipient,
  amount,
  parameter,
  mode,
  onSubmitBatch,
  disabled,
}) => {
  switch (mode.type) {
    case "delegation":
      return (
        <DelegateForm
          disabled={disabled}
          sender={sender}
          recipient={recipient}
          undelegate={mode.data?.undelegate}
          isLoading={isLoading}
          onSubmit={(v) => {
            onSubmit({
              type: "delegation",
              value: {
                sender: v.sender,
                recipient: v.baker,
              },
            });
          }}
        />
      );
    case "tez":
      return (
        <SendTezOrNFTForm
          sender={sender}
          isLoading={isLoading}
          recipient={recipient}
          amount={amount}
          parameter={parameter}
          disabled={disabled}
          onSubmitBatch={(v) => {
            onSubmitBatch({
              type: "tez",
              value: {
                amount: tezToMutez(v.amount).toString(),
                sender: v.sender,
                recipient: v.recipient,
                parameter,
              },
            });
          }}
          onSubmit={(v) => {
            onSubmit({
              type: "tez",
              value: {
                amount: tezToMutez(v.amount).toString(),
                sender: v.sender,
                recipient: v.recipient,
                parameter,
              },
            });
          }}
        />
      );

    case "token": {
      return (
        <SendTezOrNFTForm
          sender={sender}
          isLoading={isLoading}
          recipient={recipient}
          parameter={parameter}
          onSubmitBatch={(v) => {
            onSubmitBatch({
              type: "token",
              data: mode.data,
              value: {
                amount: mode.data.getRealAmount(v.amount).toString(),
                sender: v.sender,
                recipient: v.recipient,
              },
            });
          }}
          onSubmit={(v) => {
            onSubmit({
              type: "token",
              data: mode.data,
              value: {
                amount: mode.data.getRealAmount(v.amount).toString(),
                sender: v.sender,
                recipient: v.recipient,
              },
            });
          }}
          token={mode.data}
        />
      );
    }

    case "batch": {
      throw new Error("Batches are not editable");
    }
  }
};
