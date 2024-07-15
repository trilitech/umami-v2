import { type OperationDestination } from "@umami/core";

import colors from "../../style/colors";

export const operationColor = (destination: OperationDestination) => {
  switch (destination) {
    case "incoming":
      return colors.green;
    case "outgoing":
      return colors.orange;
    case "unrelated":
      return "white";
  }
};
