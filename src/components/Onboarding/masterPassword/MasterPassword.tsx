import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import {
    useCheckPasswordValidity,
    useRestore,
} from "../../../utils/hooks/accountHooks";
import { Step, TemporaryAccountConfig } from "../useOnboardingModal";
import { EnterAndComfirmPassword } from "./password/EnterAndConfirmPassword";
import EnterPassword from "./password/EnterPassword";

export const MasterPassword = ({
    setStep,
    config,
    onClose
}: {
    setStep: (step: Step) => void;
    config: TemporaryAccountConfig
    onClose: () => void
}) => {
    const restore = useRestore();
    const checkPassword = useCheckPasswordValidity();
    const passwordHasBeenSet = checkPassword !== null;

    const [isLoading, setIsloading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (password: string) => {
        setIsloading(true);
        try {
            if (passwordHasBeenSet) {
                await checkPassword(password);
            }
            await restore(config.seedphrase, password, config.label);
            toast({ title: "success" });
            onClose();
        } catch (error: any) {
            toast({ title: "error", description: error.message });
        }
        setIsloading(false);
    };

    if (passwordHasBeenSet) {
        return (
            <EnterPassword
                isLoading={isLoading}
                onSubmit={handleSubmit}

            />
        )
    }
    return (
        <EnterAndComfirmPassword
            isLoading={isLoading}
            onSubmit={handleSubmit}
        />
    )

};

export default MasterPassword;
