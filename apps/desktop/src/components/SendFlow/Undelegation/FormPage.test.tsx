import { Modal } from "@chakra-ui/react";
import {
  estimate,
  makeAccountOperations,
  mockImplicitAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
} from "@umami/core";
import { addTestAccount, assetsSlice, store } from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { mockImplicitAddress } from "@umami/tezos";

import { FormPage, type FormValues } from "./FormPage";
import { SignPage } from "./SignPage";
import {
  act,
  dynamicModalContextMock,
  render,
  screen,
  userEvent,
  waitFor,
} from "../../../mocks/testUtils";
import { mockToast } from "../../../mocks/toast";
import { type FormPagePropsWithSender } from "../utils";

const fixture = (props: FormPagePropsWithSender<FormValues>) => (
  <Modal isOpen={true} onClose={() => {}}>
    <FormPage {...props} />
  </Modal>
);

jest.mock("@umami/core", () => ({
  ...jest.requireActual("@umami/core"),
  estimate: jest.fn(),
}));

describe("<Form />", () => {
  describe("default values", () => {
    it("renders a form with a prefilled sender", () => {
      render(fixture({ sender: mockImplicitAccount(0) }));

      expect(screen.getAllByTestId("address-tile")[0]).toHaveTextContent(
        mockImplicitAccount(0).address.pkh
      );
    });

    it("shows address tile for baker", () => {
      const sender = mockImplicitAccount(0);
      const baker = mockImplicitAccount(1);
      store.dispatch(
        assetsSlice.actions.updateBakers([
          { address: baker.address.pkh, name: "baker1", stakingBalance: 1 },
        ])
      );

      render(
        fixture({
          sender: sender,
          form: {
            sender: sender.address.pkh,
            baker: baker.address.pkh,
          },
        })
      );

      expect(screen.getAllByTestId("address-tile")[1]).toHaveTextContent("baker1");
    });
  });

  describe("single transaction", () => {
    beforeEach(() => {
      addTestAccount(mockMnemonicAccount(0));
      addTestAccount(mockMultisigAccount(0));
    });

    it("shows a toast if estimation fails", async () => {
      const user = userEvent.setup();
      render(
        fixture({
          sender: mockImplicitAccount(0),
          form: {
            sender: mockImplicitAccount(0).address.pkh,
            baker: mockImplicitAccount(1).address.pkh,
          },
        })
      );

      const estimateMock = jest.mocked(estimate);
      estimateMock.mockRejectedValue(new Error("Some error occurred"));

      const submitButton = screen.getByText("Preview");
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });
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
      render(
        fixture({
          sender: sender,
          form: {
            sender: sender.address.pkh,
            baker: mockImplicitAddress(2).pkh,
          },
        })
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
