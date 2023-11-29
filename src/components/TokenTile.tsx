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
      alignItems="center"
      justifyContent="start"
      width="400px"
      padding="15px"
      background={colors.gray[800]}
      borderRadius="4px"
      data-testid="token-tile"
      {...flexProps}
    >
      <Flex alignItems="center">
        <AspectRatio width="30px" height="30px" marginRight="12px" ratio={1}>
          <TokenIcon
            padding="6.25px"
            background={colors.gray[500]}
            borderRadius="4px"
            contract={contract}
          />
        </AspectRatio>
      </Flex>
      <PrettyNumber number={prettyAmount} />
      <Text marginLeft="4px" size="sm">
        {symbol}
      </Text>
    </Flex>
  );
};

export default TokenTile;
