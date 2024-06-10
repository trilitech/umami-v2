import { Modal } from "@chakra-ui/react";

import { FormValues } from "./FormValues";
import { SignTransactionFormPage } from "./SignTransactionFormPage";
import { executeParams } from "../../../mocks/executeParams";
import {
  mockContractOrigination,
  mockImplicitAccount,
  mockImplicitAddress,
  mockMnemonicAccount,
} from "../../../mocks/factories";
import { addAccount } from "../../../mocks/helpers";
import { render, screen } from "../../../mocks/testUtils";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { TEZ } from "../../../utils/tezos";
import { SignPageProps } from "../utils";

const fixture = (props: SignPageProps<FormValues>) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SignTransactionFormPage {...props} />
  </Modal>
);

beforeEach(() => addAccount(mockMnemonicAccount(0)));

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
  it("has a title", () => {
    render(fixture(props));

    expect(screen.getByTestId("sign-page-header")).toHaveTextContent("Review & Submit");
  });

  it("has a subtitle", () => {
    render(fixture(props));

    expect(
      screen.getByText("Please review the details and then continue to submit contract.")
    ).toBeInTheDocument();
  });

  it("displays the contract name", () => {
    render(fixture(props));

    expect(screen.getByTestId("contract-name")).toHaveTextContent("Contract name");
  });

  it("displays the approvers", () => {
    render(fixture(props));

    props.data.signers.forEach(signer => {
      expect(screen.getByTestId(`approver-${signer.val}`)).toBeInTheDocument();
    });
  });

  it("displays the threshold", () => {
    render(fixture(props));

    expect(screen.getByTestId("threshold")).toHaveTextContent("No. of approvals:");
    expect(screen.getByTestId("threshold")).toHaveTextContent("1 out of 2");
  });

  it("displays the fee in tez", () => {
    render(fixture(props));

    expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`);
  });

  // TODO: test creating multisig on sign

  // TODO: test updating Creation Fee Payer
});
