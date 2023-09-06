import {
  FormControl,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Text,
  ModalFooter,
  Box,
  Button,
} from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { navigateToExternalLink } from "../../utils/helpers";
import { OwnedImplicitAccountsAutocomplete } from "../AddressAutocomplete";
import { FormErrorMessage } from "../FormErrorMessage";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";

const BuyTezForm = () => {
  const network = useSelectedNetwork();
  const isMainnet = network.name === "mainnet";
  const title = isMainnet ? "Buy Tez" : "Request Tez from faucet";

  const onSubmit = async ({ recipient }: { recipient: string }) => {
    let url = network.buyTezUrl;
    if (!url) {
      throw new Error(`${network.name} does not have a buyTezUrl defined`);
    }
    if (isMainnet) {
      url += `/default/widget/?commodity=XTZ%3ATezos&address=${recipient}`;
    }
    navigateToExternalLink(url);
  };

  const form = useForm<{ recipient: string }>({ mode: "onBlur" });
  const {
    handleSubmit,
    formState: { isValid, errors },
  } = form;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalCloseButton />
        <ModalHeader textAlign="center">Buy Tez</ModalHeader>
        {isMainnet && (
          <>
            <Text textAlign="center">Please select the recipient account.</Text>
            <ModalBody>
              <FormControl
                data-testid="buy-tez-selector"
                paddingY={5}
                isInvalid={!!errors.recipient}
              >
                <OwnedImplicitAccountsAutocomplete
                  label="Recipient Account"
                  inputName="recipient"
                  allowUnknown={false}
                />
                {errors.recipient && (
                  <FormErrorMessage>{errors.recipient.message}</FormErrorMessage>
                )}
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
    </FormProvider>
  );
};

export default BuyTezForm;
