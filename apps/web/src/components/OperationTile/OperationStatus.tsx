import { type OperationStatus as OperationStatusType } from "./useOperationStatus";
import { CheckmarkIcon, CrossedCircleIcon, HourglassIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export const OperationStatus = ({ status }: { status: OperationStatusType }) => {
  const color = useColor();

  switch (status) {
    case "applied":
      return <CheckmarkIcon color={color("green")} data-testid="checkmark" />;
    case "pending":
      return <HourglassIcon color={color("red")} data-testid="hourglass" />;
    case "failed":
      return <CrossedCircleIcon color={color("red")} data-testid="crossed-circle" />;
  }
};
