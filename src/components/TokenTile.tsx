import { AspectRatio, Text, Flex, FlexProps } from "@chakra-ui/react";
import colors from "../style/colors";
import { FATokenBalance } from "./SendFlow/Token/FormPage";
import { PrettyNumber } from "./PrettyNumber";
import { tokenPrettyAmount, tokenSymbolSafe } from "../types/Token";
import TokenIcon from "../assets/icons/Token";

const TokenTile: React.FC<{ token: FATokenBalance; amount: string } & FlexProps> = ({
  token,
  amount,
  ...flexProps
}) => {
  const { contract } = token;

  const prettyAmount = tokenPrettyAmount(amount, token);
  const symbol = tokenSymbolSafe(token);
  return (
    <Flex
      data-testid="token-tile"
      alignItems="center"
      w="400px"
      p="15px"
      borderRadius="4px"
      bg={colors.gray[800]}
      justifyContent="start"
      {...flexProps}
    >
      <Flex alignItems="center">
        <AspectRatio w="30px" h="30px" ratio={1} mr="12px">
          <TokenIcon contract={contract} p="6.25px" bg={colors.gray[500]} borderRadius="4px" />
        </AspectRatio>
      </Flex>
      <PrettyNumber number={prettyAmount} />
      <Text ml="4px" size="sm">
        {symbol}
      </Text>
    </Flex>
  );
};

export default TokenTile;
