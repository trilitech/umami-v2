import { render, screen } from "../../mocks/testUtils";
import { TezTile } from "./TezTile";
import { TEZ } from "../../utils/tezos";

const fixture = (tezAmount: string) => <TezTile tezAmount={tezAmount} />;

describe("<SignPage />", () => {
  it("displays the icon", () => {
    render(fixture("1234567"));
    expect(screen.getByTestId("tez-icon")).toBeInTheDocument();
  });

  describe("amount", () => {
    it("displays tez amount", () => {
      render(fixture("1234567"));
      expect(screen.getByText(`1`)).toBeInTheDocument();
      expect(screen.getByText(`.234567 ${TEZ}`)).toBeInTheDocument();
    });

    it("displays decimals for whole number", () => {
      render(fixture("2000000"));
      expect(screen.getByText(`2`)).toBeInTheDocument();
      expect(screen.getByText(`.000000 ${TEZ}`)).toBeInTheDocument();
    });
  });
});
