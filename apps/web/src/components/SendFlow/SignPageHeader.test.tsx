import {
  mockLedgerAccount,
  mockMnemonicAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "@umami/core";

import { SignPageHeader, subTitle } from "./SignPageHeader";
import { render, screen } from "../../testUtils";

describe("<SignPageHeader />", () => {
  describe("goBack", () => {
    it("is hidden if goBack is not provided", () => {
      render(<SignPageHeader />);
      expect(screen.queryByTestId("go-back-button")).not.toBeInTheDocument();
    });
  });
});

test.each([
  { account: mockLedgerAccount(0), result: undefined },
  { account: mockSocialAccount(0), result: undefined },
  { account: mockMnemonicAccount(0), result: "Enter your password to confirm this transaction." },
  { account: mockSecretKeyAccount(0), result: "Enter your password to confirm this transaction." },
])("subTitle for $account.type", ({ account, result }) => {
  expect(subTitle(account)).toEqual(result);
});
