import { Box, Flex, Heading, Icon, Tag, useDisclosure, Wrap, WrapItem } from "@chakra-ui/react";
import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import colors from "../../style/colors";
import { ImplicitAddress } from "../../types/Address";
import AccountOrContactTile from "../AccountOrContactTile";

const MultisigApprovers: React.FC<{
  signers: ImplicitAddress[];
}> = ({ signers }) => {
  const { isOpen, getButtonProps } = useDisclosure({
    defaultIsOpen: true,
  });
  return (
    <Box w="100%" bg={colors.gray[600]} p={3} borderRadius={6} m={5}>
      <Flex justifyContent="space-between">
        <Heading size="sm">Approvers</Heading>
        <Icon
          as={isOpen ? IoIosArrowUp : IoIosArrowDown}
          cursor="pointer"
          _hover={{
            color: colors.gray[600],
          }}
          {...getButtonProps()}
          data-testid="multisig-toggle-button"
        />
      </Flex>
      {isOpen && (
        <Wrap mt="3" data-testid="multisig-tag-section">
          {signers.map(signer => {
            return (
              <WrapItem
                key={signer.pkh}
                borderRadius="100px"
                padding="3px 8px"
                bg={colors.gray[600]}
              >
                <Tag data-testid="multisig-tag" color={colors.gray[400]} borderRadius="full">
                  <AccountOrContactTile pkh={signer.pkh} />
                </Tag>
              </WrapItem>
            );
          })}
        </Wrap>
      )}
    </Box>
  );
};

export default MultisigApprovers;
