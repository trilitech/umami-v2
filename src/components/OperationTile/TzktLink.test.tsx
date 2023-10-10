import { render, screen } from "../../mocks/testUtils";
import { DefaultNetworks } from "../../types/Network";
import { networksActions } from "../../utils/redux/slices/networks";
import store from "../../utils/redux/store";
import { TzktCombinedOperation } from "../../utils/tezos";
import { TzktLink } from "./TzktLink";

describe("<TzktLink />", () => {
  it.each(DefaultNetworks)(
    "renders a link to the tzkt explorer with provided children on $name",
    network => {
      store.dispatch(networksActions.setCurrent(network));
      render(
        <TzktLink operation={{ hash: "askljdfh123", counter: 123 } as TzktCombinedOperation}>
          Some Random Text
        </TzktLink>
      );
      expect(screen.getByTestId("tzkt-link")).toHaveAttribute(
        "href",
        `${network.tzktExplorerUrl}/askljdfh123/123`
      );

      expect(screen.getByTestId("tzkt-link")).toHaveTextContent("Some Random Text");
    }
  );
});
