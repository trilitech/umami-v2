import { type UmamiStore, makeStore, networksActions } from "@umami/state";
import { DefaultNetworks } from "@umami/tezos";

import { TzktLink } from "./TzktLink";
import { render, screen } from "../../mocks/testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<TzktLink />", () => {
  describe.each(DefaultNetworks)("$name", network => {
    beforeEach(() => store.dispatch(networksActions.setCurrent(network)));

    describe("operation id props", () => {
      it("renders a link to the tzkt explorer with provided children", () => {
        render(<TzktLink transactionId={5}>Some Random Text</TzktLink>, { store });
        expect(screen.getByTestId("tzkt-link")).toHaveAttribute(
          "href",
          `${network.tzktExplorerUrl}/transactions/5`
        );

        expect(screen.getByTestId("tzkt-link")).toHaveTextContent("Some Random Text");
      });

      it("renders a link to migrations if migrationId is provided", () => {
        render(<TzktLink migrationId={1} transactionId={5} />, { store });
        expect(screen.getByTestId("tzkt-link")).toHaveAttribute(
          "href",
          `${network.tzktExplorerUrl}/migrations/1`
        );
      });

      it("renders a link to originations if originationId is provided", () => {
        render(<TzktLink originationId={1} transactionId={5} />, { store });
        expect(screen.getByTestId("tzkt-link")).toHaveAttribute(
          "href",
          `${network.tzktExplorerUrl}/originations/1`
        );
      });
    });

    describe("hash props", () => {
      it("renders the link to the operation if only hash is provided", () => {
        render(<TzktLink hash="hello-hash" />, { store });

        expect(screen.getByTestId("tzkt-link")).toHaveAttribute(
          "href",
          `${network.tzktExplorerUrl}/hello-hash`
        );
      });
    });
  });
});
