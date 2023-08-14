import { mockImplicitAccount, mockImplicitAddress } from "../../mocks/factories";
import { fireEvent, render, screen } from "../../mocks/testUtils";
import { RawPkh } from "../../types/Address";
import { formDefaultValues, FormSubmitButtons, mutezToPrettyTez } from "./utils";
import BigNumber from "bignumber.js";

describe("SendFlow utils", () => {
  describe("formDefaultValues", () => {
    type SomeForm = {
      sender: RawPkh;
      data: string;
    };

    it("returns an empty object if neither form nor sender are defined", () => {
      expect(formDefaultValues<SomeForm>({})).toEqual({});
    });

    it("returns the form if it's defined", () => {
      const form = { sender: mockImplicitAddress(0).pkh, data: "some data" };
      expect(formDefaultValues<SomeForm>({ form })).toEqual(form);
    });

    it("returns the sender if the form is not defined", () => {
      const sender = mockImplicitAccount(0);
      expect(formDefaultValues<SomeForm>({ sender })).toEqual({ sender: sender.address.pkh });
    });

    it("chooses form over sender", () => {
      const form = { sender: mockImplicitAddress(0).pkh, data: "some data" };
      const sender = mockImplicitAccount(1);
      expect(formDefaultValues<SomeForm>({ form, sender })).toEqual(form);
    });
  });

  describe("<FormSubmitButtons />", () => {
    it("renders submit single and add to batch buttons", () => {
      const mockSingle = jest.fn();
      const mockAddToBatch = jest.fn();
      render(
        <FormSubmitButtons
          isLoading={false}
          isValid={true}
          onSingleSubmit={mockSingle}
          onAddToBatch={mockAddToBatch}
        />
      );

      fireEvent.click(screen.getByText("Preview"));
      expect(mockSingle).toHaveBeenCalled();
      fireEvent.click(screen.getByText("Insert Into Batch"));
      expect(mockSingle).toHaveBeenCalled();
    });
  });

  test("mutezToPrettyTez displays 6 digits after the decimal point", () => {
    expect(mutezToPrettyTez(BigNumber(1000000))).toBe("1.000000 ꜩ");
    expect(mutezToPrettyTez(BigNumber(123))).toBe("0.000123 ꜩ");
    expect(mutezToPrettyTez(BigNumber(10000123))).toBe("10.000123 ꜩ");
  });
});
