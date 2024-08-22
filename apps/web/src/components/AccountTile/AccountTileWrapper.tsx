import { Circle, type SquareProps } from "@chakra-ui/react";
import { type PropsWithChildren } from "react";

import { useColor } from "../../styles/useColor";

export const AccountTileWrapper = ({
  size = "sm",
  children,
  ...props
}: PropsWithChildren<Omit<SquareProps, "size">> & {
  size?: "xs" | "sm";
}) => {
  const color = useColor();
  const sizes = {
    xs: "30px",
    sm: "48px",
  };

  return (
    <Circle
      color={color("white")}
      background={color("white", "black")}
      filter="drop-shadow(0px 0px 12px rgba(45, 55, 72, 0.08))"
      size={sizes[size]}
      {...props}
    >
      {children}
    </Circle>
  );
};
