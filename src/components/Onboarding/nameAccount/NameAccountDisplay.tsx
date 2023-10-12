import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import ModalContentWrapper from "../ModalContentWrapper";
import EditAccountIcon from "../../../assets/icons/EditAccount";

const DEFAULT_TITLE = "Name Your Account";

const NameAccountDisplay = ({
  onSubmit,
  title = DEFAULT_TITLE,
  subtitle,
}: {
  onSubmit: (p: { accountName: string }) => void;
  title?: string;
  subtitle?: string;
}) => {
  const { register, handleSubmit } = useForm<{
    accountName: string;
  }>({ mode: "onChange" });
  return (
    <ModalContentWrapper icon={<EditAccountIcon />} title={title} subtitle={subtitle}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <FormControl>
          <FormLabel>Account name</FormLabel>
          <Input
            data-testid="name"
            type="text"
            {...register("accountName", {
              required: false,
            })}
            placeholder="Optional"
          />
        </FormControl>

        <Button mt="12px" w="100%" size="lg" type="submit">
          Continue
        </Button>
      </form>
    </ModalContentWrapper>
  );
};

export default NameAccountDisplay;
