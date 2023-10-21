import { Box, Center, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import type { BigNumber } from "bignumber.js";
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
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import BakerIcon from "../../assets/icons/Baker";
import OutgoingArrow from "../../assets/icons/OutgoingArrow";
import IncomingArrow from "../../assets/icons/IncomingArrow";
import PlusIcon from "../../assets/icons/Plus";

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
  icon: JSX.Element;
  onClick?: () => void;
}> = ({ icon, label, onClick = () => {} }) => {
  return (
    <Box textAlign="center" mx="24px">
      <IconButton
        onClick={onClick}
        size="lg"
        icon={icon}
        mb="8px"
        aria-label="button"
        variant="circle"
      />
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
  const { handleAsyncAction } = useAsyncActionHandler();

  useEffect(() => {
    handleAsyncAction(async () => {
      const tzktDelegation = await getLastDelegation(account.address.pkh, network);
      tzktDelegation && setDelegation(makeDelegation(tzktDelegation));
    });
    // handleAsyncAction gets constantly recreated, so we can't add it to the dependency array
    // otherwise, it will trigger the initial fetch infinitely
    // caching handleAsyncAction using useCallback doesn't work either
    // because it depends on its own isLoading state which changes sometimes
    // TODO: check useRef
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.address.pkh, network]);

  return (
    <Flex direction="column" alignItems="center" data-testid={`account-card-${pkh}`}>
      <AccountTileIcon addressKind={addressKind} />
      <Heading mt="24px" size="md">
        {label}
      </Heading>
      <AddressPill address={account.address} mode={{ type: "no_icons" }} mt="8px" mb="30px" />
      {balance && <TezRecapDisplay center balance={balance} dollarBalance={dollarBalance} />}
      <Center mt="34px">
        <RoundButton
          onClick={onSend}
          label="Send"
          icon={<OutgoingArrow stroke="currentcolor" width="24px" height="24px" />}
        />
        <RoundButton
          label="Receive"
          icon={<IncomingArrow stroke="currentcolor" width="24px" height="24px" />}
          onClick={onReceive}
        />
        {!isMultisig && (
          <RoundButton
            label="Buy tez"
            icon={<PlusIcon stroke="currentcolor" />}
            onClick={() => {
              openWith(<BuyTezForm recipient={sender.address.pkh} />);
            }}
          />
        )}
        <RoundButton
          label="Delegate"
          icon={<BakerIcon stroke="currentcolor" width="24px" height="24px" />}
          onClick={() => {
            openWith(
              <DelegationFormPage
                sender={sender}
                form={delegation ? { baker: delegation.delegate.address, sender: pkh } : undefined}
              />
            );
          }}
        />
      </Center>
      {isMultisig && <MultisigApprovers signers={account.signers} />}
      <AssetsPanel tokens={tokens} nfts={nfts} account={account} delegation={delegation} />
    </Flex>
  );
};
