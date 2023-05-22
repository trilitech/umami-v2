import {
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  ModalFooter,
  Box,
  Button,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import colors from "../style/colors";
import { ConnectedAccountSelector } from "./AccountSelector/AccountSelector";

const useBuyTezModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { control, handleSubmit, formState } = useForm<{
    recipient: string;
  }>({
    mode: "onBlur",
  });
  const { isValid } = formState;

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={colors.gray[900]}>
          <form onSubmit={handleSubmit(() => {})}>
            <ModalCloseButton />
            <ModalHeader textAlign={"center"}>Buy Tez</ModalHeader>
            <Text textAlign="center">Please select the recipient account.</Text>
            <ModalBody>
              <FormControl paddingY={5}>
                <FormLabel>Recipient Account</FormLabel>
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="recipient"
                  render={({ field: { onChange, value } }) => (
                    <ConnectedAccountSelector
                      selected={value}
                      onSelect={(account) => {
                        onChange(account.pkh);
                      }}
                    />
                  )}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Box width={"100%"}>
                <Button
                  width={"100%"}
                  type="submit"
                  isDisabled={!isValid}
                  variant="ghost"
                  mb={2}
                >
                  Buy tez
                </Button>
              </Box>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    ),
    onOpen,
  };
};

export default useBuyTezModal;
