import { ContractCall, Delegation, TezTransfer, Undelegation } from "../../../types/Operation";
import BigNumber from "bignumber.js";
import { useSignPageHelpers } from "../utils";
import { AccountOperations, ImplicitOperations } from "../../sendForm/types";
import { FormProvider } from "react-hook-form";
import {
  Box,
  Flex,
  FormLabel,
  ModalBody,
  ModalContent,
  ModalFooter,
  useToast,
} from "@chakra-ui/react";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { TezTile } from "../../AssetTiles/TezTile";
import SignPageFee from "../SignPageFee";
import AddressTile from "../../AddressTile/AddressTile";
import SignButton from "../../sendForm/components/SignButton";
import { useEffect, useState } from "react";
import { estimate } from "../../../utils/tezos";
import { useSelectedNetwork } from "../../../utils/hooks/networkHooks";
import { TezosToolkit } from "@taquito/taquito";
import JsValueWrap from "../../AccountDrawer/JsValueWrap";
import { BakerSmallTile } from "../BakerSmallTile";

const BeaconSignPage: React.FC<{
  operation: ImplicitOperations;
  onBeaconSuccess: (hash: string) => Promise<void>;
}> = ({ operation, onBeaconSuccess }) => {
  const network = useSelectedNetwork();
  const toast = useToast();
  const [initialFee, setInitialFee] = useState<BigNumber | null>(null);
  const type = operation.operations[0].type;

  useEffect(() => {
    const estimateInitialFee = async () => {
      try {
        const fee = await estimate(operation, network);
        setInitialFee(fee);
      } catch (err: any) {
        toast({
          title: "Error",
          description: `Error while processing beacon request: ${err.message}`,
          status: "error",
        });
      }
    };
    estimateInitialFee();
  }, [initialFee, network, operation, toast]);

  if (!initialFee) {
    return null;
  }

  switch (type) {
    case "tez": {
      return (
        <BeaconTezSignPage
          fee={initialFee}
          operation={operation}
          onBeaconSuccess={onBeaconSuccess}
        />
      );
    }
    case "contract_call": {
      return (
        <BeaconContractCallSignPage
          fee={initialFee}
          operation={operation}
          onBeaconSuccess={onBeaconSuccess}
        />
      );
    }
    case "delegation": {
      return (
        <DelegationSignPage
          fee={initialFee}
          operation={operation}
          onBeaconSuccess={onBeaconSuccess}
        />
      );
    }
    case "undelegation": {
      return (
        <UndelegationSignPage
          fee={initialFee}
          operation={operation}
          onBeaconSuccess={onBeaconSuccess}
        />
      );
    }
    case "fa1.2":
    case "fa2":
    case "contract_origination":
      // this line will not reach, but better safe than sorry
      throw new Error("Unsupported operation type");
  }
};

export default BeaconSignPage;

type Props = {
  operation: AccountOperations; // Beacon currently only supports single operations
  fee: BigNumber;
  onBeaconSuccess: (hash: string) => Promise<void>;
};

const BeaconTezSignPage: React.FC<Props> = ({ operation, fee, onBeaconSuccess }) => {
  const { isLoading, signer, form, onSignWithTxHash } = useSignPageHelpers(
    fee,
    operation,
    "single"
  );

  const onSubmit = async (toolkit: TezosToolkit) => {
    const hash = await onSignWithTxHash(toolkit);
    console.log(hash, "HASGH");
    onBeaconSuccess(hash as string); // Sucks but we will rebuild beacon anyway
  };
  const { amount: mutezAmount, recipient } = operation.operations[0] as TezTransfer;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader mode="single" operationsType={operation.type} />
          <ModalBody>
            <TezTile mutezAmount={mutezAmount} />

            <Flex mt="12px" alignItems="center" justifyContent="end">
              <SignPageFee fee={fee} />
            </Flex>

            <FormLabel mt="24px">From </FormLabel>
            <AddressTile address={operation.sender.address} />

            <FormLabel mt="24px">To </FormLabel>
            <AddressTile address={recipient} />
          </ModalBody>
          <ModalFooter>
            <SignButton
              isLoading={isLoading}
              signer={signer}
              onSubmit={onSubmit}
              text={headerText(operation.type, "single")}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};

const BeaconContractCallSignPage: React.FC<Props> = ({ operation, fee, onBeaconSuccess }) => {
  const { isLoading, signer, form, onSignWithTxHash } = useSignPageHelpers(
    fee,
    operation,
    "single"
  );

  const onSubmit = async (toolkit: TezosToolkit) => {
    const hash = await onSignWithTxHash(toolkit);
    onBeaconSuccess(hash as string); // Sucks but we will rebuild beacon anyway
  };
  const {
    amount: mutezAmount,
    contract,
    entrypoint,
    args,
  } = operation.operations[0] as ContractCall;
  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader mode="single" operationsType={operation.type} />
          <ModalBody>
            <TezTile mutezAmount={mutezAmount} />

            <Flex mt="12px" alignItems="center" justifyContent="end">
              <SignPageFee fee={fee} />
            </Flex>

            <FormLabel mt="24px">From </FormLabel>
            <AddressTile address={operation.sender.address} />

            <FormLabel mt="24px">To </FormLabel>
            <AddressTile address={contract} />

            <FormLabel mt="24px">Parameter</FormLabel>
            <Box h="200px" overflow="scroll">
              <JsValueWrap value={{ entrypoint, values: args }} />
            </Box>
          </ModalBody>
          <ModalFooter>
            <SignButton
              isLoading={isLoading}
              signer={signer}
              onSubmit={onSubmit}
              text={headerText(operation.type, "single")}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};

const DelegationSignPage: React.FC<Props> = ({ operation, fee, onBeaconSuccess }) => {
  const { isLoading, signer, form, onSignWithTxHash } = useSignPageHelpers(
    fee,
    operation,
    "single"
  );

  const onSubmit = async (toolkit: TezosToolkit) => {
    const hash = await onSignWithTxHash(toolkit);
    onBeaconSuccess(hash as string); // Sucks but we will rebuild beacon anyway
  };
  const { recipient } = operation.operations[0] as Delegation;
  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader mode="single" operationsType={operation.type} />
          <ModalBody>
            <FormLabel>From</FormLabel>
            <AddressTile address={signer.address} />

            <Flex mt="12px" mb="24px" px="4px" alignItems="center" justifyContent="end">
              <Flex alignItems="center">
                <SignPageFee fee={fee} />
              </Flex>
            </Flex>

            <FormLabel>To</FormLabel>
            <BakerSmallTile pkh={recipient.pkh} />
          </ModalBody>
          <ModalFooter>
            <SignButton
              isLoading={isLoading}
              signer={signer}
              onSubmit={onSubmit}
              text={headerText(operation.type, "single")}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
const UndelegationSignPage: React.FC<Props> = ({ operation, fee, onBeaconSuccess }) => {
  const { isLoading, signer, form, onSignWithTxHash } = useSignPageHelpers(
    fee,
    operation,
    "single"
  );

  const onSubmit = async (toolkit: TezosToolkit) => {
    const hash = await onSignWithTxHash(toolkit);
    onBeaconSuccess(hash as string); // Sucks but we will rebuild beacon anyway
  };

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader mode="single" operationsType={operation.type} />
          <ModalBody>
            <FormLabel>From</FormLabel>
            <AddressTile address={signer.address} />

            <Flex mt="12px" alignItems="center" justifyContent="end" px="4px">
              <SignPageFee fee={fee} />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <SignButton
              isLoading={isLoading}
              signer={signer}
              onSubmit={onSubmit}
              text={headerText(operation.type, "single")}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
