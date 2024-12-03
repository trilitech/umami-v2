import { mockImplicitAccount } from "@umami/core";
import { type RawPkh, mockImplicitAddress } from "@umami/tezos";
import { FormProvider, useForm } from "react-hook-form";

import {
  FormSubmitButton,
  formDefaultValues,
  getSmallestUnit,
  makeValidateDecimals,
} from "./utils";
import { act, render, screen, userEvent, waitFor } from "../../testUtils";

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
    const TestComponent = ({ onSubmit }: { onSubmit: () => void }) => {
      const form = useForm();

      return (
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormSubmitButton isLoading={false} />
          </form>
        </FormProvider>
      );
    };

    it("renders preview button", async () => {
      const mockSingle = jest.fn();
      const user = userEvent.setup();

      render(<TestComponent onSubmit={mockSingle} />);

      await waitFor(() => expect(screen.getByText("Preview")).toBeEnabled());

      await waitFor(async () => {
        await act(() => user.click(screen.getByText("Preview")));
      });

      expect(mockSingle).toHaveBeenCalled();
    });
  });

  describe("smallestUnit", () => {
    it("returns the correct value", () => {
      expect(getSmallestUnit(0)).toEqual("1");
      expect(getSmallestUnit(1)).toEqual("0.1");
      expect(getSmallestUnit(2)).toEqual("0.01");
    });

    it("returns 1 if decimals is negative", () => {
      jest.spyOn(console, "warn").mockImplementation();
      expect(getSmallestUnit(-1)).toEqual("1");
    });
  });

  describe("makeValidateDecimals", () => {
    it("validates value with decimals", () => {
      const validateDecimals = makeValidateDecimals(3);
      expect(validateDecimals("1")).toBe(true);
      expect(validateDecimals("0.001")).toBe(true);
      expect(validateDecimals("0.0001")).toBe("Please enter a value with up to 3 decimal places");
    });
  });
});
