import { useForm } from "react-hook-form";
import { mockContact, mockImplicitAddress } from "../../mocks/factories";
import { fireEvent, render, renderHook, screen, within } from "../../mocks/testUtils";
import { RecipientAutoCompleteDisplay } from "./RecipientAutoComplete";

type FormFields = { destination: string };

const fixture = (initialPkhValue?: string) => {
  const { result } = renderHook(() => useForm<FormFields>());
  render(
    <RecipientAutoCompleteDisplay
      contacts={[mockContact(0), mockContact(1), mockContact(2)]}
      inputName="destination"
      register={result.current.register}
      setValue={result.current.setValue}
      initialPkhValue={initialPkhValue}
    />
  );
};

describe("<RecipientAutoComplete />", () => {
  it("should set the real input when a valid pkh is entered by the user", () => {
    fixture();
    const rawInput = screen.getByLabelText("destination");
    const realInput = screen.getByTestId("real-address-input");
    fireEvent.change(rawInput, { target: { value: mockImplicitAddress(7).pkh } });
    expect(rawInput).toHaveProperty("value", mockImplicitAddress(7).pkh);
    expect(realInput).toHaveProperty("value", mockImplicitAddress(7).pkh);
  });

  it("should clear the real input when a malformed pkh or contact name is entered by the user", () => {
    fixture();
    const rawInput = screen.getByLabelText("destination");
    const realInput = screen.getByTestId("real-address-input");
    const INVALID = "not a pkh or an alias";

    fireEvent.change(rawInput, { target: { value: mockImplicitAddress(7).pkh } });
    fireEvent.change(rawInput, { target: { value: INVALID } });

    expect(rawInput).toHaveProperty("value", INVALID);
    expect(realInput).toHaveProperty("value", "");
  });

  it("hides suggestions by default", async () => {
    fixture();
    expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();
  });

  it("shows suggestions when the input is focused", async () => {
    fixture();

    const rawInput = screen.getByLabelText("destination");
    fireEvent.focus(rawInput);
    const suggestionContainer = screen.getByTestId("suggestions-list");

    const suggestions = within(suggestionContainer).queryAllByRole("listitem");
    expect(suggestions).toHaveLength(3);
  });

  it("hides suggestions if input is an exact suggestion", async () => {
    fixture();

    const rawInput = screen.getByLabelText("destination");

    fireEvent.change(rawInput, { target: { value: "Contact 1" } });

    expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();
  });

  it("displays suggestions if user input has suggestions", async () => {
    fixture();
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
    fixture();
    const rawInput = screen.getByLabelText("destination");
    const realInput = screen.getByTestId("real-address-input");

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

  it("should display initialPkhValue's contact if any, and not display any suggestions", async () => {
    fixture(mockContact(1).name);

    const rawInput = screen.getByLabelText("destination");
    const realInput = screen.getByTestId("real-address-input");

    expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();
    expect(rawInput).toHaveProperty("value", mockContact(1).name);
    expect(realInput).toHaveProperty("value", mockContact(1).pkh);
  });

  it("should display initialPkhValue if there is no existing contact", async () => {
    fixture(mockImplicitAddress(5).pkh);

    const rawInput = screen.getByLabelText("destination");
    const realInput = screen.getByTestId("real-address-input");

    expect(rawInput).toHaveProperty("value", mockImplicitAddress(5).pkh);
    expect(realInput).toHaveProperty("value", mockImplicitAddress(5).pkh);
  });

  test("Entering a pkh that belongs to a contact should display contact name in the input", () => {
    fixture();
    const rawInput = screen.getByLabelText("destination");
    const realInput = screen.getByTestId("real-address-input");
    fireEvent.change(rawInput, { target: { value: mockContact(1).pkh } });

    expect(rawInput).toHaveProperty("value", mockContact(1).name);
    expect(realInput).toHaveProperty("value", mockContact(1).pkh);
  });
});
