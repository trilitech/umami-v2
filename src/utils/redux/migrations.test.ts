import { accountsMigrations } from "./migrations";
import { mockLedgerAccount, mockMnemonicAccount } from "../../mocks/factories";

describe("migrations", () => {
  describe("account migrations", () => {
    test("4", () => {
      const ledgerAcc = { ...mockLedgerAccount(0), derivationPathTemplate: undefined };
      const ledgerAccWithLongPath = {
        ...mockLedgerAccount(1),
        derivationPath: "44'/1729'/0'/0'/0'",
        derivationPathTemplate: undefined,
      };
      const ledgerAccWithDerivationTemplate = {
        ...mockLedgerAccount(2),
        derivationPathTemplate: "44'/1729'/0'/?'/0'",
      };
      const ledgerAccWithCustomDerivationPath = {
        ...mockLedgerAccount(3),
        derivationPath: "44'/1729'/0'/123'",
        derivationPathTemplate: undefined,
      };
      const nonLedgerAcc = mockMnemonicAccount(4);
      expect(
        accountsMigrations[4]({
          items: [
            ledgerAcc,
            ledgerAccWithLongPath,
            ledgerAccWithDerivationTemplate,
            ledgerAccWithCustomDerivationPath,
            nonLedgerAcc,
          ],
        })
      ).toEqual({
        items: [
          {
            ...ledgerAcc,
            derivationPathTemplate: "44'/1729'/?'/0'",
          },
          {
            ...ledgerAccWithLongPath,
            derivationPathTemplate: "44'/1729'/?'/0'/0'",
          },
          ledgerAccWithDerivationTemplate,
          {
            ...ledgerAccWithCustomDerivationPath,
            derivationPathTemplate: undefined, // cannot guess
          },
          nonLedgerAcc,
        ],
      });
    });
  });
});
