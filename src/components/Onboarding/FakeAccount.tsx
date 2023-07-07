import { Button, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { RpcClient } from "@taquito/rpc";
import { nodeUrls } from "../../utils/tezos/consts";
import { ledgerPattern } from "../../utils/account/derivationPathUtils";
import { SupportedIcons } from "../CircleIcon";
import ModalContentWrapper from "./ModalContentWrapper";
import { useRestoreLedger } from "../../utils/hooks/accountHooks";

export const FakeAccount = ({ onClose }: { onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ pkh: string; name: string }>({ mode: "onBlur" });
  const restoreLedger = useRestoreLedger();

  const onSubmit = async ({ pkh, name }: { pkh: string; name: string }) => {
    const rpc = new RpcClient(nodeUrls["mainnet"]);
    const managerKey = await rpc.getManagerKey(pkh);
    const pk = typeof managerKey === "string" ? managerKey : managerKey.key;
    restoreLedger(ledgerPattern, pk, pkh, name);
    onClose();
  };
  return (
    <ModalContentWrapper icon={SupportedIcons.wallet} title="Add a Fake Account">
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <Button bg="umami.blue" w="100%" size="lg" minH="48px" type="submit" mt={2}>
          Add account
        </Button>
      </form>
    </ModalContentWrapper>
  );
};
