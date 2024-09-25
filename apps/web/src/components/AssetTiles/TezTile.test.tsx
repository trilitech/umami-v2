import { useTezToDollar } from "@umami/state";
import { TEZ } from "@umami/tezos";
import { BigNumber } from "bignumber.js";

import { TezTile } from "./TezTile";
import { render, screen } from "../../testUtils";

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  useTezToDollar: jest.fn(),
}));

describe("<TezTile />", () => {
  beforeEach(() => {
    jest.mocked(useTezToDollar).mockReturnValue(() => BigNumber(2.5));
  });

  it("displays the Tez icon", () => {
    render(<TezTile mutezAmount="1234567" />);
    expect(screen.getByTestId("tez-icon")).toBeInTheDocument();
  });

  describe("amount display", () => {
    it("displays tez amount correctly", () => {
      render(<TezTile mutezAmount="1234567" />);
      expect(screen.getByText(`1.234567 ${TEZ}`)).toBeInTheDocument();
    });

    it("handles zero amount", () => {
      render(<TezTile mutezAmount="0" />);
      expect(screen.getByText(`0.000000 ${TEZ}`)).toBeInTheDocument();
    });
  });

  describe("dollar amount", () => {
    it("displays dollar amount", () => {
      render(<TezTile mutezAmount="1234567" />);
      expect(screen.getByText("$2.5")).toBeInTheDocument();
    });

    it("handles undefined dollar amount", () => {
      jest.mocked(useTezToDollar).mockReturnValue(() => undefined);
      render(<TezTile mutezAmount="1234567" />);
      expect(screen.queryByTestId("tez-dollar-amount")).not.toBeInTheDocument();
    });
  });

  it("renders with address prop", () => {
    const address = "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb";
    render(<TezTile address={address} />);
    expect(screen.getByText("0.00 ꜩ")).toBeInTheDocument();
  });
});
