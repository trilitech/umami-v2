import { Flex, FlexProps, Icon, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { BsCheckCircle } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";

import { FileCopyIcon } from "../assets/icons";
import colors from "../style/colors";
import { formatPkh } from "../utils/format";

const TOAST_ID = "TOAST_ID";

export const CopyableAddress: React.FC<
  {
    pkh: string;
    formatAddress?: boolean;
    copyable?: boolean;
    iconColor?: string;
  } & FlexProps
> = ({ pkh, formatAddress = true, copyable = true, iconColor = colors.gray[600], ...rest }) => (
  <CopyableText
    copyValue={copyable ? pkh : undefined}
    displayText={formatAddress ? formatPkh(pkh) : pkh}
    iconColor={iconColor}
    toastMessage="Address copied to clipboard"
    {...rest}
  />
);

const CopyableText: React.FC<
  {
    displayText: string;
    copyValue?: string;
    toastMessage?: string;
    iconColor?: string;
  } & FlexProps
> = ({ displayText, copyValue, toastMessage, iconColor, ...rest }) => {
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
      <Text marginRight="6px" color={colors.gray[400]} size="sm">
        {displayText}
      </Text>
      {copyValue && (
        <FileCopyIcon
          stroke={colors.gray[450]}
          _hover={{
            stroke: colors.green,
          }}
          cursor="pointer"
          onClick={() => onClickCopyIcon()}
        />
      )}
    </Flex>
  );
};

const ToastBody: React.FC<{
  message: string;
  onClose: () => void;
}> = ({ message, onClose }) => (
  <Flex
    alignItems="center"
    justifyContent="space-between"
    padding={2}
    borderRadius="4px"
    backgroundColor="white"
  >
    <Flex alignItems="center">
      <Icon as={BsCheckCircle} margin={1} color={colors.green} />
      <Text color="black">{message}</Text>
    </Flex>

    <Icon
      as={RxCross1}
      color="black"
      _hover={{
        color: colors.gray[600],
      }}
      cursor="pointer"
      onClick={onClose}
    />
  </Flex>
);
