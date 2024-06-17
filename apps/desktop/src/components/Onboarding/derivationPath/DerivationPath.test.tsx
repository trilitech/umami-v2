import { DerivationPath, normalizeDerivationPath, validateDerivationPath } from "./DerivationPath";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { act, render, screen, userEvent, waitFor } from "../../../mocks/testUtils";

const goToStepMock = jest.fn();

describe("<DerivationPath />", () => {
  describe.each([
    {
      account: { type: "ledger" as const, label: "ledger account" },
      nextPage: "restoreLedger",
      derivationPathTemplate: "44'/1729'/?'/0'",
    },
    {
      account: { type: "mnemonic" as const, label: "mnemonic account", mnemonic: mnemonic1 },
      nextPage: "masterPassword",
      derivationPathTemplate: "44'/1729'/?'/0'",
    },
  ])("For $account.type", ({ account, nextPage, derivationPathTemplate }) => {
    it("uses default path pattern", async () => {
      const user = userEvent.setup();
      render(<DerivationPath account={account} goToStep={goToStepMock} />);

      const confirmBtn = screen.getByRole("button", { name: "Continue" });
      await waitFor(() => expect(confirmBtn).toBeEnabled());

      await act(() => user.click(confirmBtn));

      expect(goToStepMock).toHaveBeenCalledWith({
        type: nextPage,
        account: {
          ...account,
          derivationPath: undefined,
          derivationPathTemplate: derivationPathTemplate,
        },
      });
    });

    it("allows to select a custom path pattern", async () => {
      const user = userEvent.setup();
      const standard5PieceDerivationPath = "44'/1729'/?'/0'/0'";

      render(<DerivationPath account={account} goToStep={goToStepMock} />);

      const confirmBtn = screen.getByRole("button", { name: "Continue" });

      await act(() => user.click(screen.getByTestId("select-input")));

      expect(screen.getByTestId("select-options")).toBeInTheDocument();

      await act(() => user.click(screen.getByText(`m/${standard5PieceDerivationPath}`)));
      expect(screen.getByTestId("select-input")).toHaveTextContent(standard5PieceDerivationPath);
      expect(confirmBtn).toBeEnabled();

      await act(() => user.click(confirmBtn));

      expect(goToStepMock).toHaveBeenCalledWith({
        type: nextPage,
        account: {
          ...account,
          derivationPathTemplate: standard5PieceDerivationPath,
          derivationPath: undefined,
        },
      });
    });
  });
});

describe("normalizeDerivationPath", () => {
  it("removes leading and trailing spaces", () => {
    expect(normalizeDerivationPath(" 44'/1729'/?'/0' \t")).toBe("44'/1729'/?'/0'");
  });

  it("removes the leading m/ prefix", () => {
    expect(normalizeDerivationPath("m/44'/1729'/?'/0'")).toBe("44'/1729'/?'/0'");
    expect(normalizeDerivationPath("M/44'/1729'/?'/0'")).toBe("44'/1729'/?'/0'");
  });
});

describe("validateDerivationPath", () => {
  it("returns error message when path is empty", () => {
    expect(validateDerivationPath("")).toBe("Derivation path is required");
  });

  it("returns error message when path does not start with 44'/1729'/", () => {
    expect(validateDerivationPath("44'/1234'/0'/0'")).toBe(
      "Derivation path must start with `44'/1729'/`"
    );
  });

  it("returns error message when path is invalid", () => {
    expect(validateDerivationPath("44'/1729'/abc'/0'")).toBe("Invalid derivation path");
  });

  it("returns true when path is valid", () => {
    expect(validateDerivationPath("44'/1729'/0'/0'")).toBe(true);
  });

  it("is normalized before validation", () => {
    expect(validateDerivationPath("\t  M/44'/1729'/0'/0'   ")).toBe(true);
  });
});
