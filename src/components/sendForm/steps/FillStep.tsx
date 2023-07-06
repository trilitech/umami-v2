import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { TransferParams } from "@taquito/taquito";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { AccountType, MultisigAccount } from "../../../types/Account";
import { parseContractPkh, parseImplicitPkh, parsePkh } from "../../../types/Address";
import { Asset, getRealAmount, tokenSymbol } from "../../../types/Asset";
import { Delegation } from "../../../types/RawOperation";
import { tezToMutez } from "../../../utils/format";
import {
  useAccountIsMultisig,
  useGetOwnedAccount,
  useMultisigAccounts,
} from "../../../utils/hooks/accountHooks";
import { useBatchIsSimulating, useGetMultisigSigners } from "../../../utils/hooks/assetsHooks";
import { BakerSelector } from "../../../views/delegations/BakerSelector";
import { ConnectedAccountSelector } from "../../AccountSelector/AccountSelector";
import AccountSelectorDisplay from "../../AccountSelector/AccountSelectorDisplay";
import { AccountSmallTile } from "../../AccountSelector/AccountSmallTile";
import { AllAccountsAutocomplete } from "../../AddressAutocomplete";
import { SendNFTRecapTile } from "../components/SendNFTRecapTile";
import { classifyAsset, FormOperations, OperationValue, SendFormMode } from "../types";
import { BatchRecap } from "./BatchRecap";

export const DelegateForm = ({
  onSubmit,
  isLoading,
  undelegate = false,
  sender,
  recipient,
  disabled = false,
}: {
  isLoading: boolean;
  onSubmit: (a: { sender: string; baker?: string }) => void;
  undelegate?: boolean;
  sender: string;
  recipient?: string;
  disabled?: boolean;
}) => {
  const { formState, control, handleSubmit } = useForm<{
    sender: string;
    baker: string | undefined;
  }>({
    mode: "onBlur",
    defaultValues: { sender, baker: recipient },
  });
  const { isValid } = formState;

  const accountIsMultisig = useAccountIsMultisig();
  const senderIsMultisig = Boolean(sender && accountIsMultisig(sender));
  const subTitle = undelegate ? "Remove delegation" : "Delegate";
  return (
    <ModalContent bg="umami.gray.900">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalCloseButton />
        <ModalHeader textAlign="center">Delegation</ModalHeader>
        <Text textAlign="center">{subTitle}</Text>
        <ModalBody>
          <FormControl mb={2}>
            <FormLabel>From</FormLabel>
            <Controller
              rules={{ required: true }}
              control={control}
              name="sender"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <ConnectedAccountSelector
                  isDisabled={undelegate || disabled}
                  selected={value}
                  onSelect={a => {
                    onChange(a.address.pkh);
                  }}
                />
              )}
            />
          </FormControl>

          {undelegate ? null : (
            <FormControl mb={2}>
              <FormLabel>Baker</FormLabel>
              <Controller
                rules={{ required: true }}
                control={control}
                name="baker"
                render={({ field: { onChange, value } }) => (
                  <BakerSelector disabled={disabled} selected={value} onSelect={onChange} />
                )}
              />
            </FormControl>
          )}
        </ModalBody>
        <ModalFooter>
          <Box width="100%">
            <Button
              width="100%"
              isLoading={isLoading}
              type="submit"
              isDisabled={!isValid || isLoading || senderIsMultisig}
              variant="ghost"
              mb={2}
            >
              Preview
            </Button>
          </Box>
        </ModalFooter>
      </form>
    </ModalContent>
  );
};

const getAmountSymbol = (asset?: Asset) => {
  if (!asset) {
    return "tez";
  }
  if (asset.type === "nft") {
    return "editions";
  }

  return tokenSymbol(asset);
};

export const FillBatchForm: React.FC<{
  transfer: OperationValue[];
  onSubmit: () => void;
  isLoading?: boolean;
  signer: string;
}> = ({ transfer, onSubmit, isLoading = false, signer }) => {
  return (
    <ModalContent bg="umami.gray.900" data-testid="bar">
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <ModalCloseButton />
        <ModalHeader textAlign="center">Recap</ModalHeader>
        <Text textAlign="center">Transaction details</Text>
        <ModalBody mt={4}>
          <Box>
            <Flex mb={4}>
              <Heading size="md" width={20}>
                From:
              </Heading>
              <AccountSmallTile pkh={signer} />
            </Flex>
            <BatchRecap transfer={transfer} />
          </Box>
          <Divider mb={2} mt={2} />
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button type="submit" width="100%" isLoading={isLoading} variant="ghost" mb={2}>
            Preview
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
};

type FormValues = {
  sender: string;
  amount: string;
  recipient: string;
  proposalSigner?: string;
};

const useGetDefaultProposalSigner = () => {
  const getAccount = useGetOwnedAccount();
  const getSigners = useGetMultisigSigners();
  return (initalSenderPkh: string) => {
    const initialSenderAccount = (initalSenderPkh && getAccount(initalSenderPkh)) || undefined;

    if (initialSenderAccount && initialSenderAccount.type === AccountType.MULTISIG) {
      const signers = getSigners(initialSenderAccount);

      return signers.length === 0 ? undefined : signers[0].address.pkh;
    }
  };
};

export const SendTezOrNFTForm = ({
  token,
  sender,
  onSubmit,
  onSubmitBatch,
  isLoading,
  recipient,
  parameter,
  amount,
  disabled,
}: {
  onSubmit: (v: FormValues) => void;
  onSubmitBatch: (v: FormValues) => void;
  sender: string;
  token?: Asset;
  isLoading?: boolean;
  recipient?: string;
  disabled?: boolean;
  amount?: string;
  parameter?: TransferParams["parameter"];
}) => {
  const getBatchIsSimulating = useBatchIsSimulating();
  const multisigAccounts = useMultisigAccounts();
  const accountIsMultisig = useAccountIsMultisig();
  const getDefaultSigner = useGetDefaultProposalSigner();

  const initialProposalSigner = (sender && getDefaultSigner(sender)) || undefined;
  const isNFT = token?.type === "nft";
  const mandatoryNftSender = isNFT ? token?.owner : undefined;

  const {
    formState: { isValid, errors },
    control,
    register,
    getValues,
    handleSubmit,
    reset,
    setValue,
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      sender: mandatoryNftSender || sender,
      amount: isNFT ? "1" : amount,
      recipient,
      proposalSigner: initialProposalSigner,
    },
  });

  const senderFormValue = getValues().sender;

  const multisigSender =
    senderFormValue !== ""
      ? multisigAccounts.find(a => a.address.pkh === senderFormValue)
      : undefined;

  const batchIsSimulating = senderFormValue !== "" && getBatchIsSimulating(senderFormValue);

  const simulating = isLoading || batchIsSimulating;
  const senderIsMultisig = accountIsMultisig(getValues("sender"));

  return (
    <ModalContent bg="umami.gray.900">
      <form>
        <ModalCloseButton />
        <ModalHeader textAlign="center">Send</ModalHeader>
        <Text textAlign="center">Send one or insert into batch.</Text>
        <ModalBody>
          <FormControl mb={2}>
            <FormLabel>From</FormLabel>
            <Controller
              rules={{ required: true }}
              control={control}
              name="sender"
              render={({ field: { onChange, value } }) => (
                <ConnectedAccountSelector
                  isDisabled={isNFT || simulating || disabled}
                  selected={value}
                  onSelect={account => {
                    onChange(account.address.pkh);

                    // This is needed to update the signer if a multisig account is selected
                    const values = getValues();
                    if (account.type === AccountType.MULTISIG) {
                      const defaultSigner = getDefaultSigner(account.address.pkh);
                      reset({ ...values, proposalSigner: defaultSigner });
                    } else {
                      reset({ ...values, proposalSigner: undefined });
                    }
                  }}
                />
              )}
            />
          </FormControl>
          {multisigSender ? (
            <FormControl mb={2}>
              <FormLabel>Proposal Signer</FormLabel>
              <Controller
                rules={{ required: true }}
                control={control}
                name="proposalSigner"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <ProposalSigners
                    multisigAccount={multisigSender}
                    onSelect={onChange}
                    selected={value}
                  />
                )}
              />
            </FormControl>
          ) : null}
          <FormControl mb={2} isInvalid={!!errors.recipient}>
            <AllAccountsAutocomplete
              register={register}
              isDisabled={disabled}
              inputName="recipient"
              setValue={setValue}
              initialPkhValue={recipient}
              allowUnknown
            />
            {errors.recipient && <FormErrorMessage>{errors.recipient.message}</FormErrorMessage>}
          </FormControl>
          {isNFT ? <SendNFTRecapTile nft={token} /> : null}
          <FormControl mb={2} mt={2} isInvalid={!!errors.amount}>
            <FormLabel>Amount</FormLabel>
            <InputGroup>
              <Input
                isDisabled={simulating || disabled}
                step={isNFT ? 1 : "any"}
                type="number"
                {...register("amount", {
                  required: "Amount is required",
                })}
                placeholder="Enter amount..."
              />
              <InputRightAddon data-testid="currency" children={getAmountSymbol(token)} />
            </InputGroup>
            {errors.amount && <FormErrorMessage>{errors.amount.message}</FormErrorMessage>}
          </FormControl>
          {parameter && (
            <FormControl mb={2} mt={2}>
              <FormLabel>Parameter</FormLabel>
              <Textarea isDisabled={true} value={JSON.stringify(parameter, null, 4)}></Textarea>
            </FormControl>
          )}
        </ModalBody>
        <ModalFooter>
          <Box width="100%">
            <Button
              onClick={handleSubmit(onSubmit)}
              width="100%"
              isLoading={isLoading}
              type="submit"
              isDisabled={!isValid || simulating}
              variant="ghost"
              mb={2}
            >
              Preview
            </Button>
            <Button
              onClick={handleSubmit(onSubmitBatch)}
              width="100%"
              isLoading={batchIsSimulating}
              type="submit"
              isDisabled={!isValid || simulating || senderIsMultisig}
              variant="ghost"
              mb={2}
            >
              Insert Into Batch
            </Button>
          </Box>
        </ModalFooter>
      </form>
    </ModalContent>
  );
};

const buildTezFromFormValues = (
  v: FormValues,
  parameter?: TransferParams["parameter"]
): FormOperations => {
  const value: OperationValue[] = [
    {
      type: "tez",
      amount: tezToMutez(v.amount).toString(),
      recipient: parsePkh(v.recipient),
      parameter,
    },
  ];
  if (v.proposalSigner !== undefined) {
    return {
      type: "proposal",
      signer: parseImplicitPkh(v.proposalSigner),
      content: value,
      sender: parseContractPkh(v.sender),
    };
  }
  return { type: "implicit", content: value, signer: parseImplicitPkh(v.sender) };
};

const buildTokenFromFormValues = (v: FormValues, asset: Asset): FormOperations => {
  const token = [
    classifyAsset(asset, {
      amount: getRealAmount(asset, v.amount).toString(),
      sender: v.sender,
      recipient: v.recipient,
    }),
  ];

  if (v.proposalSigner !== undefined) {
    return {
      type: "proposal",
      signer: parseImplicitPkh(v.proposalSigner),
      content: token,
      sender: parseContractPkh(v.sender),
    };
  }

  return { type: "implicit", content: token, signer: parseImplicitPkh(v.sender) };
};

export const FillStep: React.FC<{
  onSubmit: (v: FormOperations) => void;
  onSubmitBatch: (v: OperationValue, signer: string) => void;
  isLoading: boolean;
  sender: string;
  recipient?: string;
  amount?: string;
  disabled?: boolean;
  parameter?: TransferParams["parameter"];
  mode: SendFormMode;
}> = ({
  onSubmit,
  isLoading,
  sender,
  recipient,
  amount,
  parameter,
  mode,
  onSubmitBatch,
  disabled,
}) => {
  switch (mode.type) {
    case "delegation":
      return (
        <DelegateForm
          disabled={disabled}
          sender={sender}
          recipient={recipient}
          undelegate={mode.data?.undelegate}
          isLoading={isLoading}
          onSubmit={v => {
            const delegation: Delegation = {
              type: "delegation",
              recipient: v.baker !== undefined ? parseImplicitPkh(v.baker) : undefined,
            };

            onSubmit({
              type: "implicit",
              content: [delegation],
              signer: parseImplicitPkh(v.sender),
            });
          }}
        />
      );
    case "tez":
      return (
        <SendTezOrNFTForm
          sender={sender}
          isLoading={isLoading}
          recipient={recipient}
          amount={amount}
          parameter={parameter}
          disabled={disabled}
          onSubmitBatch={v => {
            onSubmitBatch(
              {
                type: "tez",
                amount: tezToMutez(v.amount).toString(),
                recipient: parsePkh(v.recipient),
                parameter,
              },
              v.sender
            );
          }}
          onSubmit={v => {
            onSubmit(buildTezFromFormValues(v, parameter));
          }}
        />
      );

    case "token": {
      return (
        <SendTezOrNFTForm
          sender={sender}
          isLoading={isLoading}
          recipient={recipient}
          parameter={parameter}
          onSubmitBatch={v => {
            onSubmitBatch(
              classifyAsset(mode.data, {
                amount: getRealAmount(mode.data, v.amount).toString(),
                sender: v.sender,
                recipient: v.recipient,
              }),
              v.sender
            );
          }}
          onSubmit={v => {
            onSubmit(buildTokenFromFormValues(v, mode.data));
          }}
          token={mode.data}
        />
      );
    }

    case "batch": {
      return (
        <FillBatchForm
          isLoading={isLoading}
          transfer={mode.data.batch}
          signer={mode.data.signer}
          onSubmit={() => {
            onSubmit({
              type: "implicit",
              content: mode.data.batch,
              signer: parseImplicitPkh(mode.data.signer),
            });
          }}
        />
      );
    }
  }
};

const ProposalSigners = ({
  multisigAccount,
  selected,
  onSelect,
}: {
  multisigAccount: MultisigAccount;
  selected?: string;
  onSelect: (pkh: string) => void;
}) => {
  const getSigners = useGetMultisigSigners();
  const signers = getSigners(multisigAccount);

  return (
    <AccountSelectorDisplay
      isDisabled={signers.length === 1}
      selected={selected}
      accounts={signers}
      onSelect={a => onSelect(a.address.pkh)}
      dataTestid="proposal-signer-selector"
    />
  );
};
