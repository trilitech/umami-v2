import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { MdArrowOutward, MdSouthWest } from "react-icons/md";

import { TezosNetwork } from "@airgap/tezos";
import type { BigNumber } from "bignumber.js";
import { FiPlus } from "react-icons/fi";
import { VscWand } from "react-icons/vsc";
import { Account, AccountType } from "../../types/Account";
import { FA12TokenBalance, FA2TokenBalance, NFTBalance } from "../../types/TokenBalance";
import { Delegation } from "../../types/Delegation";
import { OperationDisplay } from "../../types/Transfer";
import { CopyableAddress } from "../CopyableText";
import { Identicon } from "../Identicon";
import { TezRecapDisplay } from "../TezRecapDisplay";
import { AssetsPanel } from "./AssetsPannel/AssetsPanel";
import MultisigApprovers from "./MultisigApprovers";
import { DelegationMode } from "../sendForm/types";

type Props = {
  onSend: () => void;
  onReceive?: () => void;
  onBuyTez?: () => void;
  onDelegate: (opts?: DelegationMode["data"]) => void;
  label: string;
  pkh: string;
  tezBalance: string | null;
  dollarBalance: BigNumber | null;
  tokens: Array<FA12TokenBalance | FA2TokenBalance>;
  nfts: Array<NFTBalance>;
  operationDisplays: Array<OperationDisplay>;
  account: Account;
  network: TezosNetwork;
  delegation: Delegation | null;
};

const RoundButton: React.FC<{
  label: string;
  icon: any;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ icon, label, onClick = _ => {} }) => {
  return (
    <Box textAlign="center" ml={4} mr={4}>
      <IconButton onClick={onClick} borderRadius="50%" icon={icon} mb={2} aria-label="button" />
      <Text size="sm">{label}</Text>
    </Box>
  );
};

export const AccountCardDisplay: React.FC<Props> = ({
  pkh,
  onSend,
  onReceive = () => {},
  onDelegate,
  label,
  tezBalance,
  dollarBalance,
  tokens,
  nfts,
  account,
  operationDisplays,
  network,
  delegation,
}) => {
  const isMultisig = account.type === AccountType.MULTISIG;
  return (
    <Flex direction="column" alignItems="center" data-testid={`account-card-${pkh}`}>
      <Identicon address={pkh} />
      <Heading mt={4} mb={2} size="md">
        {label}
      </Heading>
      <CopyableAddress pkh={pkh} mb={4} />
      {tezBalance !== null && (
        <TezRecapDisplay center tezBalance={tezBalance} dollarBalance={dollarBalance} />
      )}
      <Flex mt={6}>
        <RoundButton onClick={onSend} label="Send" icon={<MdArrowOutward />} />
        <RoundButton label="Receive" icon={<MdSouthWest />} onClick={onReceive} />
        {!isMultisig && <RoundButton label="Buy tez" icon={<FiPlus />} />}
        <RoundButton label="Delegate" icon={<VscWand />} onClick={() => onDelegate()} />
      </Flex>
      {isMultisig && <MultisigApprovers signers={account.signers} />}
      <AssetsPanel
        onDelegate={onDelegate}
        tokens={tokens}
        nfts={nfts}
        account={account}
        operationDisplays={operationDisplays}
        network={network}
        delegation={delegation}
      />
    </Flex>
  );
};
