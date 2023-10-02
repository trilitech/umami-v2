import { PropsWithChildren, useContext } from "react";
import { OperationTileContext } from "./OperationTileContext";
import { Text } from "@chakra-ui/react";
import colors from "../../style/colors";

export const OperationType: React.FC<PropsWithChildren> = ({ children }) => {
  const { size } = useContext(OperationTileContext);

  if (size === "small") {
    return null;
  }

  return (
    <Text color={colors.gray[300]} mr="4px">
      {children}
    </Text>
  );
};
