import { Circle, type SquareProps } from "@chakra-ui/react";
import { type PropsWithChildren } from "react";

import { useColor } from "../../styles/useColor";

export const AccountTileWrapper = ({ children, ...props }: PropsWithChildren<SquareProps>) => {
  const color = useColor();

  return (
    <Circle
      color={color("white")}
      background={color("white", "black")}
      filter="drop-shadow(0px 0px 12px rgba(45, 55, 72, 0.08))"
      size="48px"
      {...props}
    >
      {children}
    </Circle>
  );
};
