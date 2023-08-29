import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { MdArrowOutward, MdSouthWest } from "react-icons/md";

import type { BigNumber } from "bignumber.js";
import { FiPlus } from "react-icons/fi";
import { VscWand } from "react-icons/vsc";
import { Account, AccountType } from "../../types/Account";
import { FA12TokenBalance, FA2TokenBalance, NFTBalance } from "../../types/TokenBalance";
import { Delegation } from "../../types/Delegation";
import { Identicon } from "../Identicon";
import { TezRecapDisplay } from "../TezRecapDisplay";
import { AssetsPanel } from "./AssetsPanel/AssetsPanel";
import MultisigApprovers from "./MultisigApprovers";
import { DelegationMode } from "../sendForm/types";
import AddressPill from "../AddressPill/AddressPill";
import { OperationDisplay } from "../../types/Transfer";
import { TezosNetwork } from "../../types/TezosNetwork";

type Props = {
  onSend: () => void;
  onReceive?: () => void;
  onBuyTez?: () => void;
  onDelegate: (opts?: DelegationMode["data"]) => void;
  label: string;
  pkh: string;
  balance: string | undefined;
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
      <IconButton onClick={onClick} icon={icon} mb={2} aria-label="button" variant="circle" />
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
  balance,
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
      <Identicon identiconSize={32} address={pkh} />
      <Heading mt={4} size="md">
        {label}
      </Heading>
      <AddressPill address={account.address} mode={{ type: "no_icons" }} my={2} />
      {balance && <TezRecapDisplay center balance={balance} dollarBalance={dollarBalance} />}
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
