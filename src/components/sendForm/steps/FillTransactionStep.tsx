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
import { Account } from "../../../types/Account";
import { NFT } from "../../../types/Asset";
import { AccountSelector } from "../AccountSelector";
import { SendNFTDisplay } from "./SendNFTDisplay";

export type TransferFormValuesBase = {
  sender: string;
  recipient: string;
  amount: number;
};

export type FA2TokenTransferFormValues = {
  recipient: string;
  amount: number;
  token: NFT; // Handle non NFT tokens later
};

export const SendFormDisplay: React.FC<{
  accounts: Account[];
  onSubmit: (v: TransferFormValuesBase) => void;
  isLoading?: boolean;
  sender?: string;
  nft?: NFT;
}> = ({ accounts, onSubmit, isLoading, sender, nft }) => {
  const mandatoryNftSender = nft?.owner;
  const isNFT = !!nft;

  const { formState, control, register, handleSubmit } =
    useForm<TransferFormValuesBase>({
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
                <AccountSelector
                  isDisabled={isNFT}
                  selected={value}
                  onSelect={(a) => {
                    onChange(a.pkh);
                  }}
                  accounts={accounts}
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

          {!!nft ? <SendNFTDisplay nft={nft} /> : null}

          <FormControl mb={2}>
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
