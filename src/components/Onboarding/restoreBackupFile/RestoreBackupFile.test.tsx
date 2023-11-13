import { waitFor, fireEvent } from "@testing-library/react";
import { screen, render } from "../../../mocks/testUtils";
import RestoreBackupFile from "./RestoreBackupFile";

describe("<RestoreBackupFile />", () => {
  describe("Form", () => {
    it("requires a password", async () => {
      render(<RestoreBackupFile />);

      fireEvent.blur(screen.getByLabelText("Your password"));
      await waitFor(() => {
        expect(screen.getByTestId("password")).toHaveTextContent("Password is required");
      });
    });
    it("requires a backup file", async () => {
      render(<RestoreBackupFile />);

      fireEvent.blur(screen.getByLabelText("Upload File"));
      await waitFor(() => {
        expect(screen.getByTestId("file")).toHaveTextContent("File is required");
      });
    });
  });
});
