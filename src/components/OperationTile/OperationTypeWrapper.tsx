import { PropsWithChildren, useContext } from "react";
import { OperationTileContext } from "./OperationTileContext";
import { Text } from "@chakra-ui/react";
import colors from "../../style/colors";

// It hides the operation type in the drawer to save space
export const OperationTypeWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const tileContext = useContext(OperationTileContext);

  if (tileContext.mode === "drawer") {
    return null;
  }

  return (
    <Text data-testid="operation-type-wrapper" color={colors.gray[300]} size="sm" mr="4px">
      {children}
    </Text>
  );
};
