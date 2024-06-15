import { Modal } from "@chakra-ui/react";

import { NameMultisigFormPage } from "./NameMultisigFormPage";
import { SelectApproversFormPage } from "./SelectApproversFormPage";
import { mockMnemonicAccount } from "../../../mocks/factories";
import { addAccount } from "../../../mocks/helpers";
import {
  dynamicModalContextMock,
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../mocks/testUtils";

const MULTISIG_NAME = "Test Multisig Name";

const fixture = (name?: string) => (
  <Modal isOpen={true} onClose={() => {}}>
    <NameMultisigFormPage name={name} />
  </Modal>
);

const renderMultisigForm = async (name?: string) => {
  render(fixture(name));
  if (name) {
    await waitFor(() => {
      expect(screen.getByLabelText("Account Name")).toHaveValue(name);
    });
  }
};

describe("NameMultisigFormPage", () => {
  describe.each([
    {
      testCase: "without pre-set values",
      name: undefined,
    },
    {
      testCase: "with pre-set multisig name",
      name: MULTISIG_NAME,
    },
  ])("$testCase", ({ name }) => {
    it("does not have a back button", async () => {
      await renderMultisigForm(name);

      expect(screen.queryByTestId("back-button")).not.toBeInTheDocument();
    });

    it("has a title", async () => {
      await renderMultisigForm(name);

      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Account Name");
    });

    it("has a subtitle", async () => {
      await renderMultisigForm(name);

      expect(
        screen.getByText(
          "Name your account. The account name will only appear in your local Umami app."
        )
      ).toBeInTheDocument();
    });

    it("checks that typed name is unique", async () => {
      addAccount(mockMnemonicAccount(1, "Used Name"));
      await renderMultisigForm(name);

      const input = screen.getByLabelText("Account Name");
      fireEvent.change(input, { target: { value: "Used Name" } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent(
          "Name must be unique across all accounts and contacts"
        );
      });
    });

    it("checks that typed name is unique - after trim()", async () => {
      addAccount(mockMnemonicAccount(1, "Used Name"));
      await renderMultisigForm(name);

      const input = screen.getByLabelText("Account Name");
      fireEvent.change(input, { target: { value: "\tUsed Name  " } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent(
          "Name must be unique across all accounts and contacts"
        );
      });
    });
  });

  describe.each([
    {
      testCase: "without pre-set values",
      withName: false,
      component: fixture(),
    },
    {
      testCase: "with pre-set multisig name",
      withName: true,
      component: fixture(MULTISIG_NAME),
    },
  ])("$testCase", ({ withName, component }) => {
    beforeEach(() => {
      // The user with the most TEZ will be used as a default signer for create multisig request.
      // The user is pre-selected in this step,
      // so we need to have at least one account in the store in order to submit the form.
      addAccount(mockMnemonicAccount(1));
    });

    it("opens Select Approvers form on submit", async () => {
      render(component);

      if (!withName) {
        const input = screen.getByLabelText("Account Name");
        fireEvent.change(input, { target: { value: MULTISIG_NAME } });
        fireEvent.blur(input);
      }

      const submitButton = screen.getByText("Continue");
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(
          <SelectApproversFormPage
            form={{ name: MULTISIG_NAME } as any}
            goBack={expect.any(Function)}
            sender={mockMnemonicAccount(1)}
          />
        );
      });
    });

    it("opens Select Approvers form on submit - with trimmed name", async () => {
      render(component);

      const input = screen.getByLabelText("Account Name");
      fireEvent.change(input, { target: { value: "\tUpdated Multisig Name  " } });
      fireEvent.blur(input);

      const submitButton = screen.getByText("Continue");
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(
          <SelectApproversFormPage
            form={{ name: "Updated Multisig Name" } as any}
            goBack={expect.any(Function)}
            sender={mockMnemonicAccount(1)}
          />
        );
      });
    });
  });

  describe("without pre-set values", () => {
    it("has empty name field", async () => {
      await renderMultisigForm();

      expect(screen.getByLabelText("Account Name")).toHaveValue("");
    });

    it("has required name field", async () => {
      await renderMultisigForm();

      fireEvent.blur(screen.getByLabelText("Account Name"));

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent("Name should not be empty");
      });
    });

    it("requires non-empty name field", async () => {
      await renderMultisigForm();

      const input = screen.getByLabelText("Account Name");
      fireEvent.change(input, { target: { value: "\t  " } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent("Name should not be empty");
      });
    });
  });

  describe("with pre-set multisig name", () => {
    it("has pre-set name in the name field", async () => {
      await renderMultisigForm(MULTISIG_NAME);

      expect(screen.getByLabelText("Account Name")).toHaveValue(MULTISIG_NAME);
    });

    it("checks that pre-set name is unique", async () => {
      addAccount(mockMnemonicAccount(1, MULTISIG_NAME));
      await renderMultisigForm(MULTISIG_NAME);

      fireEvent.blur(screen.getByLabelText("Account Name"));

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent(
          "Name must be unique across all accounts and contacts"
        );
      });
    });

    it("checks that pre-set name is unique - after trim()", async () => {
      addAccount(mockMnemonicAccount(1, MULTISIG_NAME));
      await renderMultisigForm(`\t${MULTISIG_NAME}  `);

      fireEvent.blur(screen.getByLabelText("Account Name"));

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent(
          "Name must be unique across all accounts and contacts"
        );
      });
    });

    it("requires non-empty pre-set name", async () => {
      await renderMultisigForm("\t  ");

      fireEvent.blur(screen.getByLabelText("Account Name"));

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent("Name should not be empty");
      });
    });
  });
});
