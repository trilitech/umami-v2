import {
  Box,
  Flex,
  Heading,
  Icon,
  Tag,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import colors from "../../style/colors";
import { WalletAccountPkh } from "../../utils/multisig/types";
import AccountOrContactTile from "../AccountOrContactTile";

const MultisigSigners: React.FC<{
  signers: WalletAccountPkh[];
}> = ({ signers }) => {
  const [isOpen, setIsOpen] = useState(true);
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
          onClick={() => setIsOpen((prev) => !prev)}
          data-testid="multisig-toggle-button"
        />
      </Flex>
      {isOpen && (
        <Wrap mt="3" data-testid="multisig-tag-section">
          {signers.map((pkh) => {
            return (
              <WrapItem
                key={pkh}
                borderRadius="100px"
                padding="3px 8px"
                bg={colors.gray[600]}
              >
                <Tag
                  data-testid="multisig-tag"
                  color={colors.gray[400]}
                  borderRadius="full"
                >
                  <AccountOrContactTile pkh={pkh} />
                </Tag>
              </WrapItem>
            );
          })}
        </Wrap>
      )}
    </Box>
  );
};

export default MultisigSigners;
