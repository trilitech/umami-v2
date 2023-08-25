import { Button, Center, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";

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
    <ModalContentWrapper icon={SupportedIcons.diamont} title={title} subtitle={subtitle}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Center>
          <VStack width={300}>
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

            <Button w="100%" size="lg" type="submit">
              Continue
            </Button>
          </VStack>
        </Center>
      </form>
    </ModalContentWrapper>
  );
};

export default NameAccountDisplay;
