import { Text } from "@chakra-ui/react";
import { PropsWithChildren, useContext } from "react";

import { OperationTileContext } from "./OperationTileContext";
import colors from "../../style/colors";

// It hides the operation type in the drawer to save space
export const OperationTypeWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const tileContext = useContext(OperationTileContext);

  if (tileContext.mode === "drawer") {
    return null;
  }

  return (
    <Text marginRight="4px" color={colors.gray[300]} data-testid="operation-type" size="sm">
      {children}
    </Text>
  );
};
