import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { MdArrowOutward, MdSouthWest } from "react-icons/md";

import type { BigNumber } from "bignumber.js";
import { FiPlus } from "react-icons/fi";
import { VscWand } from "react-icons/vsc";
import { Account, AccountType } from "../../types/Account";
import { FA12TokenBalance, FA2TokenBalance, NFTBalance } from "../../types/TokenBalance";
import { Identicon } from "../Identicon";
import { TezRecapDisplay } from "../TezRecapDisplay";
import { AssetsPanel } from "./AssetsPanel/AssetsPanel";
import MultisigApprovers from "./MultisigApprovers";
import AddressPill from "../AddressPill/AddressPill";
import { OperationDisplay } from "../../types/Transfer";
import { TezosNetwork } from "../../types/TezosNetwork";
import { DynamicModalContext } from "../DynamicModal";
import { useContext } from "react";
import DelegationFormPage from "../SendFlow/Delegation/FormPage";
import { useGetOwnedAccount } from "../../utils/hooks/accountHooks";

type Props = {
  onSend: () => void;
  onReceive?: () => void;
  onBuyTez?: () => void;
  label: string;
  pkh: string;
  balance: string | undefined;
  dollarBalance: BigNumber | null;
  tokens: Array<FA12TokenBalance | FA2TokenBalance>;
  nfts: Array<NFTBalance>;
  operationDisplays: Array<OperationDisplay>;
  account: Account;
  network: TezosNetwork;
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
  label,
  balance,
  dollarBalance,
  tokens,
  nfts,
  account,
  operationDisplays,
  network,
}) => {
  const isMultisig = account.type === AccountType.MULTISIG;
  const getOwnedAccount = useGetOwnedAccount();
  const { openWith } = useContext(DynamicModalContext);
  // TODO: create a hook to retrieve the baker if the account is delegating.
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
        <RoundButton
          label="Delegate"
          icon={<VscWand />}
          onClick={() => {
            openWith(<DelegationFormPage sender={getOwnedAccount(pkh)} />);
          }}
        />
      </Flex>
      {isMultisig && <MultisigApprovers signers={account.signers} />}
      <AssetsPanel
        tokens={tokens}
        nfts={nfts}
        account={account}
        operationDisplays={operationDisplays}
        network={network}
      />
    </Flex>
  );
};
