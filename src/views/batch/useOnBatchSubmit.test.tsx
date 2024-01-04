import { addOrdinal, getEstimateStatusColor } from "./useOnBatchSubmit";
import colors from "../../style/colors";
describe("useOnBatchSubmit", () => {
  describe("addOrdinal", () => {
    it("returns correct value", () => {
      expect(addOrdinal(1)).toEqual("1st");
      expect(addOrdinal(2)).toEqual("2nd");
      expect(addOrdinal(3)).toEqual("3rd");
      expect(addOrdinal(4)).toEqual("4th");
      expect(addOrdinal(11)).toEqual("11th");
      expect(addOrdinal(21)).toEqual("21st");
      expect(addOrdinal(12)).toEqual("12th");
      expect(addOrdinal(22)).toEqual("22nd");
      expect(addOrdinal(13)).toEqual("13th");
      expect(addOrdinal(23)).toEqual("23rd");
    });
  });

  describe("estimateStatusColor", () => {
    it("returns correct value", () => {
      expect(getEstimateStatusColor("Estimated")).toEqual(colors.green);
      expect(getEstimateStatusColor("Failed")).toEqual(colors.orange);
      expect(getEstimateStatusColor("Not Estimated")).toEqual(colors.orangeL);
    });
  });
});
