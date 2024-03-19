import { Flex, FlexProps } from "@chakra-ui/react";
import React from "react";

import { CloseDrawerButton } from "./CloseDrawerButton";

export const DrawerTopButtons: React.FC<
  {
    onClose: () => void;
  } & FlexProps
> = ({ onClose, ...props }) => (
  <Flex justifyContent="flex-end" paddingBottom="30px" cursor="pointer" {...props}>
    <CloseDrawerButton onClose={onClose} />
  </Flex>
);
