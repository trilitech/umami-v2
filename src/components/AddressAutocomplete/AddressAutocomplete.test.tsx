import { FormProvider, useForm } from "react-hook-form";
import { mockContact, mockImplicitAddress } from "../../mocks/factories";
import { fireEvent, render, renderHook, screen, within } from "../../mocks/testUtils";
import { Contact } from "../../types/Contact";
import { AddressAutocomplete, getSuggestions } from "./AddressAutocomplete";
import store from "../../utils/redux/store";
import { contactsActions } from "../../utils/redux/slices/contactsSlice";

type FormFields = { destination: string };

const fixture = ({
  defaultDestination = "",
  allowUnknown = true,
  contacts = [mockContact(0), mockContact(1), mockContact(2)],
  label = "",
  keepValid,
}: {
  defaultDestination?: string;
  contacts?: Contact[];
  allowUnknown?: boolean;
  label?: string;
  keepValid?: boolean;
}) => {
  const view = renderHook(() =>
    useForm<FormFields>({ defaultValues: { destination: defaultDestination } })
  );
  render(
    <FormProvider {...view.result.current}>
      <AddressAutocomplete
        contacts={contacts}
        label={label}
        inputName="destination"
        allowUnknown={allowUnknown}
        keepValid={keepValid}
      />
    </FormProvider>
  );
};

describe("<AddressAutocomplete />", () => {
  it("should set the real input when a valid pkh is entered by the user", () => {
    fixture({});
    const rawInput = screen.getByLabelText("destination");
    const realInput = screen.getByTestId("real-address-input-destination");
    fireEvent.change(rawInput, { target: { value: mockImplicitAddress(7).pkh } });
    expect(rawInput).toHaveProperty("value", mockImplicitAddress(7).pkh);
    expect(realInput).toHaveProperty("value", mockImplicitAddress(7).pkh);
  });

  it("should clear the real input when a malformed pkh or contact name is entered by the user", () => {
    fixture({});
    const rawInput = screen.getByLabelText("destination");
    const realInput = screen.getByTestId("real-address-input-destination");
    const INVALID = "not a pkh or an alias";

    fireEvent.change(rawInput, { target: { value: mockImplicitAddress(7).pkh } });
    fireEvent.change(rawInput, { target: { value: INVALID } });

    expect(rawInput).toHaveProperty("value", INVALID);
    expect(realInput).toHaveProperty("value", "");
  });

  it("should keep the valid value if user enters invalid data, but keepValid is true", () => {
    fixture({ defaultDestination: mockContact(0).pkh, keepValid: true });
    const rawInput = screen.getByLabelText("destination");
    const realInput = screen.getByTestId("real-address-input-destination");
    fireEvent.change(rawInput, { target: { value: "invalid" } });

    expect(rawInput).toHaveProperty("value", "invalid");
    expect(realInput).toHaveProperty("value", mockContact(0).pkh);
  });

  it("hides suggestions by default", async () => {
    fixture({});
    expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();
  });

  it("shows suggestions when the input is focused", async () => {
    fixture({});

    const rawInput = screen.getByLabelText("destination");
    fireEvent.focus(rawInput);
    const suggestionContainer = screen.getByTestId("suggestions-list");

    const suggestions = within(suggestionContainer).queryAllByRole("listitem");
    expect(suggestions).toHaveLength(3);
  });

  it("hides suggestions if input is an exact suggestion", async () => {
    fixture({});

    const rawInput = screen.getByLabelText("destination");

    fireEvent.change(rawInput, { target: { value: "Contact 1" } });

    expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();
  });

  it("displays suggestions if user input has suggestions", async () => {
    store.dispatch(contactsActions.upsert(mockContact(0)));
    store.dispatch(contactsActions.upsert(mockContact(1)));
    fixture({});
    const rawInput = screen.getByLabelText("destination");

    expect(rawInput).toBeEnabled();

    fireEvent.focus(rawInput);
    fireEvent.change(rawInput, { target: { value: "tact" } });

    const suggestionContainer = screen.getByTestId("suggestions-list");
    const suggestions = within(suggestionContainer).getAllByRole("listitem");
    expect(suggestions).toHaveLength(3);
    expect(within(suggestionContainer).getByText(mockContact(0).name)).toBeInTheDocument();
    expect(within(suggestionContainer).getByText(mockContact(1).name)).toBeInTheDocument();
    // this one is unknown and its full address will be shows
    expect(within(suggestionContainer).getByText(mockContact(2).pkh)).toBeInTheDocument();
  });

  test("choosing a suggestions submits the pkh, inputs the contact name and hides suggestions", () => {
    store.dispatch(contactsActions.upsert(mockContact(1)));
    fixture({});
    const rawInput = screen.getByLabelText("destination");
    const realInput = screen.getByTestId("real-address-input-destination");

    expect(rawInput).toBeEnabled();

    fireEvent.focus(rawInput);
    fireEvent.change(rawInput, { target: { value: "Contact" } });

    const suggestionContainer = screen.getByTestId("suggestions-list");

    const sug = within(suggestionContainer).getByText(mockContact(1).name);

    fireEvent.mouseDown(sug);
    expect(rawInput).toHaveProperty("value", mockContact(1).name);

    expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();
    expect(realInput).toHaveProperty("value", mockContact(1).pkh);
  });

  it("should display default address's contact if any, and not display any suggestions", async () => {
    fixture({ defaultDestination: mockContact(1).pkh });

    const rawInput = screen.getByLabelText("destination");
    const realInput = screen.getByTestId("real-address-input-destination");

    expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();
    expect(rawInput).toHaveProperty("value", mockContact(1).name);
    expect(realInput).toHaveProperty("value", mockContact(1).pkh);
  });

  it("should display default address if there is no existing contact", async () => {
    fixture({ defaultDestination: mockImplicitAddress(5).pkh });

    const rawInput = screen.getByLabelText("destination");
    const realInput = screen.getByTestId("real-address-input-destination");

    expect(rawInput).toHaveProperty("value", mockImplicitAddress(5).pkh);
    expect(realInput).toHaveProperty("value", mockImplicitAddress(5).pkh);
  });

  test("Entering a pkh that belongs to a contact should display contact name in the input", () => {
    fixture({});
    const rawInput = screen.getByLabelText("destination");
    const realInput = screen.getByTestId("real-address-input-destination");
    fireEvent.change(rawInput, { target: { value: mockContact(1).pkh } });

    expect(rawInput).toHaveProperty("value", mockContact(1).name);
    expect(realInput).toHaveProperty("value", mockContact(1).pkh);
  });

  test("when allowUnknown is false it doesn't set the value to an unknown address even if it's valid", () => {
    fixture({ allowUnknown: false, contacts: [mockContact(1)] });
    const rawInput = screen.getByLabelText("destination");
    const realInput = screen.getByTestId("real-address-input-destination");
    fireEvent.change(rawInput, { target: { value: mockContact(2).pkh } });

    expect(rawInput).toHaveProperty("value", mockContact(2).pkh);
    expect(realInput).toHaveProperty("value", "");
  });
});

describe("getSuggestions", () => {
  it("returns all contacts if input is empty", () => {
    expect(getSuggestions("", [mockContact(0), mockContact(1)])).toEqual([
      mockContact(0),
      mockContact(1),
    ]);
  });

  it("returns all contacts if input is a substring of a contact's name", () => {
    expect(
      getSuggestions("cd", [
        { ...mockContact(0), name: "abcd" },
        { ...mockContact(1), name: "efgh" },
      ])
    ).toEqual([{ ...mockContact(0), name: "abcd" }]);
  });

  it("returns an empty result if nothing matches the input", () => {
    expect(
      getSuggestions("de", [
        { ...mockContact(0), name: "abcd" },
        { ...mockContact(1), name: "efgh" },
      ])
    ).toEqual([]);
  });

  describe("right icon", () => {
    it("shows a chevron when the input is empty", () => {
      fixture({});
      expect(screen.getByTestId("chevron-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("clear-input-button")).not.toBeInTheDocument();
    });

    it("shows a clear button when the input is not empty", () => {
      fixture({});
      const input = screen.getByLabelText("destination");
      fireEvent.change(input, { target: { value: "123" } });
      expect(screen.queryByTestId("chevron-icon")).not.toBeInTheDocument();
      expect(screen.getByTestId("clear-input-button")).toBeInTheDocument();
    });

    it("clears input and shows suggestions when clear input button is clicked", () => {
      fixture({});
      const input = screen.getByLabelText("destination");
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: "Contact" } });
      expect(input).toHaveProperty("value", "Contact");

      expect(
        within(screen.getByTestId("suggestions-list")).queryAllByRole("listitem")
      ).toHaveLength(3);

      fireEvent.click(screen.getByTestId("clear-input-button"));

      expect(input).toHaveProperty("value", "");
      expect(screen.queryByTestId("clear-input-button")).not.toBeInTheDocument();
      expect(screen.getByTestId("chevron-icon")).toBeInTheDocument();
      expect(
        within(screen.getByTestId("suggestions-list")).queryAllByRole("listitem")
      ).toHaveLength(3);
    });
  });
});
