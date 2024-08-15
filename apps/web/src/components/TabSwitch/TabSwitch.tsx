import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Center,
  Heading,
  Tab,
  TabList,
  useBreakpointValue,
  useTabsContext,
} from "@chakra-ui/react";
import { useState } from "react";

import { useColor } from "../../styles/useColor";

/**
 * This component provides normal TabList for desktop,
 * but shows the tab options in an Accordion for mobile.
 *
 * It synchronizes the selected tab with the Tabs component.
 *
 * @param options - The list of tab options
 */
export const TabSwitch = ({ options }: { options: string[] }) => {
  const color = useColor();
  const { selectedIndex, setSelectedIndex } = useTabsContext();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const [isAccordionCollapsed, setIsAccordionCollapsed] = useState(true);
  const currentTab = options[selectedIndex];

  if (isMobile) {
    return (
      <Accordion
        allowToggle
        data-testid="tab-switch-accordion"
        index={isAccordionCollapsed ? -1 : 0}
        variant="onboarding"
      >
        <AccordionItem border="none">
          <AccordionButton
            data-group
            data-testid="tab-switch-accordion-button"
            onClick={() => setIsAccordionCollapsed(curr => !curr)}
          >
            <Center
              width="100%"
              height="48px"
              padding="6px"
              borderRadius="60px"
              backgroundColor={color("100")}
            >
              <Heading color={color("900")} size="md">
                {currentTab}
              </Heading>
              <AccordionIcon />
            </Center>
          </AccordionButton>

          <AccordionPanel
            marginTop="12px"
            border="1.5px solid"
            borderColor={color("100")}
            borderRadius="30px"
            data-testid="tab-switch-accordion-panel"
          >
            <Center flexDirection="column" gap="12px">
              {options.map((option, index) => (
                <Button
                  key={option}
                  justifyContent="center"
                  width="full"
                  height="46px"
                  onClick={() => {
                    setSelectedIndex(index);
                    setIsAccordionCollapsed(true);
                  }}
                  variant="dropdownOption"
                >
                  {option}
                </Button>
              ))}
            </Center>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <TabList
      justifyContent="space-between"
      padding="6px"
      border="1px solid"
      borderColor={color("100")}
      borderRadius="full"
      data-testid="tab-switch-tabs"
    >
      {options.map(option => (
        <Tab key={option}>{option}</Tab>
      ))}
    </TabList>
  );
};
