import { Card } from "@chakra-ui/react";

import ChainAddressMini from "./ChainAddressMini";

type SmartAccount = {
  address: string;
  type: string;
};

interface Props {
  account: SmartAccount;
}

export default function ChainSmartAddressMini({ account }: Props) {
  return (
    <div>
      <div>
        <Card>({account.type})</Card>
        <ChainAddressMini address={account.address} />
      </div>
    </div>
  );
}
