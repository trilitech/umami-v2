import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { MdArrowOutward, MdSouthWest } from "react-icons/md";

import { FiPlus } from "react-icons/fi";
import { VscWand } from "react-icons/vsc";
import { FA12Token, FA2Token, NFT } from "../../types/Asset";
import { CopyableAddress } from "../CopyableText";
import { Identicon } from "../Identicon";
import { TezRecapDisplay } from "../TezRecapDisplay";
import { AssetsPannel } from "./AssetsPannel/AssetsPannel";
import type { BigNumber } from "bignumber.js";
import { AccountType, AllAccount } from "../../types/Account";
import MultisigSigners from "./MultisigSigners";

type Props = {
  onSend?: () => void;
  onReceive?: () => void;
  onBuyTez?: () => void;
  onDelegate?: () => void;
  label: string;
  pkh: string;
  tezBalance: string | null;
  dollarBalance: BigNumber | null;
  tokens: Array<FA12Token | FA2Token>;
  nfts: Array<NFT>;
  account: AllAccount;
};

const RoundButton: React.FC<{
  label: string;
  icon: any;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ icon, label, onClick = (_) => {} }) => {
  return (
    <Box textAlign="center" ml={4} mr={4}>
      <IconButton
        onClick={onClick}
        borderRadius={"50%"}
        aria-label="Search database"
        icon={icon}
        mb={2}
      />
      <Text size={"sm"}>{label}</Text>
    </Box>
  );
};

export const AccountCardDisplay: React.FC<Props> = ({
  pkh,
  onSend = () => {},
  onReceive = () => {},
  onBuyTez = () => {},
  onDelegate = () => {},
  label,
  tezBalance,
  dollarBalance,
  tokens,
  nfts,
  account,
}) => {
  const isMultisig = account.type === AccountType.MULTISIG;
  return (
    <Flex
      direction="column"
      alignItems={"center"}
      data-testid={`account-card-${pkh}`}
      paddingX={4}
    >
      <Identicon address={pkh} />
      <Heading mt={4} mb={2} size={"md"}>
        {label}
      </Heading>
      <CopyableAddress pkh={pkh} mb={4} />
      {tezBalance !== null && (
        <TezRecapDisplay
          center
          tezBalance={tezBalance}
          dollarBalance={dollarBalance}
        />
      )}
      <Flex mt={6}>
        <RoundButton onClick={onSend} label="Send" icon={<MdArrowOutward />} />
        <RoundButton
          label="Receive"
          icon={<MdSouthWest />}
          onClick={onReceive}
        />
        {!isMultisig && <RoundButton label="Buy tez" icon={<FiPlus />} />}
        <RoundButton label="Delegate" icon={<VscWand />} />
      </Flex>
      {isMultisig && <MultisigSigners signers={account.signers} />}
      <AssetsPannel tokens={tokens} nfts={nfts} />
    </Flex>
  );
};
