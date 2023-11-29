import { render, screen } from "../../mocks/testUtils";
import { DefaultNetworks } from "../../types/Network";
import { networksActions } from "../../utils/redux/slices/networks";
import { store } from "../../utils/redux/store";
import { TzktLink } from "./TzktLink";

describe("<TzktLink />", () => {
  describe.each(DefaultNetworks)("$name", network => {
    beforeEach(() => {
      store.dispatch(networksActions.setCurrent(network));
    });

    describe("operation id props", () => {
      it("renders a link to the tzkt explorer with provided children", () => {
        render(<TzktLink transactionId={5}>Some Random Text</TzktLink>);
        expect(screen.getByTestId("tzkt-link")).toHaveAttribute(
          "href",
          `${network.tzktExplorerUrl}/transactions/5`
        );

        expect(screen.getByTestId("tzkt-link")).toHaveTextContent("Some Random Text");
      });

      it("renders a link to migrations if migrationId is provided", () => {
        render(<TzktLink migrationId={1} transactionId={5} />);
        expect(screen.getByTestId("tzkt-link")).toHaveAttribute(
          "href",
          `${network.tzktExplorerUrl}/migrations/1`
        );
      });

      it("renders a link to originations if originationId is provided", () => {
        render(<TzktLink originationId={1} transactionId={5} />);
        expect(screen.getByTestId("tzkt-link")).toHaveAttribute(
          "href",
          `${network.tzktExplorerUrl}/originations/1`
        );
      });
    });

    describe("hash props", () => {
      it("renders the link to the operation if only hash is provided", () => {
        render(<TzktLink hash="hello-hash" />);

        expect(screen.getByTestId("tzkt-link")).toHaveAttribute(
          "href",
          `${network.tzktExplorerUrl}/hello-hash`
        );
      });
    });
  });
});
