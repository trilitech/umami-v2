import { Modal } from "@chakra-ui/react";
import {
  makeAccountOperations,
  mockContractOrigination,
  mockImplicitAccount,
  mockMnemonicAccount,
} from "@umami/core";
import { addTestAccount } from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { TEZ, mockImplicitAddress } from "@umami/tezos";

import { type FormValues } from "./FormValues";
import { SignTransactionFormPage } from "./SignTransactionFormPage";
import { render, screen, waitFor } from "../../../mocks/testUtils";
import { type SignPageProps } from "../utils";

const fixture = (props: SignPageProps<FormValues>) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SignTransactionFormPage {...props} />
  </Modal>
);

beforeEach(() => addTestAccount(mockMnemonicAccount(0)));

const props: SignPageProps<FormValues> = {
  operations: {
    ...makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(0), [
      mockContractOrigination(0),
    ]),
    estimates: [executeParams({ fee: 1234567 })],
  },
  mode: "single",
  data: {
    name: "Contract name",
    sender: mockImplicitAddress(0).pkh,
    signers: [{ val: mockImplicitAddress(0).pkh }, { val: mockImplicitAddress(1).pkh }],
    threshold: 1,
  },
};

describe("<SignPage />", () => {
  it("has a title", async () => {
    render(fixture(props));

    await waitFor(() =>
      expect(screen.getByTestId("sign-page-header")).toHaveTextContent("Review & Submit")
    );
  });

  it("has a subtitle", async () => {
    render(fixture(props));

    await screen.findByText("Please review the details and then continue to submit contract.");
  });

  it("displays the contract name", async () => {
    render(fixture(props));

    await waitFor(() =>
      expect(screen.getByTestId("contract-name")).toHaveTextContent("Contract name")
    );
  });

  it("displays the approvers", async () => {
    render(fixture(props));

    await waitFor(() => {
      props.data.signers.forEach(signer => {
        expect(screen.getByTestId(`approver-${signer.val}`)).toBeInTheDocument();
      });
    });
  });

  it("displays the threshold", async () => {
    render(fixture(props));

    await waitFor(() => {
      expect(screen.getByTestId("threshold")).toHaveTextContent("No. of approvals:");
    });

    expect(screen.getByTestId("threshold")).toHaveTextContent("1 out of 2");
  });

  it("displays the fee in tez", async () => {
    render(fixture(props));

    await waitFor(() => expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`));
  });

  // TODO: test creating multisig on sign

  // TODO: test updating Creation Fee Payer
});
