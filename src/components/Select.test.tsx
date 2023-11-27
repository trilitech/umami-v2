import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "../mocks/testUtils";
import { Select } from "./Select";

describe("<Select />", () => {
  it("renders the default value", () => {
    render(
      <Select selected={{ label: "test label", value: "test" }} options={[]} onChange={() => {}} />
    );

    expect(screen.getByTestId("select-input")).toHaveTextContent("test label");
  });

  it("hides the options by default", () => {
    render(
      <Select
        selected={{ label: "test label", value: "test" }}
        options={[{ label: "test label", value: "test" }]}
        onChange={() => {}}
      />
    );

    expect(screen.queryByTestId("select-options")).not.toBeInTheDocument();
  });

  it("shows the options on input click", async () => {
    const user = userEvent.setup();

    render(
      <Select
        selected={{ label: "test label", value: "test" }}
        options={[{ label: "test label", value: "test" }]}
        onChange={() => {}}
      />
    );

    user.click(screen.getByTestId("select-input"));

    await waitFor(() => {
      expect(screen.getByTestId("select-options")).toBeInTheDocument();
    });
  });

  it("sets the selected option on option click and calls onChange", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <Select
        selected={{ label: "test label", value: "test" }}
        options={[
          { label: "test label", value: "test" },
          { label: "test label2", value: "test2" },
        ]}
        onChange={onChange}
      />
    );

    user.click(screen.getByTestId("select-input"));

    await waitFor(() => {
      expect(screen.getByTestId("select-options")).toBeInTheDocument();
    });

    user.click(screen.getByText("test label2"));

    await waitFor(() => {
      expect(screen.getByTestId("select-input")).toHaveTextContent("test label2");
    });

    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith("test2");
  });
});
