import { Modal } from "@chakra-ui/react";
import { publicKeys1 } from "../../mocks/publicKeys";
import { seedPhrase } from "../../mocks/seedPhrase";
import { fireEvent, render, screen, waitFor } from "../../mocks/testUtils";
import { AccountType } from "../../types/Account";
import { generate24WordMnemonic } from "../../utils/mnemonic";
import { store } from "../../utils/store/store";
import CreateOrImportSecret from "./CreateOrImportSecret";
import { addressExists, getFingerPrint } from "../../utils/tezos/helpers";

jest.mock("../../utils/tezos");
jest.mock("../../utils/mnemonic");

const getFingerPrintMock = getFingerPrint as jest.Mock;
const addressExistsMock = addressExists as jest.Mock;
const generate24WordMnemonicMock = generate24WordMnemonic as jest.Mock;

const MOCK_FINGERPRINT = "mockFingerPrint1";
beforeEach(() => {
  getFingerPrintMock.mockResolvedValue(MOCK_FINGERPRINT);
  addressExistsMock.mockResolvedValue(false);
  generate24WordMnemonicMock.mockReturnValue(seedPhrase);
});

const fixture = () => {
  return (
    <Modal isOpen={true} onClose={() => {}}>
      <CreateOrImportSecret onClose={() => {}} />
    </Modal>
  );
};

describe("<CreateOrImportSecret />", () => {
  it("should display available options", () => {
    render(fixture());
    expect(
      screen.getByRole("button", { name: /create new secret/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Import secret/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /connect with google/i,
      })
    ).toBeInTheDocument();
  });

  describe("seedphrase creation scenario", () => {
    const clickOnNewSecret = () => {
      fireEvent.click(
        screen.getByRole("button", { name: /create new secret/i })
      );
    };

    const clickNext = () => {
      fireEvent.click(screen.getByRole("button", { name: /next/i }));
    };

    const ACCOUNT_NAME = "my super account";
    const MOCK_PASSWORD = "mockPass2";
    const fillAccountForm = async () => {
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: ACCOUNT_NAME } });
      const submitBtn = screen.getByRole("button", { name: /submit/i });

      await waitFor(() => {
        expect(submitBtn).not.toBeDisabled();
      });
      fireEvent.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Enter and confirm Password/i)
        ).toBeInTheDocument();
      });
    };

    const fillPasswordForm = async () => {
      const password = screen.getByLabelText("Password");
      const confirm = screen.getByLabelText("Confirm password");
      fireEvent.change(password, { target: { value: MOCK_PASSWORD } });
      fireEvent.change(confirm, { target: { value: MOCK_PASSWORD } });
      const submit = screen.getByRole("button", {
        name: /submit/i,
      });
      await waitFor(() => {
        expect(submit).not.toBeDisabled();
      });
      fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    };

    test("User clicks on create secret and it displays generated mnemonic", () => {
      render(fixture());
      clickOnNewSecret();
      expect(screen.getByText(seedPhrase)).toBeInTheDocument();
    });

    test("User clicks on next and it promps him for account name", () => {
      render(fixture());
      clickOnNewSecret();
      clickNext();

      expect(screen.getByText(/enter account name/i)).toBeInTheDocument();
    });

    test("User enters account name and clicks next and is prompted for new password if no account exists", async () => {
      render(fixture());
      clickOnNewSecret();
      clickNext();
      await fillAccountForm();
    });

    test("User submits 2 identical password and it creates account", async () => {
      render(fixture());
      clickOnNewSecret();
      clickNext();
      await fillAccountForm();
      await fillPasswordForm();

      await waitFor(() => {
        const { seedPhrases } = store.getState().accounts;
        expect(seedPhrases[MOCK_FINGERPRINT]).toHaveProperty("data");
      });

      const { items } = store.getState().accounts;
      expect(items).toHaveLength(1);
      expect(items[0]).toEqual(
        expect.objectContaining({
          label: ACCOUNT_NAME,
          pkh: publicKeys1.pkh,
          pk: publicKeys1.pk,
          type: AccountType.MNEMONIC,
        })
      );
    });
  });
});
