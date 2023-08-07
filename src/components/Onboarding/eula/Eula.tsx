import { Heading, VStack, Text, Divider, Checkbox, Button, Container } from "@chakra-ui/react";
import React from "react";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { Step, StepType } from "../useOnboardingModal";

const Eula: React.FC<{
  goToStep: (step: Step) => void;
}> = ({ goToStep }) => {
  const [isChecked, setIsChecked] = React.useState(false);
  const eulaItems = [
    {
      title: "Agreement",
      content: `By making use of Umami, User agrees to follow terms as set herein.`,
    },
    {
      title: "Umami Description",
      content: `The Umami Wallet (hereafter "Umami") is an open source software project supported by Nomadic Labs, a company incorporated in France. Umami is a simple account management system for Tezos' cryptocurrency (hereafter "tez").
      \nUmami's intended purpose is to: (i) allow users to view their tez balances; (ii) facilitates the forming operations for submission to the blockchain; and (iii) allows users to save and organize their contacts' addresses.`,
    },
    {
      title: "Umami is not VASP",
      content: `Umami is not a Virtual Asset Service Provider, as it does not provide the following services: (i) recommendations or advice; or (ii) trade or swap between tokens or assets.
      \nUmami is free of charge. Umami does not profit from its operations, nor does Umami collect any user's personal data centrally.`,
    },
    {
      title: "No Guarantees",
      content: `As Umami is an open source project, the Umami Team members cannot guarantee that any errors of any nature that could possibly appear in the source code "have been seen." The Umami Team members, Nomadic Labs, its subsidiaries, the directors, employees and agents cannot under any circumstances be held liable for the use of and reliance by the Users or any third Party whatsoever on Umami.
      \nUmami's source code reflects the best of our knowledge, it has been made in good faith and while every care has been taken in coding Umami. The Umami Team members, Nomadic Labs, its subsidiaries, the directors, employees and agents make no engagement and give no warranties of whatever nature with respect to the Umami source code, including but not limited to any bugs, faults or risk of loss of your crypto-assets..
      \nNo content on Umami shall constitute or shall be understood as a recommendation to enter any investment transactions or agreements of any kind, nor to use the code without having carried out your own technical audit.`,
    },
    {
      title: "Hold Harmless",
      content: `User understands and agrees that any action on Umami is strictly at User's own risk. The Umami Team members, Nomadic Labs, its subsidiaries, the directors, employees and agents will not be held liable for any losses and damages in connection to the use of the Umami source code.`,
    },
    {
      title: "Lawful User",
      content: `User shall comply with all applicable laws, statutes, regulations and codes relating to anti-bribery and anti-corruption, fight against the financing of terrorism and shall not engage in any activity, practice or conduct outside France, which would constitute an offence of the previous texts, if such activity, practice or conduct had been carried out inside France.
        \nNone of the Umami Team members, Nomadic Labs, its subsidiaries, the directors, employees and agents shall be considered liable of such misconduct by a malicious User.`,
    },
  ];
  return (
    <ModalContentWrapper
      icon={SupportedIcons.document}
      title="Umami Wallet End User License Agreement"
      subtitle="Last updated June 25, 2021"
    >
      <VStack spacing="10px" w="100%" h="500px" pr="4px" overflowX="hidden" overflowY="auto">
        {eulaItems.map(item => {
          return (
            <Container key={item.title}>
              <Heading size="md" w="100%">
                {item.title}
              </Heading>
              <Text whiteSpace="pre-wrap" pt="8px" pb="28px" size="sm">
                {item.content}
              </Text>
            </Container>
          );
        })}
        <Divider />
        <Checkbox onChange={e => setIsChecked(e.target.checked)} pt="24px" pb="24px">
          I confirm that I have read and agreed with the terms of the User Agreement
        </Checkbox>
        <Button
          w="100%"
          minH="48px"
          size="lg"
          bg="umami.blue"
          isDisabled={!isChecked}
          onClick={() => {
            goToStep({ type: StepType.connectOrCreate });
          }}
        >
          Continue
        </Button>
      </VStack>
    </ModalContentWrapper>
  );
};

export default Eula;
