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
import { useForm } from "react-hook-form";
import { AccountType } from "../../../types/Account";
import { parseContractPkh, parseImplicitPkh, parsePkh } from "../../../types/Address";
import { getRealAmount, tokenSymbol } from "../../../types/TokenBalance";
import { Delegation, RawOperation } from "../../../types/RawOperation";
import { tezToMutez } from "../../../utils/format";
import {
  useAccountIsMultisig,
  useGetOwnedAccount,
  useMultisigAccounts,
} from "../../../utils/hooks/accountHooks";
import { useBatchIsSimulating, useGetMultisigSigners } from "../../../utils/hooks/assetsHooks";
import { AccountSmallTile } from "../../AccountSelector/AccountSmallTile";
import {
  OwnedAccountsAutocomplete,
  BakersAutocomplete,
  KnownAccountsAutocomplete,
  AddressAutocomplete,
} from "../../AddressAutocomplete";
import { SendNFTRecapTile } from "../components/SendNFTRecapTile";
import { toOperation, FormOperations, SendFormMode } from "../types";
import { BatchRecap } from "./BatchRecap";
import { Token } from "../../../types/Token";

export const DelegateForm = ({
  onSubmit,
  isLoading,
  undelegate = false,
  sender,
  recipient,
}: {
  isLoading: boolean;
  onSubmit: (a: { sender: string; baker?: string }) => void;
  undelegate?: boolean;
  sender: string;
  recipient?: string;
}) => {
  const { formState, handleSubmit, setValue, register } = useForm<{
    sender: string;
    baker: string | undefined;
  }>({
    mode: "onBlur",
    defaultValues: { sender, baker: recipient },
  });
  const { isValid, errors } = formState;

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
            <OwnedAccountsAutocomplete
              label="From"
              register={register}
              setValue={setValue}
              inputName="sender"
              initialPkhValue={sender}
              allowUnknown={false}
            />
          </FormControl>

          {undelegate ? null : (
            <FormControl mb={2} isInvalid={!!errors.baker}>
              <BakersAutocomplete
                label="Baker"
                inputName="baker"
                allowUnknown={true} // set to false when beacon stops using SendForm
                setValue={setValue}
                initialPkhValue={recipient}
                register={register}
              />
              {errors.baker && <FormErrorMessage>{errors.baker.message}</FormErrorMessage>}
            </FormControl>
          )}
        </ModalBody>
        <ModalFooter>
          {isValid}
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

const getAmountSymbol = (asset?: Token) => {
  if (!asset) {
    return "tez";
  }
  if (asset.type === "nft") {
    return "editions";
  }

  return tokenSymbol(asset);
};

export const FillBatchForm: React.FC<{
  transfer: RawOperation[];
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
}: {
  onSubmit: (v: FormValues) => void;
  onSubmitBatch: (v: FormValues) => void;
  sender: string;
  token?: Token;
  isLoading?: boolean;
  recipient?: string;
  amount?: string;
  parameter?: TransferParams["parameter"];
}) => {
  const getBatchIsSimulating = useBatchIsSimulating();
  const multisigAccounts = useMultisigAccounts();
  const accountIsMultisig = useAccountIsMultisig();
  const getDefaultSigner = useGetDefaultProposalSigner();

  const initialProposalSigner = (sender && getDefaultSigner(sender)) || undefined;
  const isNFT = token?.type === "nft";

  const {
    formState: { isValid, errors },
    register,
    getValues,
    handleSubmit,
    setValue,
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      sender: sender,
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

  const getMultisigSigners = useGetMultisigSigners();

  const signerSelectorField = () => {
    if (!multisigSender) {
      return null;
    }
    const signers = getMultisigSigners(multisigSender).map(acc => ({
      name: acc.label,
      pkh: acc.address.pkh,
    }));
    if (signers.length < 2) {
      return null;
    }
    return (
      <FormControl mb={2} isInvalid={!!errors.proposalSigner}>
        <AddressAutocomplete
          label="Proposal Signer"
          inputName="proposalSigner"
          contacts={signers}
          initialPkhValue={signers[0].pkh}
          register={register}
          setValue={setValue}
          allowUnknown={false}
        />
        {errors.proposalSigner && (
          <FormErrorMessage>{errors.proposalSigner.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  };

  return (
    <ModalContent bg="umami.gray.900">
      <form>
        <ModalCloseButton />
        <ModalHeader textAlign="center">Send</ModalHeader>
        <Text textAlign="center">Send one or insert into batch.</Text>
        <ModalBody>
          <FormControl mb={2} isInvalid={!!errors.sender}>
            <OwnedAccountsAutocomplete
              label="From"
              register={register}
              setValue={setValue}
              inputName="sender"
              isDisabled={isNFT || simulating}
              allowUnknown={false}
              initialPkhValue={sender}
            />
            {errors.sender && <FormErrorMessage>{errors.sender.message}</FormErrorMessage>}
          </FormControl>
          {signerSelectorField()}
          <FormControl mb={2} isInvalid={!!errors.recipient}>
            <KnownAccountsAutocomplete
              label="To"
              register={register}
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
                isDisabled={simulating}
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
  const value: RawOperation[] = [
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

const buildTokenFromFormValues = (v: FormValues, asset: Token): FormOperations => {
  const token = [
    toOperation(asset, {
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
  onSubmitBatch: (v: RawOperation, signer: string) => void;
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
              toOperation(mode.data, {
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
