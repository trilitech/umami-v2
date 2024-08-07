import { type OperationDestination } from "@umami/core";

import { useColor } from "../../styles/useColor";

export const useOperationColor = (destination: OperationDestination) => {
  const color = useColor();

  switch (destination) {
    case "incoming":
      return color("green");
    case "outgoing":
      return color("red");
    case "unrelated":
      return color("900");
  }
};
