import colors from "../../style/colors";

export type EstimateStatus = "Estimated" | "Failed" | "Not Estimated";

export const getEstimateStatus = (index: number, lastEstimatedIndex: number): EstimateStatus => {
  if (index < lastEstimatedIndex) {
    return "Estimated";
  } else if (index === lastEstimatedIndex) {
    return "Failed";
  }
  return "Not Estimated";
};

export const getEstimateStatusColor = (status: EstimateStatus) => {
  switch (status) {
    case "Estimated":
      return colors.green;
    case "Failed":
      return colors.orange;
    case "Not Estimated":
      return colors.orangeL;
  }
};
