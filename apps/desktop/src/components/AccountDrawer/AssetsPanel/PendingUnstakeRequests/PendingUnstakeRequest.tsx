import { Box, Center, Flex, type FlexProps, Heading, Link, Text } from "@chakra-ui/react";
import { useGetFirstFinalizableCycle, useSelectedNetwork } from "@umami/state";
import { prettyTezAmount } from "@umami/tezos";
import { type RawTzktUnstakeRequest } from "@umami/tzkt";

import { HourglassIcon } from "../../../../assets/icons";
import colors from "../../../../style/colors";
import { PrettyNumber } from "../../../PrettyNumber";

/**
 * @param account - account to display the pending unstake request for
 * @param request - the unstake request to display (it should not be finalizable yet)
 */
// TODO: test
export const PendingUnstakeRequest = ({
  request,
  ...props
}: {
  request: RawTzktUnstakeRequest;
} & FlexProps) => {
  const firstFinalizableCycle = useGetFirstFinalizableCycle()(request.cycle);
  const { tzktExplorerUrl } = useSelectedNetwork();

  return (
    <Flex
      justifyContent="space-between"
      padding="15px"
      background={colors.gray[700]}
      borderRadius="8px"
      {...props}
    >
      <Flex flexDirection="column" gap="8px">
        <PrettyNumber number={prettyTezAmount(request.amount)} size="md" />
        <Box display="inline" color={colors.gray[450]}>
          <Text display="inline" size="sm">
            Requested in{" "}
          </Text>
          <Heading display="inline" size="sm">
            cycle {request.cycle}
          </Heading>
        </Box>
      </Flex>
      <Flex flexDirection="column-reverse">
        <Center gap="4px">
          <Text color={colors.gray[300]} size="sm">
            Ready to be finalized in cycle{" "}
            <Link href={`${tzktExplorerUrl}/cycles`} isExternal>
              {firstFinalizableCycle}
            </Link>
          </Text>
          <HourglassIcon stroke={colors.orange} />
        </Center>
      </Flex>
    </Flex>
  );
};
