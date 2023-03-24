import { TezosNetwork } from "@airgap/tezos";
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
  useToast,
} from "@chakra-ui/react";
import { Estimate } from "@taquito/taquito";
import { isValid } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TezTransfer } from "./FillTransactionStep";
import { UmamiEncrypted } from "../../../types/UmamiEncrypted";
import { transfer as transferTez } from "../../../utils/tezos";

export const RecapDisplay: React.FC<{
  recap: {
    network: TezosNetwork;
    transfer: TezTransfer;
    estimate: Estimate;
    esk: UmamiEncrypted;
  };
  onSucces: (hash: string) => void;
}> = ({ recap: { estimate, transfer, esk, network }, onSucces }) => {
  const { register, handleSubmit } = useForm<{ password: string }>();
  const toast = useToast();
  let [isLoading, setIsLoading] = useState(false);

  const onSubmit = async ({ password }: { password: string }) => {
    setIsLoading(true);
    try {
      const result = await transferTez(
        network,
        esk,
        transfer.recipient,
        transfer.amount,
        password
      );
      onSucces(result.hash);
      toast({ title: "Success", description: result.hash });
    } catch (error: any) {
      toast({ title: "Error", description: error.message });
    }
    setIsLoading(false);
  };

  return (
    <ModalContent bg="umami.gray.900">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalCloseButton />
        <ModalHeader textAlign={"center"}>Recap</ModalHeader>
        <Text textAlign={"center"}>Transaction details</Text>
        <ModalBody>
          <Box>
            <Text> from: {transfer.sender}</Text>
            <Text> To: {transfer.recipient}</Text>
            <Text> Amount: {transfer.amount}</Text>
            <Text> Fee: {estimate.suggestedFeeMutez}</Text>
          </Box>
          <FormControl isInvalid={false}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              {...register("password", {
                required: true,
                minLength: 4,
              })}
              placeholder="Enter password..."
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            bg="umami.blue"
            width={"100%"}
            isLoading={isLoading}
            type="submit"
            isDisabled={!isValid || isLoading}
          >
            Submit Transaction
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
};
