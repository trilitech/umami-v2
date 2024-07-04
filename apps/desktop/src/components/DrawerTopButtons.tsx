import { Flex, type FlexProps } from "@chakra-ui/react";

import { CloseDrawerButton } from "./CloseDrawerButton";

export const DrawerTopButtons = ({
  onClose,
  ...props
}: {
  onClose: () => void;
} & FlexProps) => (
  <Flex justifyContent="flex-end" paddingBottom="30px" cursor="pointer" {...props}>
    <CloseDrawerButton onClose={onClose} />
  </Flex>
);
