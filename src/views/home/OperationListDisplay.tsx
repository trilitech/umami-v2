import React from "react";
import { NoOperations } from "../../components/NoItems";
import { OperationTile } from "../../components/OperationTile";
import { TzktCombinedOperation } from "../../utils/tezos";
import { Box, Center, Divider, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import RefreshClockIcon from "../../assets/icons/RefreshClock";
import colors from "../../style/colors";

export const OperationListDisplay: React.FC<{ operations: TzktCombinedOperation[] }> = ({
  operations,
}) => {
  if (operations.length === 0) {
    return <NoOperations small />;
  }

  const chunk = operations.slice(0, 20);

  return (
    <>
      {chunk.map((operation, i) => (
        <Box key={operation.id} height="90px">
          <OperationTile operation={operation} />
          {i < chunk.length - 1 && <Divider marginY="20px" />}
        </Box>
      ))}
      <Center>
        <Link to="/operations">
          <RefreshClockIcon display="inline" />{" "}
          <Text display="inline" color={colors.gray[300]} size="sm">
            View All
          </Text>
        </Link>
      </Center>
    </>
  );
};
