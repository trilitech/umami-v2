import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import ExitArrowIcon from "../../assets/icons/ExitArrow";

export const DrawerTopButtons: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  return (
    <Flex justifyContent="flex-end" pb="30px" cursor="pointer">
      <CloseDrawerButton onClose={onClose} />
    </Flex>
  );
};

export const CloseDrawerButton = ({ onClose }: { onClose: () => void }) => (
  <Button variant="CTAWithIcon" onClick={onClose}>
    <ExitArrowIcon stroke="currentcolor" />
    <Text ml="4px">Close</Text>
  </Button>
);
