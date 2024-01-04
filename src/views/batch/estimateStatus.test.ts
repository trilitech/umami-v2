import { getEstimateStatus, getEstimateStatusColor } from "./estimateStatus";
import colors from "../../style/colors";

describe("estimateStatus", () => {
  it("getEstimateStatus returns correct value", () => {
    expect(getEstimateStatus(1, 2)).toEqual("Estimated");
    expect(getEstimateStatus(2, 2)).toEqual("Failed");
    expect(getEstimateStatus(3, 2)).toEqual("Not Estimated");
  });

  it("getEstimateStatusColor returns correct value", () => {
    expect(getEstimateStatusColor("Estimated")).toEqual(colors.green);
    expect(getEstimateStatusColor("Failed")).toEqual(colors.orange);
    expect(getEstimateStatusColor("Not Estimated")).toEqual(colors.orangeL);
  });
});
