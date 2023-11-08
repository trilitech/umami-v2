import { PropsWithChildren } from "react";
import { Link, LinkProps } from "@chakra-ui/react";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";

export const TzktLink: React.FC<
  PropsWithChildren<
    { transactionId: number; originationId?: number; migrationId?: number } & LinkProps
  >
> = ({ transactionId, originationId, migrationId, children, ...props }) => {
  const network = useSelectedNetwork();

  let url = "";
  if (migrationId) {
    url = `${network.tzktExplorerUrl}/migrations/${migrationId}`;
  } else if (originationId) {
    url = `${network.tzktExplorerUrl}/originations/${originationId}`;
  } else {
    url = `${network.tzktExplorerUrl}/transactions/${transactionId}`;
  }

  return (
    <Link data-testid="tzkt-link" href={url} isExternal {...props}>
      {children}
    </Link>
  );
};
