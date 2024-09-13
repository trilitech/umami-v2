/* eslint-disable react-hooks/rules-of-hooks */
import { Card, Divider, useToast } from "@chakra-ui/react";
import { type JsonRpcError, type JsonRpcResult, formatJsonRpcError } from "@json-rpc-tools/utils";
import { type MnemonicAccount } from "@umami/core";
import {
  ModalStore,
  useCurrentAccount,
  useFindNetwork,
  useGetOwnedAccountSafe,
  useGetSecretKey,
 web3wallet } from "@umami/state";
import { makeToolkit } from "@umami/tezos";
import { getSdkError } from "@walletconnect/utils";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import RequestDataCard from "./RequestDataCard";
import RequesDetailsCard from "./RequestDetailsCard";
import RequestMethodCard from "./RequestMethodCard";
import RequestModal from "./RequestModal";
import {
  approveTezosRequest,
  rejectTezosRequest,
} from "../../components/SendFlow/WalletConnect/useSignWithWalletConnect";
import { PasswordInput } from "../PasswordInput";


export default function SessionSignTezosModal() {
  const toast = useToast();
  const account = useCurrentAccount();
  const findNetwork = useFindNetwork();
  const getAccount = useGetOwnedAccountSafe();
  const getSecretKey = useGetSecretKey();
  const form=useForm({defaultValues: {password: ""}});

  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.requestEvent;
  const requestSession = ModalStore.state.data?.requestSession;
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <Card>Missing request data</Card>;
  }
  if (!account) {
    return <Card>Missing account</Card>;
  }

  // Get required request data
  const { topic, params, id } = requestEvent;
  const { request, chainId } = params;

  // Handle approve action (logic varies based on request method)
  const onApprove = async () => {
    setIsLoadingApprove(true);

    // if chainId is tezos:testnet, use ghostnet instead
    const network = findNetwork(chainId === "tezos:testnet" ? "ghostnet" : chainId.split(":")[1]);
    let response: JsonRpcResult | JsonRpcError | undefined = undefined;
    if (!network) {
      console.error(
        `Tezos_send operation failed, network for chainId ${chainId} not found: `,
        getSdkError("INVALID_EVENT").message
      );
      response = formatJsonRpcError(id, getSdkError("INVALID_EVENT").message);
    } else if (request.method !== "tezos_getAccounts" && account.address.pkh !== request.params.account) {
      console.error(
        "Tezos_send operation failed, received account does not match the signer: ",
        account.address.pkh,
        getSdkError("UNAUTHORIZED_EVENT").message
      );
      response = formatJsonRpcError(id, getSdkError("UNAUTHORIZED_EVENT").message);
    } else {
      const signer = getAccount(account.address.pkh);
      if (!signer) {
        console.error(
          "Tezos_send operation failed, no signer: ",
          getSdkError("UNAUTHORIZED_EVENT").message
        );
        response = formatJsonRpcError(id, getSdkError("UNAUTHORIZED_EVENT").message);
      } else {
        try {
          const secretKey = await getSecretKey(signer as MnemonicAccount, form.getValues("password"));
          const toolkit = await makeToolkit({ type: "mnemonic", secretKey, network });
          response = await approveTezosRequest(requestEvent, toolkit, signer, network);
        } catch (e) {
          setIsLoadingApprove(false);
          toast({ description: (e as Error).message, status: "error" });
          return;
        }
      }
    }
    try {
      await web3wallet.respondSessionRequest({
        topic,
        response,
      });
    } catch (e) {
      toast({ description: (e as Error).message, status: "error" });
    } finally {
      setIsLoadingApprove(false);
      ModalStore.close();
    }
  }

  // Handle reject action
  const onReject = async () => {
    setIsLoadingReject(true);
    const response = rejectTezosRequest(requestEvent);
    try {
      await web3wallet.respondSessionRequest({
        topic,
        response,
      });
    } catch (e) {
      setIsLoadingReject(false);
      toast({ description: (e as Error).message, status: "error" });
      return;
    } finally {
      setIsLoadingReject(false);
      ModalStore.close();
    }
  }

  return (
    <FormProvider {...form}>
      <RequestModal
      approveLoader={{ active: isLoadingApprove }}
      intention="sign a Tezos message"
      metadata={requestSession.peer.metadata}
      onApprove={onApprove}
      onReject={onReject}
      rejectLoader={{ active: isLoadingReject }}
    >
      <RequesDetailsCard chains={[chainId]} protocol={requestSession.relay.protocol} />
      <Divider />
      <RequestDataCard data={params} />
      <Divider />
      <RequestMethodCard methods={[request.method]} />
      <Divider />
        <form>
          <PasswordInput inputName="password"/>
        </form>
      </RequestModal>
      </FormProvider>
  );
}
