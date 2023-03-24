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
import { AccountSelector } from "../AccountSelector";

export type TezTransfer = {
  sender: string;
  recipient: string;
  amount: number;
};

export const SendFormDisplay: React.FC<{
  accounts: Account[];
  onSubmit: (v: TezTransfer) => void;
  isLoading?: boolean;
}> = ({ accounts, onSubmit, isLoading }) => {
  const { formState, control, register, handleSubmit } = useForm<TezTransfer>({
    mode: "onBlur",
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
          <FormControl mb={2}>
            <FormLabel>Amount</FormLabel>
            <Input
              type={"number"}
              //   type="password"
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
