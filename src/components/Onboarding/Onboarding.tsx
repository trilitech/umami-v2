// import React, { useState } from "react";
// import Eula from "./eula/Eula";
// import ConnectOrCreate from "./connectOrCreate/ConnectOrCreate";
// import ConnectOptions from "./connectOptions/ConnectOptions";
// import VerifySeedphrase from "./verifySeedphrase/VerifySeedphrase";
// import { useAccounts } from "../../utils/hooks/accountHooks";
// import Notice from "./notice/Notice";
// import RestoreSeedphrase from "./restoreSeedphrase/RestoreSeedphrase";
// import { GenerateSeedphrase } from "./generateSeedphrase/GenerateSeedphrase";
// import NameAccount from "./nameAccount/NameAccount";
// import AdvancedOptions from "./advancedOptions/AdvancedOptions";
// import MasterPassword from "./masterPassword/MasterPassword";
// import RestoreLedger from "./restoreLedger/RestoreLedger";

// export type TemporaryAccountConfig = {
//   label?: string
//   seedphrase: string
//   derivationPath?: string
//   derivationType?: string
// }

// export type Step =
//   | { type: "eula" }
//   | { type: "connectOrCreate" }
//   | { type: "connectOptions" }
//   | { type: "notice" }
//   | { type: "restoreSeedphrase" }
//   | { type: "restoreLedger" }
//   | { type: "generateSeedphrase" }
//   | { type: "verifySeedphrase", config: TemporaryAccountConfig }
//   | { type: "nameAccount", config: TemporaryAccountConfig }
//   | { type: "advancedOptions", config: TemporaryAccountConfig }
//   | { type: "masterPassword", config: TemporaryAccountConfig }

// const Onboarding: React.FC<{
//   onClose: () => void,
//   setWidth?: any
// }> = ({
//   onClose,
//   setWidth
// }) => {
//     const [step, setStep] = useState<Step | null>(null);
//     const hasAccounts = useAccounts().length !== 0;


//     if (!step) {
//       if (hasAccounts) {
//         return <ConnectOrCreate setStep={setStep} />;
//       } else {
//         return <Eula setStep={setStep} />;
//       }
//     }
//     switch (step.type) {
//       case "connectOrCreate":
//         return <ConnectOrCreate setStep={setStep} />;
//       case "connectOptions":
//         return <ConnectOptions setStep={setStep} />
//       case "notice":
//         return <Notice setStep={setStep} setWidth={setWidth} />
//       case "restoreSeedphrase":
//         return <RestoreSeedphrase setStep={setStep} />
//       case "restoreLedger":
//         return <RestoreLedger setStep={setStep} />
//       case "generateSeedphrase":
//         return <GenerateSeedphrase setStep={setStep} />
//       case "verifySeedphrase":
//         return <VerifySeedphrase setStep={setStep} config={step.config} />
//       case "nameAccount":
//         return <NameAccount setStep={setStep} config={step.config} />
//       case "advancedOptions":
//         return <AdvancedOptions setStep={setStep} config={step.config} />
//       case "masterPassword":
//         return <MasterPassword setStep={setStep} config={step.config} onClose={onClose} />
//       default:
//         throw new Error("Unmatched case")
//     }
//   };

// export default Onboarding;
export {}
