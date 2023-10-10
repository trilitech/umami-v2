import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { MdArrowOutward, MdSouthWest } from "react-icons/md";

import type { BigNumber } from "bignumber.js";
import { FiPlus } from "react-icons/fi";
import { VscWand } from "react-icons/vsc";
import { Account, AccountType } from "../../types/Account";
import { FA12TokenBalance, FA2TokenBalance, NFTBalance } from "../../types/TokenBalance";
import { TezRecapDisplay } from "../TezRecapDisplay";
import { AssetsPanel } from "./AssetsPanel/AssetsPanel";
import MultisigApprovers from "./MultisigApprovers";
import AddressPill from "../AddressPill/AddressPill";
import { DynamicModalContext } from "../DynamicModal";
import { useContext, useEffect, useState } from "react";
import DelegationFormPage from "../SendFlow/Delegation/FormPage";
import { useGetOwnedAccount } from "../../utils/hooks/accountHooks";
import BuyTezForm from "../BuyTez/BuyTezForm";
import useAddressKind from "../AddressTile/useAddressKind";
import AccountTileIcon from "../AccountTile/AccountTileIcon";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { Delegation, makeDelegation } from "../../types/Delegation";
import { getLastDelegation } from "../../utils/tezos";

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
  account: Account;
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

export const AccountDrawerDisplay: React.FC<Props> = ({
  pkh,
  onSend,
  onReceive = () => {},
  label,
  balance,
  dollarBalance,
  tokens,
  nfts,
  account,
}) => {
  const isMultisig = account.type === AccountType.MULTISIG;
  const getOwnedAccount = useGetOwnedAccount();
  const { openWith } = useContext(DynamicModalContext);
  const sender = getOwnedAccount(pkh);
  const addressKind = useAddressKind(account.address);
  const network = useSelectedNetwork();

  const [delegation, setDelegation] = useState<Delegation | null>(null);

  useEffect(() => {
    getLastDelegation(account.address.pkh, network).then(tzktDelegation => {
      tzktDelegation && setDelegation(makeDelegation(tzktDelegation));
    });
  }, [account.address.pkh, network]);

  return (
    <Flex direction="column" alignItems="center" data-testid={`account-card-${pkh}`}>
      <AccountTileIcon addressKind={addressKind} />
      <Heading mt={4} size="md">
        {label}
      </Heading>
      <AddressPill address={account.address} mode={{ type: "no_icons" }} mt="8px" mb="30px" />
      {balance && <TezRecapDisplay center balance={balance} dollarBalance={dollarBalance} />}
      <Flex mt={6}>
        <RoundButton onClick={onSend} label="Send" icon={<MdArrowOutward />} />
        <RoundButton label="Receive" icon={<MdSouthWest />} onClick={onReceive} />
        {!isMultisig && (
          <RoundButton
            label="Buy tez"
            icon={<FiPlus />}
            onClick={() => {
              openWith(<BuyTezForm recipient={sender.address.pkh} />);
            }}
          />
        )}
        <RoundButton
          label="Delegate"
          icon={<VscWand />}
          onClick={() => {
            openWith(
              <DelegationFormPage
                sender={sender}
                form={delegation ? { baker: delegation.delegate.address, sender: pkh } : undefined}
              />
            );
          }}
        />
      </Flex>
      {isMultisig && <MultisigApprovers signers={account.signers} />}
      <AssetsPanel tokens={tokens} nfts={nfts} account={account} delegation={delegation} />
    </Flex>
  );
};
