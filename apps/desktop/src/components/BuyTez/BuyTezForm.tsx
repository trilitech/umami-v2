import {
  Box,
  Button,
  FormControl,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useSelectedNetwork } from "@umami/state";
import { type RawPkh } from "@umami/tezos";
import { FormProvider, useForm } from "react-hook-form";

import colors from "../../style/colors";
import { OwnedImplicitAccountsAutocomplete } from "../AddressAutocomplete";
import { FormErrorMessage } from "../FormErrorMessage";

export const BuyTezForm = ({ recipient: defaultRecipient = "" }: { recipient?: RawPkh }) => {
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
    actionURL += "/default/widget/";
  }

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form action={actionURL} rel="noreferrer noopener" target="_blank">
          <ModalCloseButton />
          <ModalHeader marginBottom="10px" textAlign="center">
            Buy Tez
          </ModalHeader>
          {isMainnet && (
            <>
              <input name="commodity" type="hidden" value="XTZ:Tezos" />
              <Text color={colors.gray[400]} textAlign="center" size="sm">
                Please select the recipient account.
              </Text>
              <ModalBody>
                <FormControl
                  data-testid="buy-tez-selector"
                  isInvalid={!!errors.address}
                  paddingY={5}
                >
                  <OwnedImplicitAccountsAutocomplete
                    allowUnknown={false}
                    inputName="address"
                    isDisabled={!!defaultRecipient}
                    label="Recipient Account"
                  />
                  {errors.address && <FormErrorMessage>{errors.address.message}</FormErrorMessage>}
                </FormControl>
              </ModalBody>
            </>
          )}

          <ModalFooter>
            <Box width="100%" data-testid="buy-tez-button">
              <Button width="100%" marginBottom={2} isDisabled={!isValid} size="lg" type="submit">
                {title}
              </Button>
            </Box>
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
