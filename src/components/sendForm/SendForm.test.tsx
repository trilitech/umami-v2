import { Modal } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { mockAccount } from "../../mocks/factories";
import { ReduxStore } from "../../providers/ReduxStore";
import { formatPkh } from "../../utils/format";
import accountsSlice from "../../utils/store/accountsSlice";
import { store } from "../../utils/store/store";
import { SendForm } from "./SendForm";

const { add } = accountsSlice.actions;
const fixture = (sender?: string) => (
  <ReduxStore>
    <Modal isOpen={true} onClose={() => {}}>
      <SendForm sender={sender} />
    </Modal>
  </ReduxStore>
);

beforeAll(() => {
  store.dispatch(add([mockAccount(1), mockAccount(2), mockAccount(3)]));
});

describe("<SendForm />", () => {
  describe("case send tez", () => {
    test("should render first step with sender blank", () => {
      render(fixture());
      expect(screen.getByTestId(/account-selector/)).toHaveTextContent(
        /select an account/i
      );
    });

    test("should render first step with sender prefiled if provided", () => {
      render(fixture(mockAccount(1).pkh));
      expect(screen.getByTestId(/account-selector/)).toHaveTextContent(
        formatPkh(mockAccount(1).pkh)
      );
    });
  });
});
