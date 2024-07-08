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
} from "@chakra-ui/react";
import {
  type FA12TokenBalance,
  type FA2TokenBalance,
  getSmallestUnit,
  tokenDecimals,
  tokenSymbolSafe,
} from "@umami/core";

type SendTokensFormProps = { token: FA12TokenBalance | FA2TokenBalance };

export const SendTokensForm = ({ token }: SendTokensFormProps) => {
  const decimals = tokenDecimals(token);
  const smallestUnit = getSmallestUnit(Number(decimals));

  return (
    <ModalContent>
      <ModalHeader>
        Send
        <ModalCloseButton />
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

            <FormErrorMessage data-testid="amount-error">error</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={false}>
            <FormLabel>To</FormLabel>
            <InputGroup>
              <Input placeholder="Enter address or select from contacts" variant="filled" />
              <InputRightElement paddingRight="10px">
                <Button variant="inputElement">Select</Button>
              </InputRightElement>
            </InputGroup>

            <FormErrorMessage data-testid="amount-error">error</FormErrorMessage>
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
