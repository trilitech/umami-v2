import { Flex, FlexProps, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { MdCopyAll } from "react-icons/md";
import colors from "../style/colors";
import { formatPkh } from "../utils/format";

export const CopyableAddress: React.FC<
  {
    pkh: string;
    copyable: boolean;
  } & FlexProps
> = ({ pkh, copyable, ...rest }) => {
  const copyToClipboard = (val: string) => {
    navigator.clipboard.writeText(val);
  };

  return (
    <Flex alignItems="center" {...rest}>
      <Text size="sm" color={"text.dark"}>
        {formatPkh(pkh)}
      </Text>
      {copyable && (
        <Icon
          cursor="pointer"
          onClick={(_) => copyToClipboard(pkh)}
          color={colors.gray[600]}
          _hover={{
            color: colors.gray[300],
          }}
          w={4}
          h={4}
          ml={2}
          mr={4}
          as={MdCopyAll}
        />
      )}
    </Flex>
  );
};
