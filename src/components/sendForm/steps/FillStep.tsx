import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { validateAddress, ValidationResult } from "@taquito/utils";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { NFT } from "../../../types/Asset";
import { useBatchIsSimulating } from "../../../utils/hooks/assetsHooks";
import { BakerSelector } from "../../../views/delegations/BakerSelector";
import { ConnectedAccountSelector } from "../../AccountSelector/AccountSelector";
import { RecipentAutoComplete } from "../../RecipientAutoComplete/RecipientAutoComplete";
import { SendNFTRecapTile } from "../components/SendNFTRecapTile";
import { SendFormMode, OperationValue } from "../types";

export const DelegateForm = ({
  onSubmit,
  isLoading,
  undelegate = false,
  sender,
  recipient,
}: {
  isLoading: boolean;
  onSubmit: (a: { sender: string; baker?: string }) => void;
  undelegate?: boolean;
  sender?: string;
  recipient?: string;
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
                  isDisabled={undelegate}
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
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <BakerSelector
                    selected={value}
                    onSelect={(bakerAddress) => {
                      onChange(bakerAddress);
                    }}
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

export const SendTezOrNFTForm = ({
  nft,
  sender,
  onSubmit,
  onSubmitBatch,
  isLoading,
  recipient,
}: {
  onSubmit: (v: { sender: string; recipient: string; amount: number }) => void;
  onSubmitBatch: (v: {
    sender: string;
    recipient: string;
    amount: number;
  }) => void;
  sender?: string;
  nft?: NFT;
  isLoading?: boolean;
  recipient?: string;
}) => {
  const mandatoryNftSender = nft?.owner;
  const isNFT = !!nft;
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
    amount: number;
  }>({
    mode: "onBlur",
    defaultValues: {
      sender: mandatoryNftSender || sender,
      amount: isNFT ? 1 : undefined,
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
                  isDisabled={isNFT || simulating}
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

          {nft ? <SendNFTRecapTile nft={nft} /> : null}

          <FormControl mb={2} mt={2}>
            <FormLabel>Amount</FormLabel>
            <Input
              isDisabled={simulating}
              step={isNFT ? 1 : "any"}
              type={"number"}
              {...register("amount", {
                required: true,
                valueAsNumber: true,
              })}
              placeholder="Enter amount..."
            />
          </FormControl>
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
  mode: SendFormMode;
}> = ({ onSubmit, isLoading, sender, recipient, mode, onSubmitBatch }) => {
  switch (mode.type) {
    case "delegation":
      return (
        <DelegateForm
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
          onSubmitBatch={(v) => {
            onSubmitBatch({
              type: "tez",
              value: {
                amount: v.amount,
                sender: v.sender,
                recipient: v.recipient,
              },
            });
          }}
          onSubmit={(v) => {
            onSubmit({
              type: "tez",
              value: {
                amount: v.amount,
                sender: v.sender,
                recipient: v.recipient,
              },
            });
          }}
        />
      );

    case "token": {
      if (mode.data.type !== "nft") {
        throw new Error("Should be nft");
      }
      return (
        <SendTezOrNFTForm
          sender={sender}
          isLoading={isLoading}
          recipient={recipient}
          onSubmitBatch={(v) => {
            onSubmitBatch({
              type: "token",
              data: mode.data,
              value: {
                amount: v.amount,
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
                amount: v.amount,
                sender: v.sender,
                recipient: v.recipient,
              },
            });
          }}
          nft={mode.data}
        />
      );
    }

    default:
      return null;
  }
};
