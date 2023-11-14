/* istanbul ignore file */
import { Button, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { RpcClient } from "@taquito/rpc";
import ModalContentWrapper from "./ModalContentWrapper";
import { useRestoreLedger } from "../../utils/hooks/accountHooks";
import { defaultDerivationPathPattern } from "../../utils/account/derivationPathUtils";
import { MAINNET } from "../../types/Network";
import WalletPlusIcon from "../../assets/icons/WalletPlus";

export const FakeAccount = ({ onClose }: { onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ pkh: string; name: string }>({ mode: "onBlur" });
  const restoreLedger = useRestoreLedger();

  const onSubmit = async ({ pkh, name }: { pkh: string; name: string }) => {
    const rpc = new RpcClient(MAINNET.rpcUrl);
    const managerKey = await rpc.getManagerKey(pkh);
    const pk = typeof managerKey === "string" ? managerKey : managerKey.key;
    restoreLedger(defaultDerivationPathPattern, pk, pkh, name);
    onClose();
  };
  return (
    <ModalContentWrapper icon={<WalletPlusIcon />} title="Add a Fake Account">
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Text>It will be restored as a ledger account</Text>
        <FormControl isInvalid={!!errors.pkh}>
          <FormLabel>Address</FormLabel>
          <Input
            {...register("pkh", { required: true })}
            placeholder="Please enter the account address"
            autoComplete="off"
          />
        </FormControl>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Name</FormLabel>
          <Input
            {...register("name", { required: true })}
            placeholder="Please enter the account name"
            autoComplete="off"
          />
        </FormControl>
        <Button w="100%" size="lg" type="submit" mt={2}>
          Add account
        </Button>
      </form>
    </ModalContentWrapper>
  );
};
