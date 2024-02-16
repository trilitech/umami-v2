import { Box, Flex, Text } from "@chakra-ui/react";

import { OutgoingArrow } from "../../../../assets/icons";
import colors from "../../../../style/colors";
import { Operation } from "../../../../types/Operation";
import { tokenNameSafe, tokenPrettyAmount } from "../../../../types/Token";
import { prettyTezAmount } from "../../../../utils/format";
import { useGetToken } from "../../../../utils/hooks/tokensHooks";
import { AddressPill } from "../../../AddressPill/AddressPill";

export const MultisigDecodedOperation: React.FC<{
  operation: Operation;
}> = ({ operation }) => {
  switch (operation.type) {
    case "delegation":
      return (
        <Box data-testid="decoded-item-delegate" marginY={6}>
          <Text marginRight="3px" color={colors.gray[450]} fontSize="14px">
            Delegate to:
          </Text>
          <AddressPill address={operation.recipient} />
        </Box>
      );
    case "undelegation":
      return (
        <Box data-testid="decoded-item-undelegate" marginY={6}>
          <Text color={colors.gray[450]} fontSize="14px">
            End Delegation
          </Text>
        </Box>
      );
    case "tez":
    case "fa1.2":
    case "fa2":
      return (
        <Box>
          <MultisigOperationAmount operation={operation} />
          <Flex alignItems="center" marginTop="8px">
            <Text marginRight="3px" color={colors.gray[450]} fontSize="14px">
              Send to:
            </Text>
            <AddressPill address={operation.recipient} />
          </Flex>
        </Box>
      );
    case "contract_origination":
    case "contract_call":
      throw new Error(`${operation.type} is not supported yet`);
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
          <OutgoingArrow />
          <Text
            marginLeft="8px"
            color={colors.orange}
            fontSize="14px"
            fontWeight={600}
            textAlign="center"
          >
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
          <OutgoingArrow />
          <Box marginLeft="8px" color={colors.orange} textAlign="center">
            {isNFT ? (
              <>
                <Text display="inline" marginRight="3px" fontSize="14px" fontWeight={600}>
                  {operation.amount}
                </Text>
                <Text display="inline" color="white" fontSize="14px" fontWeight={600}>
                  {name}
                </Text>
              </>
            ) : (
              <Text fontSize="14px" fontWeight={600}>
                -{tokenPrettyAmount(operation.amount, asset, { showSymbol: true })}
              </Text>
            )}
          </Box>
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
