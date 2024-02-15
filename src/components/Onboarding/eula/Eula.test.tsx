import { Eula } from "./Eula";
import { act, render, screen, userEvent } from "../../../mocks/testUtils";

const setStepMock = jest.fn();

const fixture = () => <Eula goToStep={setStepMock} />;

describe("<Eula />", () => {
  describe("When not accepted", () => {
    test("button is disabled", () => {
      render(fixture());

      expect(screen.getByRole("checkbox")).not.toBeChecked();
      expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
    });
  });

  describe("When accepted", () => {
    test("button is enabled", async () => {
      const user = userEvent.setup();
      render(fixture());

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
      await act(() => user.click(checkbox));

      expect(checkbox).toBeChecked();

      const confirmBtn = screen.getByRole("button", { name: "Continue" });
      expect(confirmBtn).toBeEnabled();

      await act(() => user.click(confirmBtn));
      expect(setStepMock).toHaveBeenCalledTimes(1);
    });
  });
});
