import { Box, Button, Divider, Flex, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { errorsActions, useAppDispatch, useAppSelector } from "@umami/state";

import { useColor } from "../../../styles/useColor";
import { EmptyMessage } from "../../EmptyMessage";
import { DrawerContentWrapper } from "../DrawerContentWrapper";

export const ErrorLogsMenu = () => {
  const color = useColor();
  const errors = [...useAppSelector(s => s.errors)].reverse();
  const dispatch = useAppDispatch();

  const clearErrors = () => dispatch(errorsActions.reset());

  return (
    <DrawerContentWrapper
      actions={
        <Flex>
          {Boolean(errors.length) && (
            <Flex gap="15px" marginTop="18px">
              <Button
                as={Link}
                width="auto"
                padding="0 24px"
                download="UmamiErrorLogs.json"
                href={`data:application/json;charset=utf-8,${encodeURIComponent(
                  JSON.stringify(errors)
                )}`}
                variant="primary"
              >
                Download
              </Button>
              <Button width="auto" padding="0 24px" onClick={clearErrors} variant="tertiary">
                Clear All
              </Button>
            </Flex>
          )}
        </Flex>
      }
      title="Error Logs"
    >
      {errors.length ? (
        <Box overflowY="auto">
          <VStack
            alignItems="flex-start"
            gap="24px"
            marginTop="24px"
            divider={<Divider />}
            spacing="0"
          >
            {errors.map((errorLog, index) => (
              <Box key={errorLog.timestamp + index} width="full">
                <Flex>
                  <Flex flexDirection="column">
                    <Heading color={color("900")} wordBreak="break-all" size="lg">
                      {errorLog.description}
                    </Heading>
                    <Text color={color("700")} size="sm">
                      {errorLog.timestamp}
                    </Text>
                    {errorLog.technicalDetails && (
                      <Text marginTop="12px" color={color("700")} size="sm">
                        {JSON.stringify(errorLog.technicalDetails)}
                      </Text>
                    )}
                  </Flex>
                </Flex>
              </Box>
            ))}
          </VStack>
        </Box>
      ) : (
        <EmptyMessage alignItems="flex-start" marginTop="40px" title="No logs to show" />
      )}
    </DrawerContentWrapper>
  );
};
