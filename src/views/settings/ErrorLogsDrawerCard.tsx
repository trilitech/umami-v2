import {
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  Icon,
  useDisclosure,
  Text,
  Button,
} from "@chakra-ui/react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { SettingsCardWithDrawerIcon } from "../../components/ClickableCard";
import colors from "../../style/colors";
import { ErrorContext } from "../../utils/getErrorContext";
import { useAppSelector } from "../../utils/redux/hooks";
import { DrawerTopButtons } from "../home/DrawerTopButtons";
import { nanoid } from "@reduxjs/toolkit";
import { useDynamicModal } from "../../components/DynamicModal";

const ErrorLogsDrawerCard = () => {
  const { isOpen, onClose: closeDrawer, onOpen } = useDisclosure();
  const { isOpen: isDynamicModalOpen } = useDynamicModal();

  const handleClose = () => {
    closeDrawer();
  };

  return (
    <>
      <SettingsCardWithDrawerIcon left="ErrorLogs" onClick={onOpen} isSelected={isOpen} />
      <Drawer
        blockScrollOnMount={!isDynamicModalOpen}
        isOpen={isOpen}
        placement="right"
        onClose={handleClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <DrawerTopButtons onClose={handleClose} />
            <ErrorLogsDrawerBody />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const ErrorLogsDrawerBody = () => {
  const errors = [...useAppSelector(s => s.errors)].reverse();
  return (
    <Flex direction="column" height="100%">
      <Flex h={24} justifyContent="space-between" alignItems="center">
        <Heading size="xl">Error Logs</Heading>
        <a
          download="UmamiErrorLogs.json"
          href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(errors))}`}
        >
          <Button variant="tertiary">Download error logs</Button>
        </a>
        {/* TODO:Implement delete */}
        {/* <IconAndTextBtn label="Clear All" icon={Trash} textFirst onClick={() => {}} /> */}
      </Flex>
      {errors.map(error => (
        <ErrorLogRow errorLog={error} key={nanoid()} />
      ))}
    </Flex>
  );
};

const ErrorLogRow: React.FC<{
  errorLog: ErrorContext;
}> = ({ errorLog }) => {
  return (
    <>
      <Divider marginY={1} />
      <Flex justifyContent="space-between" paddingY={3}>
        <Flex>
          <Icon as={AiOutlineExclamationCircle} mr={2} mt="1px" />
          <Flex direction="column">
            <Heading size="sm" wordBreak="break-all">
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
};

export default ErrorLogsDrawerCard;
