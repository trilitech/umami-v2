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
  Icon,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { nanoid } from "@reduxjs/toolkit";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";

import { SettingsCardWithDrawerIcon } from "../../components/ClickableCard";
import { useDynamicModal } from "../../components/DynamicModal";
import colors from "../../style/colors";
import { ErrorContext } from "../../utils/getErrorContext";
import { useAppSelector } from "../../utils/redux/hooks";
import { errorsSlice } from "../../utils/redux/slices/errorsSlice";
import { DrawerTopButtons } from "../home/DrawerTopButtons";

export const ErrorLogsDrawerCard = () => {
  const { isOpen, onClose: closeDrawer, onOpen } = useDisclosure();
  const { isOpen: isDynamicModalOpen } = useDynamicModal();

  return (
    <>
      <SettingsCardWithDrawerIcon left="Error Logs" isSelected={isOpen} onClick={onOpen} />
      <Drawer
        blockScrollOnMount={!isDynamicModalOpen}
        isOpen={isOpen}
        onClose={closeDrawer}
        placement="right"
      >
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

  const clearErrors = () => {
    dispatch(errorsSlice.actions.reset());
  };

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

const ErrorLogRow: React.FC<{
  errorLog: ErrorContext;
}> = ({ errorLog }) => (
  <>
    <Divider marginY={1} />
    <Flex justifyContent="space-between" paddingY={3}>
      <Flex>
        <Icon as={AiOutlineExclamationCircle} marginTop="1px" marginRight={2} />
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
