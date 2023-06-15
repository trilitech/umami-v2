import { TezosNetwork } from "@airgap/tezos";
import {
  FormControl,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Text,
  ModalFooter,
  Box,
  Button,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { navigateToExternalLink } from "../../utils/helpers";
import { useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { wertUrls } from "../../utils/tezos/consts";
import { ConnectedAccountSelector } from "../AccountSelector/AccountSelector";

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

  const { control, handleSubmit, formState } = useForm<{
    recipient: string;
  }>({
    mode: "onBlur",
  });

  const { isValid } = formState;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalCloseButton />
      <ModalHeader textAlign={"center"}>Buy Tez</ModalHeader>
      {isMainnet && (
        <>
          <Text textAlign="center">Please select the recipient account.</Text>
          <ModalBody data-testid="buy-tez-selector">
            <FormControl paddingY={5}>
              <FormLabel>Recipient Account</FormLabel>
              <Controller
                rules={{ required: isMainnet }}
                control={control}
                name="recipient"
                render={({ field: { onChange, value } }) => (
                  <ConnectedAccountSelector
                    selected={value}
                    onSelect={account => {
                      onChange(account.pkh);
                    }}
                  />
                )}
              />
            </FormControl>
          </ModalBody>
        </>
      )}

      <ModalFooter>
        <Box width={"100%"} data-testid="buy-tez-button">
          <Button width={"100%"} type="submit" isDisabled={!isValid} variant="ghost" mb={2}>
            {title}
          </Button>
        </Box>
      </ModalFooter>
    </form>
  );
};

export default BuyTezForm;
