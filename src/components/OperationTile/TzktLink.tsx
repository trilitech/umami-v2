import { PropsWithChildren } from "react";
import { TzktCombinedOperation } from "../../utils/tezos";
import { Link, LinkProps } from "@chakra-ui/react";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { getHashUrl } from "../../views/operations/operationsUtils";

export const TzktLink: React.FC<
  PropsWithChildren<{ operation: TzktCombinedOperation } & LinkProps>
> = ({ operation, children, ...props }) => {
  const network = useSelectedNetwork();

  let url;
  if (operation.type === "token_transfer") {
    url = getHashUrl({
      hash: "transactions/" + operation.id,
      network,
    });
  } else {
    url = getHashUrl({
      hash: operation.hash,
      counter: operation.counter,
      network,
    });
  }

  return (
    <Link data-testid="tzkt-link" href={url} isExternal {...props}>
      {children}
    </Link>
  );
};
