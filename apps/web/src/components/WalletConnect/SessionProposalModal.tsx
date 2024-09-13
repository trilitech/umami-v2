import { Card , useToast } from "@chakra-ui/react";
import { ModalStore, SettingsStore, TEZOS_CHAINS , TEZOS_SIGNING_METHODS , getChainData, useCurrentAccount , web3wallet } from "@umami/state";
import { type SignClientTypes } from "@walletconnect/types";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import { useCallback, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSnapshot } from "valtio";

import ChainAddressMini from "./ChainAddressMini";
import ChainDataMini from "./ChainDataMini";
import RequestModal from "./RequestModal";
import { CheckmarkIcon , CloseIcon } from "../../assets/icons";


// import ChainSmartAddressMini from './ChainSmartAddressMini'
// import usePriorityAccounts from '@/hooks/usePriorityAccounts'
// import useSmartAccounts from '@/hooks/useSmartAccounts'

const StyledText = "font-normal";
const StyledSpan = "font-normal";
const StyledH4 = `${StyledText} text-xl font-semibold`;

export default function SessionProposalModal() {
  // const { smartAccountEnabled } = useSnapshot(SettingsStore.state)
  // Get proposal data and wallet address from store
  const data = useSnapshot(ModalStore.state);
  const currentAccount = useCurrentAccount()!;
  const toast = useToast();
  const proposal = data.data?.proposal as SignClientTypes.EventArguments["session_proposal"];
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);
  const form = useForm({});
  // const { getAvailableSmartAccounts } = useSmartAccounts()

  const supportedNamespaces = useMemo(() => {
    // tezos
    const tezosChains = Object.keys(TEZOS_CHAINS);
    const tezosMethods = Object.values(TEZOS_SIGNING_METHODS);

    return {
      tezos: {
        chains: tezosChains,
        methods: tezosMethods,
        events: [],
        accounts: tezosChains.map(chain => `${chain}:${currentAccount.address.pkh}`).flat(),
      },
    };
  }, []);
  console.log("supportedNamespaces", supportedNamespaces);

  const requestedChains = useMemo(() => {
    const required = [];
    for (const [key, values] of Object.entries(proposal.params.requiredNamespaces)) {
      const chains = key.includes(":") ? key : values.chains;
      required.push(chains);
    }

    const optional = [];
    for (const [key, values] of Object.entries(proposal.params.optionalNamespaces)) {
      const chains = key.includes(":") ? key : values.chains;
      optional.push(chains);
    }
    console.log("requestedChains", [...new Set([...required.flat(), ...optional.flat()])]);

    return [...new Set([...required.flat(), ...optional.flat()])];
  }, [proposal]);

  // the chains that are supported by the wallet from the proposal
  const supportedChains = useMemo(
    () =>
      requestedChains
        .map(chain => {
          const chainData = getChainData(chain!);

          if (!chainData) {return null;}

          return chainData;
        })
        .filter(chain => chain), // removes null values
    [requestedChains]
  );

  // get required chains that are not supported by the wallet
  const notSupportedChains = useMemo(() => {
    const required = [];
    for (const [key, values] of Object.entries(proposal.params.requiredNamespaces)) {
      const chains = key.includes(":") ? key : values.chains;
      required.push(chains);
    }
    return required
      .flat()
      .filter(
        chain =>
          !supportedChains
            .map(supportedChain => `${supportedChain?.namespace}:${supportedChain?.chainId}`)
            .includes(chain!)
      );
  }, [proposal, supportedChains]);
  console.log("notSupportedChains", { notSupportedChains, supportedChains });
  const namespaces = useMemo(() => {
    try {
      // the builder thdivs an exception if required namespaces are not supported
      return buildApprovedNamespaces({
        proposal: proposal.params,
        supportedNamespaces,
      });
    } catch (e) {
      toast({ description: (e as Error).message, status: "error" });
      return null;
    }
  }, [proposal.params, supportedNamespaces]);

  // Hanlde approve action, construct session namespace
  const onApprove = useCallback(async () => {
    if (proposal && namespaces) {
      setIsLoadingApprove(true);
      try {
        await web3wallet.approveSession({
          id: proposal.id,
          namespaces,
          sessionProperties: {},
        });
        SettingsStore.setSessions(Object.values(web3wallet.getActiveSessions()));
      } catch (e) {
        setIsLoadingApprove(false);
        toast({ description: (e as Error).message, status: "error" });
        return;
      }
    }
    setIsLoadingApprove(false);
    ModalStore.close();
  }, [namespaces, proposal]);

  // Hanlde reject action
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const onReject = useCallback(async () => {
    try {
      setIsLoadingReject(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await web3wallet.rejectSession({
        id: proposal.id,
        reason: getSdkError("USER_REJECTED_METHODS"),
      });
    } catch (e) {
      setIsLoadingReject(false);
      toast({ description: (e as Error).message, status: "error" });
      return;
    }
    setIsLoadingReject(false);
    ModalStore.close();
  }, [proposal]);
  console.log("notSupportedChains", notSupportedChains);
  console.log("returning RequestModal");
  return (
    <FormProvider {...form}>
    <RequestModal
      approveLoader={{ active: isLoadingApprove }}
      disableApprove={notSupportedChains.length > 0 || supportedChains.length === 0}
      infoBoxCondition={notSupportedChains.length > 0 || supportedChains.length === 0}
      infoBoxText="The session cannot be approved because the wallet does not the support some or all of the proposed chains. Please inspect the console for more information."
      metadata={proposal.params.proposer.metadata}
      onApprove={onApprove}
      onReject={onReject}
      rejectLoader={{ active: isLoadingReject }}
    >
      <div>
        <div>
          <Card className={StyledH4}>Requested permissions</Card>
        </div>
      </div>
      <div>
        <div>
          <CheckmarkIcon style={{ verticalAlign: "bottom" }} />{" "}
          <Card className={StyledSpan}>View your balance and activity</Card>
        </div>
      </div>
      <div>
        <div>
          <CheckmarkIcon style={{ verticalAlign: "bottom" }} />{" "}
          <Card className={StyledSpan}>Send approval requests</Card>
        </div>
      </div>
      <div>
        <div style={{ color: "gray" }}>
          <CloseIcon style={{ verticalAlign: "bottom" }} />
          <Card className={StyledSpan}>Move funds without permission</Card>
        </div>
      </div>
      <div style={{ marginBottom: "10px", marginTop: "10px" }}>
        <div>
          <div style={{ color: "GrayText" }}>Accounts</div>
          {(supportedChains.length > 0 &&
            supportedChains.map((chain, i) => (
                <div key={i}>
                  <ChainAddressMini key={i} address={currentAccount.address.pkh} />
                </div>
              ))) || <div>Non available</div>}
        </div>
        <div>
          <div style={{ color: "gray" }}>Chains</div>
          {(supportedChains.length > 0 &&
            supportedChains.map((chain, i) => {
              if (!chain) {
                return <></>;
              }

              return (
                <div key={i}>
                  <ChainDataMini key={i} chainId={`${chain.namespace}:${chain.chainId}`} />
                </div>
              );
            })) || <div>Non available</div>}
          <div style={{ color: "gray" }}>Chains</div>
        </div>
      </div>
    </RequestModal>
    </FormProvider>
  );
}
