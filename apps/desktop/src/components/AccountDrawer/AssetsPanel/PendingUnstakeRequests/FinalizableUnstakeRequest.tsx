import { Box, Button, Center, Flex, type FlexProps, Text } from "@chakra-ui/react";
import { DynamicModalContext } from "@umami/components";
import { type ImplicitAccount, estimate, makeAccountOperations } from "@umami/core";
import {
  useAccountTotalFinalizableUnstakeAmount,
  useAsyncActionHandler,
  useSelectedNetwork,
} from "@umami/state";
import { prettyTezAmount } from "@umami/tezos";
import { useContext } from "react";

import colors from "../../../../style/colors";
import { PrettyNumber } from "../../../PrettyNumber";
import { SignPage } from "../../../SendFlow/FinalizeUnstake/SignPage";

/**
 * Component that displays a consolidated finalizable unstake request for an account
 *
 * If there are no finalizable unstake requests, it returns null
 *
 * @param account - account to display the finalizable unstake request for
 */
// TODO: test
export const FinalizableUnstakeRequest: React.FC<
  {
    account: ImplicitAccount;
  } & FlexProps
> = ({ account, ...props }) => {
  const { openWith } = useContext(DynamicModalContext);
  const { handleAsyncAction, isLoading } = useAsyncActionHandler();
  const network = useSelectedNetwork();
  const totalFinalizableAmount = useAccountTotalFinalizableUnstakeAmount(account.address.pkh);

  if (totalFinalizableAmount.eq(0)) {
    return null;
  }

  const onFinalize = () =>
    handleAsyncAction(async () => {
      const accountOperations = makeAccountOperations(account, account, [
        { type: "finalize_unstake", sender: account.address },
      ]);
      const estimatedOperations = await estimate(accountOperations, network);

      return openWith(
        <SignPage
          data={{ finalizableAmount: totalFinalizableAmount }}
          mode="single"
          operations={estimatedOperations}
        />
      );
    });

  return (
    <Flex
      justifyContent="space-between"
      padding="15px"
      background={colors.gray[700]}
      borderRadius="8px"
      {...props}
    >
      <Flex flexDirection="column" gap="8px">
        <PrettyNumber number={prettyTezAmount(totalFinalizableAmount)} size="md" />
        <Box display="inline" color={colors.gray[450]}>
          <Text display="inline" size="sm">
            Ready to be finalized
          </Text>
        </Box>
      </Flex>
      <Center>
        <Button isLoading={isLoading} onClick={onFinalize}>
          Finalize
        </Button>
      </Center>
    </Flex>
  );
};
