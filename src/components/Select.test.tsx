import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "../mocks/testUtils";
import { Select } from "./Select";

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
        onChange={onChange}
        options={[
          { label: "test label", value: "test" },
          { label: "test label2", value: "test2" },
        ]}
        selected={{ label: "test label", value: "test" }}
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
