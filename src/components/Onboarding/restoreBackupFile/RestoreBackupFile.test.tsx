import { fireEvent, waitFor } from "@testing-library/react";

import { RestoreBackupFile } from "./RestoreBackupFile";
import { render, screen } from "../../../mocks/testUtils";

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
