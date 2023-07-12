import { TezosNetwork } from "@airgap/tezos";
import {
  FormControl,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Text,
  ModalFooter,
  Box,
  Button,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { navigateToExternalLink } from "../../utils/helpers";
import { useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { wertUrls } from "../../utils/tezos/consts";
import { OwnedImplicitAccountsAutocomplete } from "../AddressAutocomplete";

const BuyTezForm = () => {
  const network = useSelectedNetwork();
  const isMainnet = network === TezosNetwork.MAINNET;
  const title = isMainnet ? "Buy Tez" : "Request Tez from faucet";

  const onSubmit = async ({ recipient }: { recipient: string }) => {
    let url = wertUrls[network];
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
            <ModalBody data-testid="buy-tez-selector">
              <FormControl paddingY={5} isInvalid={!!errors.recipient}>
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
            <Button width="100%" type="submit" isDisabled={!isValid} variant="ghost" mb={2}>
              {title}
            </Button>
          </Box>
        </ModalFooter>
      </form>
    </FormProvider>
  );
};

export default BuyTezForm;
