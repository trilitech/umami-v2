import { Box, Button, Center, Flex, FlexProps, Heading, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import pluralize from "pluralize";
import { useContext } from "react";

import { HourglassIcon } from "../../../../assets/icons";
import colors from "../../../../style/colors";
import { ImplicitAccount } from "../../../../types/Account";
import { makeAccountOperations } from "../../../../types/AccountOperations";
import { prettyTezAmount } from "../../../../utils/format";
import {
  useGetAccountUnstakeRequests,
  useGetFinalizeRemainingCycles,
} from "../../../../utils/hooks/assetsHooks";
import { useSelectedNetwork } from "../../../../utils/hooks/networkHooks";
import { useAsyncActionHandler } from "../../../../utils/hooks/useAsyncActionHandler";
import { estimate, sumTez } from "../../../../utils/tezos";
import { RawTzktUnstakeRequest } from "../../../../utils/tzkt/types";
import { DynamicModalContext } from "../../../DynamicModal";
import { PrettyNumber } from "../../../PrettyNumber";
import { SignPage } from "../../../SendFlow/FinalizeUnstake/SignPage";

export const PendingUnstakeRequest: React.FC<
  {
    account: ImplicitAccount;
    request: RawTzktUnstakeRequest;
  } & FlexProps
> = ({ request, account, ...props }) => {
  const getFinalizeRemainingCycles = useGetFinalizeRemainingCycles();
  const allUnstakeRequests = useGetAccountUnstakeRequests()(account.address.pkh);
  const cyclesLeft = getFinalizeRemainingCycles(request);
  const { openWith } = useContext(DynamicModalContext);
  const { handleAsyncAction, isLoading } = useAsyncActionHandler();
  const network = useSelectedNetwork();

  const isFinalizable = !cyclesLeft;
  const requestedOn = format(request.timestamp, " dd MMM yyyy");

  const onFinalize = () =>
    handleAsyncAction(async () => {
      const totalFinalizableAmount = sumTez(
        allUnstakeRequests
          .filter(req => getFinalizeRemainingCycles(req) === 0)
          .map(req => req.requestedAmount)
      );
      const accountOperations = makeAccountOperations(account, account, [
        { type: "finalize_unstake", sender: account.address },
      ]);
      const fee = await estimate(accountOperations, network);
      await openWith(
        <SignPage
          data={{ finalizableAmount: totalFinalizableAmount }}
          fee={fee}
          mode="single"
          operations={accountOperations}
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
        <PrettyNumber number={prettyTezAmount(request.requestedAmount)} size="md" />
        <Box display="inline" color={colors.gray[450]}>
          <Text display="inline" size="sm">
            Requested on
          </Text>
          <Heading display="inline" size="sm">
            {requestedOn}
          </Heading>
        </Box>
      </Flex>
      <Flex flexDirection="column-reverse">
        {isFinalizable ? (
          <Button isLoading={isLoading} onClick={onFinalize}>
            Finalize
          </Button>
        ) : (
          <Center gap="4px">
            <Text color={colors.gray[300]} size="sm">
              Awaiting next cycle in {cyclesLeft} {pluralize("cycle", cyclesLeft)}
            </Text>
            <HourglassIcon stroke={colors.orange} />
          </Center>
        )}
      </Flex>
    </Flex>
  );
};
