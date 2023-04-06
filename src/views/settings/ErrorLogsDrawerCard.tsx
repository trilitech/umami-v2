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
import { SettingsCard } from "../../components/SettingsCard";
import colors from "../../style/colors";
import { DrawerTopButtons } from "../home/DrawerTopButtons";

const ErrorLogsDrawerCard = () => {
  const { isOpen, onClose: closeDrawer, onOpen } = useDisclosure();

  const handleClose = () => {
    closeDrawer();
  };

  return (
    <SettingsCard about="ErrorLogs" onClick={onOpen}>
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

const fixture = [
  { message: "Error 404 - Not Found", timestamp: "Mon 27 Mar 2023 13:27:01" },
  {
    message: "(temporary)proto.015-PtLimaPt.tez.subtraction_underflow",
    timestamp: "Mon 27 Mar 2023 13:27:01",
  },
  {
    message: "Expected field 'hash'	in array at index 0",
    timestamp: "Mon 27 Mar 2023 13:27:01",
  },
  { message: "Account is empty", timestamp: "Mon 27 Mar 2023 13:27:01" },
];

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
      {fixture.map((log) => (
        <ErrorLogRow message={log.message} timestamp={log.timestamp} />
      ))}
    </Flex>
  );
};

const ErrorLogRow: React.FC<{
  message: string;
  timestamp: string;
}> = ({ message, timestamp }) => {
  return (
    <>
      <Divider marginY={1} />
      <Flex justifyContent="space-between" paddingY={3}>
        <Flex>
          <Icon as={AiOutlineExclamationCircle} mr={2} mt="1px" />
          <Flex direction="column">
            <Heading size="sm" wordBreak="break-all">
              {message}
            </Heading>
            <Text color={colors.gray[600]} size="sm">
              {timestamp}
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
