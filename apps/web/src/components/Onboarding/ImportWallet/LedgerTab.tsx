import { Button, Flex, Heading, Link, ListItem, OrderedList } from "@chakra-ui/react";
import { type Curves } from "@taquito/signer";
import { useDynamicModalContext, useMultiForm } from "@umami/components";
import {
  useAsyncActionHandler,
  useGetNextAvailableAccountLabels,
  useRestoreLedger,
} from "@umami/state";
import {
  defaultDerivationPathTemplate,
  getLedgerPublicKeyPair,
  makeDerivationPath,
  parseImplicitPkh,
} from "@umami/tezos";
import { FormProvider } from "react-hook-form";

import { useColor } from "../../../styles/useColor";
import { AdvancedAccountSettings } from "../AdvancedAccountSettings";

type FormFields = {
  derivationPath: string;
  curve: Curves;
};

export const LedgerTab = () => {
  const color = useColor();
  const restoreLedger = useRestoreLedger();
  const { onClose } = useDynamicModalContext();
  const getNextAvailableAccountLabels = useGetNextAvailableAccountLabels();
  const form = useMultiForm<FormFields>({
    mode: "onBlur",
    defaultValues: {
      derivationPath: defaultDerivationPathTemplate,
      curve: "ed25519",
    },
  });
  const { handleAsyncAction, isLoading } = useAsyncActionHandler();

  const onSubmit = ({ derivationPath: derivationPathTemplate, curve }: FormFields) =>
    handleAsyncAction(async () => {
      const derivationPath = makeDerivationPath(derivationPathTemplate, 0);
      const { pk, pkh } = await getLedgerPublicKeyPair(derivationPath, curve);

      restoreLedger({
        type: "ledger",
        derivationPathTemplate,
        derivationPath,
        pk,
        address: parseImplicitPkh(pkh),
        label: getNextAvailableAccountLabels("Account")[0],
        curve,
      });
      return onClose();
    });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Flex flexDirection="column" gap="30px">
          <OrderedList marginLeft="0" listStyleType="none" spacing="12px" variant="explanation">
            <ListItem>
              <Heading color={color("black")} size="lg">
                1
              </Heading>
              Plug in your ledger into your computer
            </ListItem>

            <ListItem>
              <Heading color={color("black")} size="lg">
                2
              </Heading>
              Unlock your ledger
            </ListItem>

            <ListItem>
              <Heading color={color("black")} size="lg">
                3
              </Heading>
              Ensure your ledger has the{" "}
              <Link
                textDecoration="underline"
                _hover={{ color: color("600") }}
                href="https://support.ledger.com/article/360002731113-zd"
                isExternal
              >
                latest firmware
              </Link>{" "}
              version
            </ListItem>

            <ListItem>
              <Heading color={color("black")} size="lg">
                4
              </Heading>
              Install & open the{" "}
              <Link
                textDecoration="underline"
                _hover={{ color: color("600") }}
                href="https://support.ledger.com/article/360016057774-zd"
                isExternal
              >
                Tezos Wallet
              </Link>{" "}
              app on your ledger
            </ListItem>

            <ListItem>
              <Heading color={color("black")} size="lg">
                5
              </Heading>
              Click the button below & confirm on your ledger
            </ListItem>
          </OrderedList>

          <AdvancedAccountSettings />

          <Button width="full" isLoading={isLoading} type="submit" variant="primary">
            Import Wallet
          </Button>
        </Flex>
      </form>
    </FormProvider>
  );
};
