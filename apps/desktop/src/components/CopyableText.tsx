import { Flex, type FlexProps, Text, useToast } from "@chakra-ui/react";
import { formatPkh } from "@umami/tezos";

import { FileCopyIcon } from "../assets/icons";
import colors from "../style/colors";

const TOAST_ID = "TOAST_ID";

export const CopyableAddress = ({
  pkh,
  formatAddress = true,
  copyable = true,
  ...rest
}: {
  pkh: string;
  formatAddress?: boolean;
  copyable?: boolean;
  iconColor?: string;
} & FlexProps) => (
  <CopyableText
    copyValue={copyable ? pkh : undefined}
    displayText={formatAddress ? formatPkh(pkh) : pkh}
    toastMessage="Address copied to clipboard"
    {...rest}
  />
);

const CopyableText = ({
  displayText,
  copyValue,
  toastMessage,
  ...rest
}: {
  displayText: string;
  copyValue?: string;
  toastMessage?: string;
} & FlexProps) => {
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
      status: "success",
      description: toastMessage,
      id: TOAST_ID,
      isClosable: true,
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
