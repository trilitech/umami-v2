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
} from "@chakra-ui/react";
import { AiOutlineExclamationCircle, AiOutlineRight } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { MdCopyAll } from "react-icons/md";
import { SettingsCard } from "../../components/ClickableCard";
import { mockErrorLogs } from "../../mocks/errorLogs";
import colors from "../../style/colors";
import { ErrorLog } from "../../types/ErrorLog";
import { DrawerTopButtons } from "../home/DrawerTopButtons";

const ErrorLogsDrawerCard = () => {
  const { isOpen, onClose: closeDrawer, onOpen } = useDisclosure();

  const handleClose = () => {
    closeDrawer();
  };

  return (
    <SettingsCard left="ErrorLogs" onClick={onOpen}>
      <Icon
        as={AiOutlineRight}
        color={colors.gray[600]}
        _hover={{
          color: colors.gray[300],
        }}
        onClick={onOpen}
      />

      <Drawer isOpen={isOpen} placement="right" onClose={handleClose} size="md">
        <DrawerOverlay />
        <DrawerContent bg="umami.gray.900">
          <DrawerTopButtons
            onPrevious={() => {}}
            onNext={() => {}}
            onClose={handleClose}
          />
          <DrawerBody>
            <ErrorLogsDrawerBody />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </SettingsCard>
  );
};

const ErrorLogsDrawerBody = () => {
  return (
    <Flex direction="column" height={"100%"}>
      <Flex h={24} justifyContent="space-between" alignItems="center">
        <Heading size="xl">Error Logs</Heading>
        <Flex
          alignItems="center"
          color={colors.gray[600]}
          _hover={{
            color: colors.gray[300],
          }}
          cursor="pointer"
        >
          <Text size="sm" mr={3}>
            Clear All
          </Text>
          <Icon as={BsTrash} />
        </Flex>
      </Flex>
      {mockErrorLogs.map((log, i) => (
        <ErrorLogRow errorLog={log} key={i} />
      ))}
    </Flex>
  );
};

const ErrorLogRow: React.FC<{
  errorLog: ErrorLog;
}> = ({ errorLog }) => {
  return (
    <>
      <Divider marginY={1} />
      <Flex justifyContent="space-between" paddingY={3}>
        <Flex>
          <Icon as={AiOutlineExclamationCircle} mr={2} mt="1px" />
          <Flex direction="column">
            <Heading size="sm" wordBreak="break-all">
              {errorLog.message}
            </Heading>
            <Text color={colors.gray[600]} size="sm">
              {errorLog.timestamp}
            </Text>
          </Flex>
        </Flex>
        <Flex justifyContent="space-around">
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
            as={BsTrash}
            cursor="pointer"
            color={colors.gray[600]}
            _hover={{
              color: colors.gray[300],
            }}
          />
        </Flex>
      </Flex>
    </>
  );
};

export default ErrorLogsDrawerCard;
