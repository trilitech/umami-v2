import { PropsWithChildren } from "react";
import { Link, LinkProps } from "@chakra-ui/react";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { compact } from "lodash";

// Following types prevent passing both hash and id props
type OperationHashProps = {
  hash: string;
  counter?: number;
  transactionId?: never;
  originationId?: never;
  migrationId?: never;
};

type OperationIdProps = {
  hash?: never;
  counter?: never;
  transactionId?: number;
  originationId?: number;
  migrationId?: number;
};

type Props = OperationHashProps | OperationIdProps;

export const TzktLink: React.FC<PropsWithChildren<Props & LinkProps>> = ({
  hash,
  counter,
  transactionId,
  originationId,
  migrationId,
  children,
  ...props
}) => {
  const { tzktExplorerUrl } = useSelectedNetwork();
  let url = tzktExplorerUrl;

  if (hash) {
    url = compact([tzktExplorerUrl, hash, counter]).join("/");
  } else if (migrationId) {
    url = `${url}/migrations/${migrationId}`;
  } else if (originationId) {
    url = `${url}/originations/${originationId}`;
  } else if (transactionId) {
    url = `${url}/transactions/${transactionId}`;
  } else {
    console.warn("No id provided to TzktLink");
  }

  return (
    <Link data-testid="tzkt-link" href={url} isExternal {...props}>
      {children}
    </Link>
  );
};
