import { Flex, Icon, Box } from "@chakra-ui/react";
import React from "react";
import { BsArrowLeft, BsArrowRight, BsArrowBarRight } from "react-icons/bs";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";

export const DrawerTopButtons: React.FC<{
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}> = ({ onPrevious, onNext, onClose }) => {
  return (
    <Flex justifyContent="space-between" color="umami.gray.400" cursor="pointer" p={4}>
      <Box>
        <Icon onClick={onPrevious} cursor="pointer" w={6} h={6} ml={2} mr={1} as={BsArrowLeft} />
        <Icon onClick={onNext} cursor="pointer" w={6} h={6} ml={1} mr={4} as={BsArrowRight} />
      </Box>
      <IconAndTextBtn onClick={onClose} label="Close" icon={BsArrowBarRight} />
    </Flex>
  );
};
