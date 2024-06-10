import { Select } from "./Select";
import { act, render, screen, userEvent } from "../mocks/testUtils";

describe("<Select />", () => {
  it("renders the default value", () => {
    render(
      <Select onChange={() => {}} options={[]} selected={{ label: "test label", value: "test" }} />
    );

    expect(screen.getByTestId("select-input")).toHaveTextContent("test label");
  });

  it("hides the options by default", () => {
    render(
      <Select
        onChange={() => {}}
        options={[{ label: "test label", value: "test" }]}
        selected={{ label: "test label", value: "test" }}
      />
    );

    expect(screen.queryByTestId("select-options")).not.toBeInTheDocument();
  });

  it("shows the options on input click", async () => {
    const user = userEvent.setup();

    render(
      <Select
        onChange={() => {}}
        options={[{ label: "test label", value: "test" }]}
        selected={{ label: "test label", value: "test" }}
      />
    );

    await act(() => user.click(screen.getByTestId("select-input")));

    expect(screen.getByTestId("select-options")).toBeInTheDocument();
  });

  it("sets the selected option on option click and calls onChange", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <Select
        onChange={onChange}
        options={[
          { label: "test label", value: "test" },
          { label: "test label2", value: "test2" },
        ]}
        selected={{ label: "test label", value: "test" }}
      />
    );

    await act(() => user.click(screen.getByTestId("select-input")));

    expect(screen.getByTestId("select-options")).toBeInTheDocument();

    await act(() => user.click(screen.getByText("test label2")));

    expect(screen.getByTestId("select-input")).toHaveTextContent("test label2");

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("test2");
  });
});
