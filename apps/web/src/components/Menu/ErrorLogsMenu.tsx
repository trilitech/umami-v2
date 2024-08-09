import { Box, Button, Divider, Flex, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { errorsActions, useAppDispatch, useAppSelector } from "@umami/state";

import { DrawerContentWrapper } from "./DrawerContentWrapper";
import { useColor } from "../../styles/useColor";
import { EmptyMessage } from "../EmptyMessage";

export const ErrorLogsMenu = () => {
  const color = useColor();
  const errors = [...useAppSelector(s => s.errors)].reverse();
  const dispatch = useAppDispatch();

  const clearErrors = () => dispatch(errorsActions.reset());

  return (
    <DrawerContentWrapper title="Error Logs">
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
      <Divider marginTop={{ base: "36px", lg: "40px" }} />
      {errors.length ? (
        <Box overflowY="auto">
          <VStack
            alignItems="flex-start"
            gap="24px"
            marginTop="24px"
            divider={<Divider />}
            spacing="0"
          >
            {errors.map(errorLog => (
              <Box key={errorLog.timestamp} width="full">
                <Flex>
                  <Flex flexDirection="column">
                    <Heading color={color("900")} wordBreak="break-all" size="lg">
                      {errorLog.description}
                    </Heading>
                    <Text color={color("700")} size="sm">
                      {errorLog.timestamp}
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </VStack>
        </Box>
      ) : (
        <EmptyMessage alignItems="flex-start" marginTop="40px" title="logs" />
      )}
    </DrawerContentWrapper>
  );
};
