import { Box, Center, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import type { BigNumber } from "bignumber.js";
import { Account } from "../../types/Account";
import { FA12TokenBalance, FA2TokenBalance, NFTBalance } from "../../types/TokenBalance";
import { TezRecapDisplay } from "../TezRecapDisplay";
import { AssetsPanel } from "./AssetsPanel/AssetsPanel";
import MultisigApprovers from "./MultisigApprovers";
import AddressPill from "../AddressPill/AddressPill";
import { DynamicModalContext } from "../DynamicModal";
import { useContext, useEffect, useState } from "react";
import DelegationFormPage from "../SendFlow/Delegation/FormPage";
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
import RenameRemoveMenuSwitch from "./RenameRemoveMenuSwitch";

type Props = {
  onSend: () => void;
  onReceive?: () => void;
  onBuyTez?: () => void;
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
    <Box textAlign="center" marginX="24px">
      <IconButton
        marginBottom="8px"
        aria-label="button"
        icon={icon}
        onClick={onClick}
        size="lg"
        variant="circle"
      />
      <Text size="sm">{label}</Text>
    </Box>
  );
};

export const AccountDrawerDisplay: React.FC<Props> = ({
  onSend,
  onReceive = () => {},
  balance,
  dollarBalance,
  tokens,
  nfts,
  account,
}) => {
  const isMultisig = account.type === "multisig";
  const { openWith } = useContext(DynamicModalContext);
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
    <Flex
      alignItems="center"
      flexDirection="column"
      data-testid={`account-card-${account.address.pkh}`}
    >
      <AccountTileIcon addressKind={addressKind} />
      <Heading marginTop="24px" size="md">
        {account.label}
      </Heading>
      <Flex alignItems="center" marginTop="8px" marginBottom="30px">
        <AddressPill marginRight="4px" address={account.address} mode={{ type: "no_icons" }} />
        <RenameRemoveMenuSwitch account={account} />
      </Flex>
      {balance && <TezRecapDisplay balance={balance} center dollarBalance={dollarBalance} />}
      <Center marginTop="34px">
        <RoundButton
          icon={<OutgoingArrow width="24px" height="24px" stroke="currentcolor" />}
          label="Send"
          onClick={onSend}
        />
        <RoundButton
          icon={<IncomingArrow width="24px" height="24px" stroke="currentcolor" />}
          label="Receive"
          onClick={onReceive}
        />
        {!isMultisig && (
          <RoundButton
            icon={<PlusIcon stroke="currentcolor" />}
            label="Buy tez"
            onClick={() => {
              openWith(<BuyTezForm recipient={account.address.pkh} />);
            }}
          />
        )}
        <RoundButton
          icon={<BakerIcon width="24px" height="24px" stroke="currentcolor" />}
          label="Delegate"
          onClick={() => {
            openWith(
              <DelegationFormPage
                form={
                  delegation
                    ? { baker: delegation.delegate.address, sender: account.address.pkh }
                    : undefined
                }
                sender={account}
              />
            );
          }}
        />
      </Center>
      {isMultisig && <MultisigApprovers signers={account.signers} />}
      <AssetsPanel account={account} delegation={delegation} nfts={nfts} tokens={tokens} />
    </Flex>
  );
};
