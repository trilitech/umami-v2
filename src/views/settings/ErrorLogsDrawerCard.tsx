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
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { MdCopyAll } from "react-icons/md";
import { SettingsCardWithDrawerIcon } from "../../components/ClickableCard";
import { TextAndIconBtn } from "../../components/TextAndIconBtn";
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
    <>
      <SettingsCardWithDrawerIcon left="ErrorLogs" onClick={onOpen} />
      <Drawer isOpen={isOpen} placement="right" onClose={handleClose} size="md">
        <DrawerOverlay />
        <DrawerContent maxW="594px" bg="umami.gray.900">
          <DrawerTopButtons onPrevious={() => {}} onNext={() => {}} onClose={handleClose} />
          <DrawerBody>
            <ErrorLogsDrawerBody />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const ErrorLogsDrawerBody = () => {
  return (
    <Flex direction="column" height="100%">
      <Flex h={24} justifyContent="space-between" alignItems="center">
        <Heading size="xl">Error Logs</Heading>
        <TextAndIconBtn text="Clear All" icon={BsTrash} onClick={() => {}} />
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
