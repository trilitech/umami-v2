import { OperationTileContext } from "./OperationTileContext";
import { OperationTypeWrapper } from "./OperationTypeWrapper";
import { render, screen } from "../../mocks/testUtils";

describe("<OperationTypeWrapper />", () => {
  it("renders the children", () => {
    render(<OperationTypeWrapper>Test text</OperationTypeWrapper>);
    expect(screen.getByTestId("operation-type")).toHaveTextContent("Test text");
  });

  it("doesn't render in drawer mode", () => {
    render(
      <OperationTileContext.Provider value={{ mode: "drawer" } as any}>
        <OperationTypeWrapper>Test text</OperationTypeWrapper>
      </OperationTileContext.Provider>
    );
    expect(screen.queryByTestId("operation-type")).not.toBeInTheDocument();
  });
});
