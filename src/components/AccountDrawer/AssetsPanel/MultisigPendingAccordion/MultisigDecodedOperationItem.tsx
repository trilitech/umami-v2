import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { FiArrowUpRight } from "react-icons/fi";
import { Operation } from "../../../../types/Operation";
import colors from "../../../../style/colors";
import { tokenNameSafe, tokenPrettyAmount } from "../../../../types/Token";
import { prettyTezAmount } from "../../../../utils/format";
import { useGetToken } from "../../../../utils/hooks/tokensHooks";
import AddressPill from "../../../AddressPill/AddressPill";

const MultisigDecodedOperationItem: React.FC<{
  operation: Operation;
}> = ({ operation }) => {
  switch (operation.type) {
    case "delegation":
      return (
        <Box margin={1} paddingLeft={5} data-testid="decoded-item-delegate" marginY={6}>
          Delegate to <AddressPill address={operation.recipient} />
        </Box>
      );
    case "undelegation":
      return (
        <Box margin={1} paddingLeft={5} data-testid="decoded-item-undelegate" marginY={6}>
          End Delegation
        </Box>
      );
    case "tez":
    case "fa1.2":
    case "fa2":
      return (
        <Box marginY={6}>
          <MultisigOperationAmount operation={operation} />
          <Flex alignItems="center" margin={1} paddingLeft={5}>
            <Heading marginRight={2} color={colors.gray[400]} size="sm">
              Send to :
            </Heading>
            <AddressPill address={operation.recipient} />
          </Flex>
        </Box>
      );
    case "contract_origination":
    case "contract_call":
      throw new Error(`${operation.type} is not suported yet`);
  }
};

const MultisigOperationAmount: React.FC<{
  operation: Operation;
}> = ({ operation }) => {
  const getToken = useGetToken();

  switch (operation.type) {
    case "tez":
      return (
        <Flex alignItems="center" data-testid="decoded-tez-amount">
          <Icon as={FiArrowUpRight} width={5} height={5} color={colors.gray[400]}></Icon>
          <Text marginLeft={1} textAlign="center">
            -{prettyTezAmount(operation.amount)}
          </Text>
        </Flex>
      );

    case "fa1.2":
    case "fa2": {
      const asset = getToken(operation.contract.pkh, operation.tokenId);

      if (!asset) {
        return null;
      }
      const name = tokenNameSafe(asset);
      const isNFT = asset.type === "nft";

      return (
        <Flex alignItems="center" data-testid="decoded-fa-amount">
          <Icon as={FiArrowUpRight} width={5} height={5} color={colors.gray[400]}></Icon>
          {isNFT ? (
            <Text marginLeft={1} textAlign="center">
              {operation.amount} {name}
            </Text>
          ) : (
            <Text marginLeft={1} textAlign="center">
              -{tokenPrettyAmount(operation.amount, asset, { showSymbol: true })}
            </Text>
          )}
        </Flex>
      );
    }
    case "delegation":
    case "undelegation":
    case "contract_origination":
    case "contract_call":
      return null;
  }
};

export default MultisigDecodedOperationItem;
