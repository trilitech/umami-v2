import { PropsWithChildren } from "react";
import { TzktCombinedOperation } from "../../utils/tezos";
import { Link, LinkProps } from "@chakra-ui/react";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { getHashUrl } from "../../views/operations/operationsUtils";

export const TzktLink: React.FC<
  PropsWithChildren<{ operation: TzktCombinedOperation } & LinkProps>
> = ({ operation, children, ...props }) => {
  const network = useSelectedNetwork();
  const url = getHashUrl({
    hash: operation.hash as string, // TODO: use zod
    counter: operation.counter as number, // TODO: use zod
    network,
  });
  return (
    <Link data-testid="tzkt-link" href={url} isExternal {...props}>
      {children}
    </Link>
  );
};
