import { Modal } from "@chakra-ui/react";

import { InfoModal } from "./InfoModal";
import { mockLedgerAccount, mockMnemonicAccount } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";

describe("<InfoModal />", () => {
  describe.each([mockLedgerAccount(0), mockMnemonicAccount(1)])("for $type", account => {
    it("renders all fields", () => {
      render(
        <Modal isOpen onClose={jest.fn()}>
          <InfoModal account={account} />
        </Modal>
      );
      expect(screen.getByText("Template")).toBeVisible();
      expect(screen.getByText(account.derivationPathTemplate!)).toBeVisible();

      expect(screen.getByText("Path")).toBeVisible();
      expect(screen.getByText(account.derivationPath)).toBeVisible();

      expect(screen.getByText("Type (Curve)")).toBeVisible();
      expect(screen.getByText(account.curve)).toBeVisible();
    });

    it("skips template when it's absent", () => {
      render(
        <Modal isOpen onClose={jest.fn()}>
          <InfoModal account={{ ...account, derivationPathTemplate: undefined } as any} />
        </Modal>
      );
      expect(screen.queryByText("Template")).not.toBeInTheDocument();

      expect(screen.getByText("Path")).toBeVisible();
      expect(screen.getByText(account.derivationPath)).toBeVisible();

      expect(screen.getByText("Type (Curve)")).toBeVisible();
      expect(screen.getByText(account.curve)).toBeVisible();
    });
  });
});
