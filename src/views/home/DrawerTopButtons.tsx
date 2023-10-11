import { Flex } from "@chakra-ui/react";
import React from "react";
import { BsArrowBarRight } from "react-icons/bs";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import colors from "../../style/colors";

export const DrawerTopButtons: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  return (
    <Flex justifyContent="flex-end" color={colors.gray[400]} pb="30px" cursor="pointer">
      <IconAndTextBtn onClick={onClose} label="Close" icon={BsArrowBarRight} />
    </Flex>
  );
};
