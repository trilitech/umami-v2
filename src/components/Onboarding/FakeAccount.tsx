/* istanbul ignore file */
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { RpcClient } from "@taquito/rpc";
import { useForm } from "react-hook-form";

import { ModalContentWrapper } from "./ModalContentWrapper";
import { WalletPlusIcon } from "../../assets/icons";
import type { IDP } from "../../auth";
import { GHOSTNET } from "../../types/Network";
import {
  defaultDerivationPathTemplate,
  makeDerivationPath,
} from "../../utils/account/derivationPathUtils";
import { useRestoreLedger, useRestoreSocial } from "../../utils/hooks/setAccountDataHooks";

export const FakeAccount = ({ onClose }: { onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ pkh: string; name: string; idp?: string }>({ mode: "onBlur" });
  const restoreLedger = useRestoreLedger();
  const restoreSocial = useRestoreSocial();

  const onSubmit = async ({ pkh, name, idp }: { pkh: string; name: string; idp?: IDP }) => {
    if (idp && idp.length > 0) {
      if (!["google", "facebook", "twitter", "reddit", "email"].includes(idp)) {
        throw new Error("Invalid IDP");
      }
    }
    const rpc = new RpcClient(GHOSTNET.rpcUrl);
    const managerKey = await rpc.getManagerKey(pkh);
    const pk = typeof managerKey === "string" ? managerKey : managerKey.key;

    if (idp) {
      restoreSocial(pk, pkh, name, idp);
    } else {
      restoreLedger(
        defaultDerivationPathTemplate,
        makeDerivationPath(defaultDerivationPathTemplate, 0),
        pk,
        pkh,
        name
      );
    }
    onClose();
  };
  return (
    <ModalContentWrapper icon={<WalletPlusIcon />} title="Add a Fake Account">
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <FormControl isInvalid={!!errors.pkh}>
          <FormLabel>Address</FormLabel>
          <Input
            {...register("pkh", { required: true })}
            autoComplete="off"
            placeholder="Please enter the account address"
          />
        </FormControl>
        <FormControl marginTop="12px" isInvalid={!!errors.name}>
          <FormLabel>Name</FormLabel>
          <Input
            {...register("name", { required: true })}
            autoComplete="off"
            placeholder="Please enter the account name"
          />
        </FormControl>
        <FormControl marginTop="12px" isInvalid={!!errors.idp}>
          <FormLabel>IDP (For a social account)</FormLabel>
          <Input {...register("idp")} autoComplete="off" placeholder="Please enter the IDP" />
        </FormControl>
        <Button width="100%" marginTop="12px" size="lg" type="submit">
          Add account
        </Button>
      </form>
    </ModalContentWrapper>
  );
};
