import { Flex, IconButton, Tooltip } from "@chakra-ui/react";

import { OutlineQuestionCircleIcon } from "../../assets/icons";

export const InfoMark = ({ label }: { label: string }) => (
  <Flex display="inline-flex" transform="translateY(5px)">
    <Tooltip hasArrow label={label}>
      <IconButton
        boxSize="22px"
        minWidth="auto"
        aria-label="Help"
        icon={<OutlineQuestionCircleIcon />}
        size="sm"
        variant="outline"
      />
    </Tooltip>
  </Flex>
);
