import { compact } from "lodash";
import { Network } from "../../types/Network";

// When submitting batch it makes sense to use the whole batch URL which can be accessed by the operation hash
// But when it comes to showing individual operations, it's worth adding nonce counter to the URL to navigate to the exact operation
export const getHashUrl = ({
  hash,
  counter,
  network,
}: {
  hash: string;
  counter?: number;
  network: Network;
}) => compact([network.tzktExplorerUrl, hash, counter]).join("/");
