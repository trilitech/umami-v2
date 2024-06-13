import { Box, Center, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { noop } from "lodash";
import { ReactElement, useContext, useEffect, useState } from "react";

import { AssetsPanel } from "./AssetsPanel/AssetsPanel";
import { MultisigApprovers } from "./MultisigApprovers";
import { RenameRemoveMenuSwitch } from "./RenameRemoveMenuSwitch";
import { BakerIcon, IncomingArrow, OutgoingArrow, PlusIcon } from "../../assets/icons";
import colors from "../../style/colors";
import { Account } from "../../types/Account";
import { Delegation, makeDelegation } from "../../types/Delegation";
import { FA12TokenBalance, FA2TokenBalance, NFTBalance } from "../../types/TokenBalance";
import { useGetAccountBalance, useGetDollarBalance } from "../../utils/hooks/assetsHooks";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { getLastDelegation } from "../../utils/tezos";
import { accountIconGradient } from "../AccountTile/AccountTile";
import { AccountTileIcon } from "../AccountTile/AccountTileIcon";
import { AddressPill } from "../AddressPill/AddressPill";
import { BuyTezForm } from "../BuyTez/BuyTezForm";
import { DynamicModalContext } from "../DynamicModal";
import { FormPage as DelegationFormPage } from "../SendFlow/Delegation/FormPage";
import { TezRecapDisplay } from "../TezRecapDisplay";

type Props = {
  onSend: () => void;
  onReceive?: () => void;
  onBuyTez?: () => void;
  tokens: Array<FA12TokenBalance | FA2TokenBalance>;
  nfts: Array<NFTBalance>;
  account: Account;
};

const RoundButton: React.FC<{
  label: string;
  icon: ReactElement;
  onClick?: () => void;
}> = ({ icon, label, onClick = () => {} }) => (
  <Box
    className="account-drawer-cta-button"
    color={colors.gray[300]}
    textAlign="center"
    _hover={{ color: colors.green }}
    cursor="pointer"
    marginX="24px"
    onClick={onClick}
  >
    <IconButton
      className="account-drawer-cta-button-icon"
      marginBottom="8px"
      aria-label="button"
      icon={icon}
      size="lg"
      variant="circle_without_color"
    />
    <Text cursor="pointer" size="sm">
      {label}
    </Text>
  </Box>
);

export const AccountDrawerDisplay: React.FC<Props> = ({
  onSend,
  onReceive = () => {},
  tokens,
  nfts,
  account,
}) => {
  const isMultisig = account.type === "multisig";
  const { openWith } = useContext(DynamicModalContext);
  const network = useSelectedNetwork();
  const pkh = account.address.pkh;
  const [delegation, setDelegation] = useState<Delegation | null>(null);
  const { handleAsyncAction } = useAsyncActionHandler();
  const balance = useGetAccountBalance()(pkh);
  const dollarBalance = useGetDollarBalance()(pkh);

  useEffect(() => {
    handleAsyncAction(async () => {
      const tzktDelegation = await getLastDelegation(pkh, network);
      tzktDelegation && setDelegation(makeDelegation(tzktDelegation));
    }).catch(noop);
  }, [pkh, handleAsyncAction, network]);

  return (
    <Flex
      zIndex={2}
      alignItems="center"
      flexDirection="column"
      height="100%"
      // crutch for the sticky background gradient
      marginTop="-86px"
      paddingTop="86px"
      paddingRight="30px"
      background={accountIconGradient({
        account,
        radius: "350px",
        opacity: "35",
        mainBackgroundColor: "transparent",
        left: "300px",
        top: "-125px",
      })}
      data-testid={`account-card-${account.address.pkh}`}
    >
      <AccountTileIcon account={account} size="lg" />
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
            label="Buy Tez"
            onClick={() => openWith(<BuyTezForm recipient={account.address.pkh} />)}
          />
        )}
        <RoundButton
          icon={<BakerIcon width="24px" height="24px" stroke="currentcolor" />}
          label="Delegate"
          onClick={() =>
            openWith(
              <DelegationFormPage
                form={
                  delegation
                    ? { baker: delegation.delegate.address, sender: account.address.pkh }
                    : undefined
                }
                sender={account}
              />
            )
          }
        />
      </Center>
      {isMultisig && <MultisigApprovers signers={account.signers} />}
      <AssetsPanel account={account} delegation={delegation} nfts={nfts} tokens={tokens} />
    </Flex>
  );
};
