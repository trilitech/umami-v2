import { estimate, makeAccountOperations, mockImplicitAccount } from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  assetsActions,
  makeStore,
  mockToast,
} from "@umami/state";
import { executeParams } from "@umami/test-utils";
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
import { type FormPageProps } from "../utils";

const fixture = (props: FormPageProps<FormValues>) => <FormPage {...props} />;

jest.mock("@umami/core", () => ({
  ...jest.requireActual("@umami/core"),
  estimate: jest.fn(),
}));

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, mockImplicitAccount(0));
  store.dispatch(accountsActions.setCurrent(mockImplicitAccount(0).address.pkh));
});

describe("<Form />", () => {
  describe("default values", () => {
    it("renders a form with default form values", async () => {
      await renderInModal(
        fixture({
          form: {
            sender: mockImplicitAccount(0).address.pkh,
            baker: mockImplicitAccount(1).address.pkh,
          },
        }),
        store
      );

      await waitFor(() => {
        expect(screen.getByTestId("real-address-input-sender")).toHaveValue(
          mockImplicitAccount(0).address.pkh
        );
      });
    });

    it("displays delegate for address who is not delegating", async () => {
      const sender = mockImplicitAccount(0);
      await renderInModal(
        fixture({
          sender,
        }),
        store
      );

      expect(screen.getByText("Delegate")).toBeInTheDocument();
    });

    it("displays change baker for address who is delegating", async () => {
      const sender = mockImplicitAccount(0);
      const baker = mockImplicitAccount(1);
      store.dispatch(
        assetsActions.updateBakers([
          { address: baker.address.pkh, name: "baker1", stakingBalance: 1 },
        ])
      );

      await renderInModal(
        fixture({
          sender,
          form: {
            sender: sender.address.pkh,
            baker: baker.address.pkh,
          },
        }),
        store
      );

      await waitFor(() => {
        expect(screen.getByText("Change Baker")).toBeInTheDocument();
      });
    });
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
    const submitButton = screen.getByText("Preview");
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    const estimateMock = jest.mocked(estimate);
    estimateMock.mockRejectedValue(new CustomError("Some error occurred"));

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
          baker: mockImplicitAccount(1).address.pkh,
        },
      }),
      store
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
