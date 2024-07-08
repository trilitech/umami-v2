import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { nanoid } from "@reduxjs/toolkit";
import { type ErrorContext } from "@umami/core";
import { errorsActions, useAppSelector } from "@umami/state";
import { useDispatch } from "react-redux";

import { OutlineExclamationCircleIcon } from "../../assets/icons";
import { SettingsCardWithDrawerIcon } from "../../components/ClickableCard";
import { DrawerTopButtons } from "../../components/DrawerTopButtons";
import colors from "../../style/colors";

export const ErrorLogsDrawerCard = () => {
  const { isOpen, onClose: closeDrawer, onOpen } = useDisclosure();

  return (
    <>
      <SettingsCardWithDrawerIcon left="Error Logs" isSelected={isOpen} onClick={onOpen} />
      <Drawer blockScrollOnMount={false} isOpen={isOpen} onClose={closeDrawer} placement="right">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <DrawerTopButtons onClose={closeDrawer} />
            <ErrorLogsDrawerBody />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const ErrorLogsDrawerBody = () => {
  const errors = [...useAppSelector(s => s.errors)].reverse();
  const dispatch = useDispatch();

  const clearErrors = () => dispatch(errorsActions.reset());

  return (
    <Flex flexDirection="column" height="100%">
      <Flex alignItems="center" justifyContent="space-between" height="50px" marginBottom="20px">
        <Heading size="xl">Error Logs</Heading>

        <Box>
          <a
            download="UmamiErrorLogs.json"
            href={`data:application/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(errors)
            )}`}
          >
            <Button variant="tertiary">Download error logs</Button>
          </a>
          <Button marginLeft="8px" onClick={clearErrors} variant="warning">
            Clear All
          </Button>
        </Box>
      </Flex>
      {errors.map(error => (
        <ErrorLogRow key={nanoid()} errorLog={error} />
      ))}
    </Flex>
  );
};

const ErrorLogRow = ({ errorLog }: { errorLog: ErrorContext }) => (
  <>
    <Divider marginY={1} />
    <Flex justifyContent="space-between" paddingY="12px">
      <Flex>
        <OutlineExclamationCircleIcon marginTop="1px" marginRight="8px" />
        <Flex flexDirection="column">
          <Heading wordBreak="break-all" size="sm">
            {errorLog.description}
          </Heading>
          <Text color={colors.gray[400]} size="sm">
            {errorLog.timestamp}
          </Text>
        </Flex>
      </Flex>
      {/* TODO:Implement delete */}
      {/* <Flex justifyContent="space-around">
          <Icon
            as={MdCopyAll}
            mr={3}
            cursor="pointer"
            color={colors.gray[600]}
            _hover={{
              color: colors.gray[300],
            }}
          />
          <Icon
            as={Trash}
            cursor="pointer"
            color={colors.gray[600]}
            _hover={{
              color: colors.gray[300],
            }}
          />
        </Flex> */}
    </Flex>
  </>
);
