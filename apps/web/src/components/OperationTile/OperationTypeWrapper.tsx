import { Text } from "@chakra-ui/react";
import { type PropsWithChildren, useContext } from "react";

import { OperationTileContext } from "./OperationTileContext";
import { useColor } from "../../styles/useColor";

// It hides the operation type in the drawer to save space
export const OperationTypeWrapper = ({ children }: PropsWithChildren) => {
  const color = useColor();
  const tileContext = useContext(OperationTileContext);

  if (tileContext.mode === "drawer") {
    return null;
  }

  return (
    <Text color={color("600")} data-testid="operation-type" size="sm">
      {children}
    </Text>
  );
};
