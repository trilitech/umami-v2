import {
  FormControl,
  ModalBody,
  ModalHeader,
  Text,
  ModalFooter,
  Box,
  Button,
  ModalContent,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { OwnedImplicitAccountsAutocomplete } from "../AddressAutocomplete";
import { FormErrorMessage } from "../FormErrorMessage";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { RawPkh } from "../../types/Address";

const BuyTezForm: React.FC<{
  recipient?: RawPkh;
}> = ({ recipient: defaultRecipient = "" }) => {
  const network = useSelectedNetwork();
  const isMainnet = network.name === "mainnet";
  const title = isMainnet ? "Buy Tez" : "Request Tez from faucet";

  const form = useForm<{ address: string }>({
    mode: "onBlur",
    defaultValues: {
      address: defaultRecipient,
    },
  });
  const {
    formState: { isValid, errors },
  } = form;

  let actionURL = network.buyTezUrl;
  if (network.buyTezUrl && isMainnet) {
    actionURL += `/default/widget/`;
  }

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form action={actionURL} rel="noreferrer noopener" target="_blank">
          <ModalCloseButton />
          <ModalHeader textAlign="center">Buy Tez</ModalHeader>
          {isMainnet && (
            <>
              <input type="hidden" name="commodity" value="XTZ:Tezos" />
              <Text textAlign="center">Please select the recipient account.</Text>
              <ModalBody>
                <FormControl
                  data-testid="buy-tez-selector"
                  paddingY={5}
                  isInvalid={!!errors.address}
                >
                  <OwnedImplicitAccountsAutocomplete
                    label="Recipient Account"
                    inputName="address"
                    allowUnknown={false}
                    isDisabled={!!defaultRecipient}
                  />
                  {errors.address && <FormErrorMessage>{errors.address.message}</FormErrorMessage>}
                </FormControl>
              </ModalBody>
            </>
          )}

          <ModalFooter>
            <Box width="100%" data-testid="buy-tez-button">
              <Button width="100%" type="submit" size="lg" isDisabled={!isValid} mb={2}>
                {title}
              </Button>
            </Box>
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};

export default BuyTezForm;
