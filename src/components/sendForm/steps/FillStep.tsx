import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { NFT } from "../../../types/Asset";
import { BakerSelector } from "../../../views/delegations/BakerSelector";
import { ConnectedAccountSelector } from "../../AccountSelector/AccountSelector";
import { SendNFTRecapTile } from "../components/SendNFTRecapTile";
import { SendFormMode, TransactionValues } from "../types";

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
              control={control as any}
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
                control={control as any}
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
  isLoading,
}: {
  onSubmit: (v: { sender: string; recipient: string; amount: number }) => void;
  sender?: string;
  nft?: NFT;
  isLoading?: boolean;
}) => {
  const mandatoryNftSender = nft?.owner;
  const isNFT = !!nft;

  const { formState, control, register, handleSubmit } = useForm<{
    sender: string;
    recipient: string;
    amount: number;
  }>({
    mode: "onBlur",
    defaultValues: {
      sender: mandatoryNftSender || sender,
      amount: isNFT ? 1 : undefined,
    },
  });
  const { isValid } = formState;

  return (
    <ModalContent bg="umami.gray.900">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalCloseButton />
        <ModalHeader textAlign={"center"}>Send</ModalHeader>
        <Text textAlign={"center"}>Send one or insert into batch.</Text>
        <ModalBody>
          <FormControl mb={2}>
            <FormLabel>From</FormLabel>
            <Controller
              rules={{ required: true }}
              control={control as any}
              name="sender"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <ConnectedAccountSelector
                  isDisabled={isNFT}
                  selected={value}
                  onSelect={(a) => {
                    onChange(a.pkh);
                  }}
                />
              )}
            />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>To</FormLabel>
            <Input
              type="text"
              {...register("recipient", {
                required: true,
                validate: (val) => {
                  return val.length === 36;
                },
              })}
              placeholder="Enter recipient address..."
            />
          </FormControl>

          {!!nft ? <SendNFTRecapTile nft={nft} /> : null}

          <FormControl mb={2} mt={2}>
            <FormLabel>Amount</FormLabel>
            <Input
              step={isNFT ? 1 : "any"}
              type={"number"}
              {...register("amount", {
                required: true,
              })}
              placeholder="Enter amount..."
            />
          </FormControl>
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
            <Button isDisabled={true} width={"100%"}>
              Insert Into Batch
            </Button>
          </Box>
        </ModalFooter>
      </form>
    </ModalContent>
  );
};

export const FillStep: React.FC<{
  onSubmit: (v: TransactionValues) => void;
  isLoading: boolean;
  sender?: string;
  recipient?: string;
  assetType: SendFormMode;
}> = ({ onSubmit, isLoading, sender, recipient, assetType }) => {
  if (assetType.type === "delegation") {
    return (
      <DelegateForm
        sender={sender}
        recipient={recipient}
        undelegate={assetType.data?.undelegate}
        isLoading={isLoading}
        onSubmit={(v) => {
          onSubmit({
            type: "delegation",
            values: {
              sender: v.sender,
              recipient: v.baker,
            },
          });
        }}
      />
    );
  }

  if (assetType.type === "tez") {
    return (
      <SendTezOrNFTForm
        sender={sender}
        isLoading={isLoading}
        onSubmit={(v) => {
          onSubmit({
            type: "tez",
            values: {
              amount: v.amount,
              sender: v.sender,
              recipient: v.recipient,
            },
          });
        }}
      />
    );
  }

  if (assetType.type === "nft") {
    return (
      <SendTezOrNFTForm
        sender={sender}
        isLoading={isLoading}
        onSubmit={(v) => {
          onSubmit({
            type: "nft",
            data: assetType.data,
            values: {
              amount: v.amount,
              sender: v.sender,
              recipient: v.recipient,
            },
          });
        }}
        nft={assetType.data}
      />
    );
  }
  return null;
};
