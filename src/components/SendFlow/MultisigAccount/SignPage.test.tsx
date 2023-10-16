import { Modal } from "@chakra-ui/react";
import { mockImplicitAccount, mockImplicitAddress } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { SignPageProps } from "../utils";
import SignPage from "./SignPage";
import BigNumber from "bignumber.js";
import store from "../../../utils/redux/store";
import accountsSlice from "../../../utils/redux/slices/accountsSlice";
import { TEZ } from "../../../utils/tezos";
import { FormValues } from "./FormPage";

const fixture = (props: SignPageProps<FormValues>) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SignPage {...props} />
  </Modal>
);

beforeEach(() => {
  store.dispatch(accountsSlice.actions.addAccount([mockImplicitAccount(0) as any]));
});

const props: SignPageProps<FormValues> = {
  operations: makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(0), [
    {
      type: "contract_origination",
      sender: mockImplicitAddress(0),
      code: [],
      storage: {},
    },
  ]),
  fee: new BigNumber(1234567),
  mode: "single",
  data: {
    name: "Contract name",
    sender: mockImplicitAddress(0).pkh,
    signers: [{ val: mockImplicitAddress(0).pkh }, { val: mockImplicitAddress(1).pkh }],
    threshold: 1,
  },
};

describe("<SignPage />", () => {
  it("displays the fee in tez", () => {
    render(fixture(props));
    expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`);
  });

  it("displays the threshold", () => {
    render(fixture(props));
    expect(screen.getByTestId("threshold")).toHaveTextContent(`1 out of 2`);
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
});
