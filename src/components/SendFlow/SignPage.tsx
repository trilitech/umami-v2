import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Flex,
  FormControl,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { TezosToolkit } from "@taquito/taquito";
import { useContext, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import colors from "../../style/colors";
import { RawPkh } from "../../types/Address";
import { TezOperation } from "../../types/Operation";
import { useGetImplicitAccount } from "../../utils/hooks/accountHooks";
import { useClearBatch, useSelectedNetwork, useTezToDollar } from "../../utils/hooks/assetsHooks";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { estimate, sumTez } from "../../utils/tezos";
import { AvailableSignersAutocomplete, OwnedAccountsAutocomplete } from "../AddressAutocomplete";
import SignButton from "../sendForm/components/SignButton";
import { FormOperations } from "../sendForm/types";
import { makeTransfer } from "../sendForm/util/execution";
import { BigNumber } from "bignumber.js";
import { mutezToTez } from "../../utils/format";
import { DynamicModalContext } from "../DynamicModal";
import { SuccessStep } from "../sendForm/steps/SuccessStep";
import { TEZ } from "../../utils/tezos";

export type Mode = "single" | "batch";

export const header = (operationType: FormOperations["type"], mode: Mode): string => {
  let action;
  switch (operationType) {
    case "implicit":
      action = "Confirm";
      break;
    case "proposal":
      action = "Propose";
  }
  switch (mode) {
    case "single":
      return `${action} Transaction`;
    case "batch":
      return `${action} Batch`;
  }
};

export const getTezAmount = (operations: FormOperations): BigNumber | undefined => {
  switch (operations.type) {
    // for proposal operations the signer pays only the operation fee
    // tez will be sent by the multisig contract on execute call
    case "proposal":
      return;
    case "implicit": {
      const amounts = operations.content
        .filter((op): op is TezOperation => op.type === "tez")
        .map(op => op.amount);
      return sumTez(amounts);
    }
  }
};

export const mutezToPrettyTez = (amount: BigNumber): string => {
  // make sure we always show 6 digits after the decimal point
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6,
  });
  return `${formatter.format(amount.dividedBy(10 ** 6).toNumber())} ${TEZ}`;
};
// TODO: convert to a contract origination sign page (and remove unused code)
const SignPage: React.FC<{
  goBack?: () => void;
  operations: FormOperations;
  fee: BigNumber;
  mode: Mode;
}> = ({ goBack, mode, operations: initialOperations, fee: initialFee }) => {
  const getSigner = useGetImplicitAccount();
  const clearBatch = useClearBatch();
  const network = useSelectedNetwork();
  const [fee, setFee] = useState<BigNumber>(initialFee);
  const [operations, setOperations] = useState<FormOperations>(initialOperations);
  const [estimationFailed, setEstimationFailed] = useState(false);
  const { isLoading, handleAsyncAction, handleAsyncActionUnsafe } = useAsyncActionHandler();
  const convertTezToDallars = useTezToDollar();
  const { openWith } = useContext(DynamicModalContext);

  const form = useForm<{ sender: string; signer: string }>({
    mode: "onBlur",
    defaultValues: { signer: operations.signer.address.pkh, sender: operations.sender.address.pkh },
  });

  const signerWatch = form.watch("signer");

  const tezAmount = getTezAmount(operations);
  const totalCost = fee.plus(tezAmount ?? 0);
  const totalCostInUSD = convertTezToDallars(mutezToTez(totalCost));

  const onSign = async (tezosToolkit: TezosToolkit) =>
    handleAsyncAction(async () => {
      const { hash } = await makeTransfer(operations, tezosToolkit);
      if (mode === "batch") {
        clearBatch(operations.sender);
      }
      openWith(<SuccessStep hash={hash} />);
    });

  // if it fails then the sign button must be disabled
  // and the user is supposed to either come back to the form and amend it
  // or choose another signer
  const reEstimate = async (newSigner: RawPkh) =>
    handleAsyncActionUnsafe(
      async () => {
        const operationsWithNewSigner = {
          ...operations,
          signer: getSigner(newSigner),
        };
        setFee(await estimate(operations, network));
        setOperations(operationsWithNewSigner);
        setEstimationFailed(false);
      },
      {
        isClosable: true,
        duration: null, // it makes the toast stick until the user closes it
      }
    ).catch(() => setEstimationFailed(true));

  return (
    <FormProvider {...form}>
      <ModalContent bg={colors.gray[900]} borderColor={colors.gray[700]} borderRadius="8px">
        <form>
          <ModalHeader textAlign="center" p="40px 0 32px 0">
            {goBack && (
              <IconButton
                size="lg"
                top="4px"
                left="4px"
                position="absolute"
                variant="ghost"
                aria-label="Back"
                color="umami.gray.450"
                icon={<ArrowBackIcon />}
                onClick={goBack}
              />
            )}
            <Text size="2xl" fontWeight="600">
              {header(operations.type, mode)}
            </Text>
            <Text textAlign="center" size="sm" color={colors.gray[400]}>
              Confirm the transaction by signing it with your private key.
            </Text>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <FormControl mb="24px">
              {/* TODO: Until we separate the AccountTile from the AddressAutocomplete we use a disabled input */}
              <OwnedAccountsAutocomplete
                inputName="sender"
                label="From"
                allowUnknown={false}
                isDisabled
              />
            </FormControl>

            {tezAmount && (
              <Flex justifyContent="space-between">
                <Text size="sm" color={colors.gray[450]} fontWeight="600">
                  Tez Amount:
                </Text>
                <Text size="sm" color={colors.gray[400]}>
                  {mutezToPrettyTez(tezAmount)}
                </Text>
              </Flex>
            )}

            <Flex justifyContent="space-between" mb={3}>
              <Text size="sm" color={colors.gray[450]} fontWeight="600">
                Fee:
              </Text>
              <Text size="sm" color={colors.gray[400]}>
                {mutezToPrettyTez(fee)}
              </Text>
            </Flex>

            <Divider />

            <Flex justifyContent="space-between" mb={3}>
              <Text color={colors.gray[400]} fontWeight="600">
                Total:
              </Text>
              <Box>
                <Text color="white" fontWeight="600">
                  {mutezToPrettyTez(totalCost)}
                </Text>
                {totalCostInUSD && (
                  <Box textAlign="right">
                    <Text color={colors.gray[450]} fontWeight="600" display="inline">
                      USD:
                    </Text>
                    <Text color={colors.gray[400]} display="inline">
                      {` ${totalCostInUSD.toFixed(2)}$`}
                    </Text>
                  </Box>
                )}
              </Box>
            </Flex>

            {initialOperations.type === "proposal" && (
              <FormControl>
                <AvailableSignersAutocomplete
                  account={initialOperations.sender}
                  inputName="signer"
                  label="Select Proposer"
                  isDisabled={isLoading}
                  onUpdate={reEstimate}
                  keepValid
                />
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <SignButton
              isLoading={isLoading}
              isDisabled={estimationFailed}
              signer={getSigner(signerWatch)}
              onSubmit={onSign}
              text={header(operations.type, mode)}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
export default SignPage;
