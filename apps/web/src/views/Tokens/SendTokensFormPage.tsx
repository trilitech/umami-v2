import {
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
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import {
  type FA12TokenBalance,
  type FA2TokenBalance,
  getSmallestUnit,
  tokenDecimals,
  tokenSymbolSafe,
} from "@umami/core";

import { RecipientsPage } from "./RecipientsPage";

type SendTokensFormProps = { token: FA12TokenBalance | FA2TokenBalance };

export const SendTokensFormPage = ({ token }: SendTokensFormProps) => {
  const decimals = tokenDecimals(token);
  const smallestUnit = getSmallestUnit(Number(decimals));
  const { openWith, onClose } = useDynamicModalContext();
  const addressPlaceholderText = useBreakpointValue({
    base: "Enter address or select",
    ls: "Enter address or select from contacts",
  });

  return (
    <ModalContent>
      <ModalHeader>
        Send
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>
      <ModalBody>
        <Stack width="full">
          <FormControl isInvalid={false}>
            <FormLabel>Amount</FormLabel>
            <InputGroup>
              <Input placeholder={smallestUnit}></Input>
              <InputRightElement paddingRight="12px" data-testid="token-symbol">
                {tokenSymbolSafe(token)}
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>error</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={false}>
            <FormLabel>To</FormLabel>
            <InputGroup>
              <Input placeholder={addressPlaceholderText} variant="filled" />
              <InputRightElement paddingRight="10px">
                <Button onClick={() => openWith(<RecipientsPage />)} variant="inputElement">
                  Select
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>error</FormErrorMessage>
          </FormControl>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button width="full" rounded="full" variant="primary">
          Preview
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
