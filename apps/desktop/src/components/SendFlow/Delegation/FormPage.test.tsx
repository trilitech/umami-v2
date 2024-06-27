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
import { type FormPageProps } from "../utils";

const fixture = (props: FormPageProps<FormValues>) => (
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
    it("renders an empty form by default", () => {
      render(fixture({}));

      expect(screen.getByLabelText("From")).toHaveValue("");
      expect(screen.getByLabelText("From")).toBeEnabled();
    });

    it("renders a form with a prefilled sender", () => {
      render(fixture({ sender: mockImplicitAccount(0) }));

      expect(screen.getByTestId("address-tile")).toHaveTextContent(
        mockImplicitAccount(0).address.pkh
      );
    });

    it("renders a form with default form values", async () => {
      render(
        fixture({
          form: {
            sender: mockImplicitAccount(0).address.pkh,
            baker: mockImplicitAccount(1).address.pkh,
          },
        })
      );

      await waitFor(() => {
        expect(screen.getByTestId("real-address-input-sender")).toHaveValue(
          mockImplicitAccount(0).address.pkh
        );
      });
    });

    it("renders a form with default form values but disabled sender if it's provided", async () => {
      render(
        fixture({
          form: {
            sender: mockImplicitAccount(0).address.pkh,
            baker: mockImplicitAccount(1).address.pkh,
          },
          sender: mockImplicitAccount(0),
        })
      );

      await waitFor(() => {
        expect(screen.getByTestId("real-address-input-baker")).toHaveValue(
          mockImplicitAccount(1).address.pkh
        );
      });

      expect(screen.getByTestId("real-address-input-sender")).toHaveValue(
        mockImplicitAccount(0).address.pkh
      );
    });

    it("displays delegate for address who is not delegating", () => {
      const sender = mockImplicitAccount(0);
      render(
        fixture({
          sender,
        })
      );

      expect(screen.getByText("Delegate")).toBeInTheDocument();
    });

    it("displays change baker for address who is delegating", async () => {
      const sender = mockImplicitAccount(0);
      const baker = mockImplicitAccount(1);
      store.dispatch(
        assetsSlice.actions.updateBakers([
          { address: baker.address.pkh, name: "baker1", stakingBalance: 1 },
        ])
      );

      render(
        fixture({
          sender,
          form: {
            sender: sender.address.pkh,
            baker: baker.address.pkh,
          },
        })
      );

      await waitFor(() => {
        expect(screen.getByText("Change Baker")).toBeInTheDocument();
      });
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
      const submitButton = screen.getByText("Preview");
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });

      const estimateMock = jest.mocked(estimate);
      estimateMock.mockRejectedValue(new Error("Some error occurred"));

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
            baker: mockImplicitAccount(1).address.pkh,
          },
        })
      );
      const submitButton = screen.getByText("Preview");
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });
      const operations = {
        ...makeAccountOperations(sender, sender, [
          {
            type: "delegation",
            sender: sender.address,
            recipient: mockImplicitAccount(1).address,
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
