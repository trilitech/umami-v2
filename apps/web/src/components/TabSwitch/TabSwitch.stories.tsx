import { Box, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { type Meta, type StoryObj } from "@storybook/react";

import { TabSwitch } from "./TabSwitch";

type Story = StoryObj<typeof TabSwitch>;

const defaultOptions = ["Seed Phrase", "Secret Key", "Backup", "Ledger"];

const meta: Meta<typeof TabSwitch> = {
  component: TabSwitch,
  title: "TabSwitch",
  argTypes: {
    options: { control: "object", defaultValue: defaultOptions },
  },
  args: { options: defaultOptions },
  decorators: [
    Story => (
      <Box minWidth="300px" minHeight="300px" padding="20px" background="white">
        <Tabs variant="onboarding">
          <Story />

          <TabPanels>
            <TabPanel>Panel 1</TabPanel>
            <TabPanel>Panel 2</TabPanel>
            <TabPanel>Panel 3</TabPanel>
            <TabPanel>Panel 4</TabPanel>
            <TabPanel>Panel 5</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    ),
  ],
};

export default meta;
export const Default: Story = {};
