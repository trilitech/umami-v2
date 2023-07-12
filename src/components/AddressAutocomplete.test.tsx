import { FormProvider, useForm } from "react-hook-form";
import { mockContact, mockImplicitAddress } from "../mocks/factories";
import { fireEvent, render, renderHook, screen, within } from "../mocks/testUtils";
import { Contact } from "../types/Contact";
import { AddressAutocomplete } from "./AddressAutocomplete";

type FormFields = { destination: string };

const fixture = ({
  defaultDestination,
  allowUnknown = true,
  contacts = [mockContact(0), mockContact(1), mockContact(2)],
}: {
  defaultDestination?: string;
  allowUnknown?: boolean;
  contacts?: Contact[];
}) => {
  const view = renderHook(() =>
    useForm<FormFields>({ defaultValues: { destination: defaultDestination } })
  );
  render(
    <FormProvider {...view.result.current}>
      <AddressAutocomplete
        contacts={contacts}
        label=""
        inputName="destination"
        allowUnknown={allowUnknown}
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
    expect(within(suggestionContainer).getByText(mockContact(2).name)).toBeInTheDocument();
  });

  test("choosing a suggestions submits the pkh, inputs the contact name and hides suggestions", () => {
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
