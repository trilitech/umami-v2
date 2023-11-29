import { Modal } from "@chakra-ui/react";

import { SignPageHeader, headerText } from "./SignPageHeader";
import { render, screen } from "../../mocks/testUtils";

const fixture = (props: Parameters<typeof SignPageHeader>[0]) => {
  return (
    <Modal isOpen={true} onClose={() => {}}>
      <SignPageHeader {...props} />
    </Modal>
  );
};
describe("<SignPageHeader />", () => {
  describe("goBack", () => {
    it("is hidden if goBack is not provided", () => {
      render(fixture({ mode: "single", operationsType: "implicit" }));
      expect(screen.queryByTestId("go-back-button")).not.toBeInTheDocument();
    });
  });
});

describe("headerText", () => {
  describe("single operation", () => {
    test("from implicit", () => {
      expect(headerText("implicit", "single")).toBe("Confirm Transaction");
    });

    test("from multisig", () => {
      expect(headerText("proposal", "single")).toBe("Propose Transaction");
    });
  });

  describe("batch operation", () => {
    test("from implicit", () => {
      expect(headerText("implicit", "batch")).toBe("Submit Batch");
    });

    test("from multisig", () => {
      expect(headerText("proposal", "batch")).toBe("Propose Batch");
    });
  });
});
