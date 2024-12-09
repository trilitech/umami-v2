import {
  estimate,
  makeAccountOperations,
  mockImplicitAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
} from "@umami/core";
import {
  type UmamiStore,
  addTestAccounts,
  assetsActions,
  makeStore,
  mockToast,
} from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { mockImplicitAddress } from "@umami/tezos";
import { CustomError } from "@umami/utils";

import { FormPage, type FormValues } from "./FormPage";
import { SignPage } from "./SignPage";
import {
  act,
  dynamicModalContextMock,
  renderInModal,
  screen,
  userEvent,
  waitFor,
} from "../../../testUtils";
import { type FormPagePropsWithSender } from "../utils";

const fixture = (props: FormPagePropsWithSender<FormValues>) => <FormPage {...props} />;

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

jest.mock("@umami/core", () => ({
  ...jest.requireActual("@umami/core"),
  estimate: jest.fn(),
}));

describe("<Form />", () => {
  describe("default values", () => {
    it("renders a form with a prefilled sender", async () => {
      await renderInModal(fixture({ sender: mockImplicitAccount(0) }), store);

      expect(screen.getAllByTestId("address-tile")[0]).toHaveTextContent(
        mockImplicitAccount(0).address.pkh
      );
    });

    it("shows address tile for baker", async () => {
      const sender = mockImplicitAccount(0);
      const baker = mockImplicitAccount(1);
      store.dispatch(
        assetsActions.updateBakers([
          { address: baker.address.pkh, name: "baker1", stakingBalance: 1 },
        ])
      );

      await renderInModal(
        fixture({
          sender: sender,
          form: {
            sender: sender.address.pkh,
            baker: baker.address.pkh,
          },
        }),
        store
      );

      expect(screen.getAllByTestId("address-tile")[1]).toHaveTextContent("baker1");
    });
  });

  describe("single transaction", () => {
    beforeEach(() => {
      addTestAccounts(store, [mockMnemonicAccount(0), mockMultisigAccount(0)]);
    });

    it("shows a toast if estimation fails", async () => {
      const user = userEvent.setup();
      await renderInModal(
        fixture({
          sender: mockImplicitAccount(0),
          form: {
            sender: mockImplicitAccount(0).address.pkh,
            baker: mockImplicitAccount(1).address.pkh,
          },
        }),
        store
      );

      const estimateMock = jest.mocked(estimate);
      estimateMock.mockRejectedValue(new CustomError("Some error occurred"));

      const submitButton = screen.getByText("Preview");
      await waitFor(() => expect(submitButton).toBeEnabled());
      await act(() => user.click(submitButton));

      expect(estimateMock).toHaveBeenCalledTimes(1);
      expect(mockToast).toHaveBeenCalledWith({
        description: "Some error occurred",
        status: "error",
        isClosable: true,
      });
    });

    it("opens a sign page if estimation succeeds", async () => {
      const user = userEvent.setup();
      const sender = mockImplicitAccount(0);
      await renderInModal(
        fixture({
          sender: sender,
          form: {
            sender: sender.address.pkh,
            baker: mockImplicitAddress(2).pkh,
          },
        }),
        store
      );
      const submitButton = screen.getByText("Preview");
      await waitFor(() => expect(submitButton).toBeEnabled());

      const operations = {
        ...makeAccountOperations(sender, sender, [
          {
            type: "undelegation",
            sender: sender.address,
          },
        ]),
        estimates: [executeParams()],
      };

      jest.mocked(estimate).mockResolvedValueOnce(operations);

      await act(() => user.click(submitButton));

      expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(
        <SignPage
          data={undefined}
          goBack={expect.any(Function)}
          mode="single"
          operations={operations}
        />
      );
      expect(mockToast).not.toHaveBeenCalled();
    });
  });
});
