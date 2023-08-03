import { Flex } from "@chakra-ui/react";
import React from "react";
import { BsArrowBarRight } from "react-icons/bs";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";

export const DrawerTopButtons: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  return (
    <Flex justifyContent="flex-end" color="umami.gray.400" cursor="pointer" p={4}>
      <IconAndTextBtn onClick={onClose} label="Close" icon={BsArrowBarRight} />
    </Flex>
  );
};
