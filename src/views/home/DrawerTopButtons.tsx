import { Button, Flex, FlexProps, Text } from "@chakra-ui/react";
import React from "react";

import { ExitArrowIcon } from "../../assets/icons";

export const DrawerTopButtons: React.FC<
  {
    onClose: () => void;
  } & FlexProps
> = ({ onClose, ...props }) => (
  <Flex justifyContent="flex-end" paddingBottom="30px" cursor="pointer" {...props}>
    <CloseDrawerButton onClose={onClose} />
  </Flex>
);

export const CloseDrawerButton = ({ onClose }: { onClose: () => void }) => (
  <Button onClick={onClose} variant="CTAWithIcon">
    <ExitArrowIcon stroke="currentcolor" />
    <Text marginLeft="4px">Close</Text>
  </Button>
);
