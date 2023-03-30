import { Flex, FlexProps, Icon, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { BsCheckCircle } from "react-icons/bs";
import { MdCopyAll } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import colors from "../style/colors";
import { formatPkh } from "../utils/format";

const TOAST_ID = "TOAST_ID";

export const CopyableAddress: React.FC<
  {
    pkh: string;
    copyable?: boolean;
  } & FlexProps
> = ({ pkh, copyable = true, ...rest }) => {
  return (
    <CopyableText
      displayText={formatPkh(pkh)}
      copyValue={copyable ? pkh : undefined}
      toastMessage="Address copied to clipboard"
    />
  );
};

const CopyableText: React.FC<
  {
    displayText: string;
    copyValue?: string;
    toastMessage?: string;
  } & FlexProps
> = ({ displayText, copyValue, toastMessage, ...rest }) => {
  const toast = useToast();
  const onClickCopyIcon = async () => {
    if (!copyValue) {
      return;
    }
    // Copy the value to clipboard.
    await navigator.clipboard.writeText(copyValue);
    // Prevent duplicate toasts.
    if (!toastMessage || toast.isActive(TOAST_ID)) {
      return;
    }
    toast({
      id: TOAST_ID,
      render: () => (
        <ToastBody
          message={toastMessage}
          onClose={() => {
            toast.close(TOAST_ID);
          }}
        />
      ),
    });
  };

  return (
    <Flex alignItems="center" {...rest}>
      <Text size="sm" color={colors.gray[400]}>
        {displayText}
      </Text>
      {copyValue && (
        <Icon
          cursor="pointer"
          onClick={() => onClickCopyIcon()}
          color={colors.gray[600]}
          _hover={{
            color: colors.gray[300],
          }}
          w={4}
          h={4}
          ml={2}
          as={MdCopyAll}
        />
      )}
    </Flex>
  );
};

const ToastBody: React.FC<{
  message: string;
  onClose: () => void;
}> = ({ message, onClose }) => {
  return (
    <Flex
      p={2}
      borderRadius="4px"
      backgroundColor="white"
      justifyContent="space-between"
      alignItems="center"
    >
      <Flex alignItems="center">
        <Icon color={colors.green} as={BsCheckCircle} m={1} />
        <Text color="black">{message}</Text>
      </Flex>

      <Icon
        color="black"
        as={RxCross1}
        cursor="pointer"
        _hover={{
          color: colors.gray[600],
        }}
        onClick={onClose}
      />
    </Flex>
  );
};

export default CopyableText;
