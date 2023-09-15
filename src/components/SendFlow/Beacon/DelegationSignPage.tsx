// import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
// import { Delegation } from "../../../types/Operation";
// import useSignWithBeacon from "./useSignWithBeacon";
// import { SignPageHeader, headerText } from "../SignPageHeader";
// import SignPageFee from "../SignPageFee";
// import AddressTile from "../../AddressTile/AddressTile";
// import SignButton from "../../sendForm/components/SignButton";
// import { FormProvider } from "react-hook-form";
// import { BeaconSignPageProps } from "./BeaconSignPage";
// import { BakerSmallTile } from "../BakerSmallTile";

// const DelegationSignPage: React.FC<BeaconSignPageProps> = ({ operation, onBeaconSuccess }) => {
//   const { recipient } = operation.operations[0] as Delegation;

//   const { isSigning, form, onSign, fee } = useSignWithBeacon(operation, onBeaconSuccess);

//   if (!fee) {
//     return null;
//   }

//   return (
//     <FormProvider {...form}>
//       <ModalContent>
//         <form>
//           <SignPageHeader mode="single" operationsType={operation.type} />
//           <ModalBody>
//             <FormLabel>From</FormLabel>
//             <AddressTile address={operation.signer.address} />

//             <Flex mt="12px" mb="24px" px="4px" alignItems="center" justifyContent="end">
//               <Flex alignItems="center">
//                 <SignPageFee fee={fee} />
//               </Flex>
//             </Flex>

//             <FormLabel>To</FormLabel>
//             <BakerSmallTile pkh={recipient.pkh} />
//           </ModalBody>
//           <ModalFooter>
//             <SignButton
//               isLoading={isSigning}
//               signer={operation.signer}
//               onSubmit={onSign}
//               text={headerText(operation.type, "single")}
//             />
//           </ModalFooter>
//         </form>
//       </ModalContent>
//     </FormProvider>
//   );
// };

// export default DelegationSignPage;
