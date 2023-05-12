import {
  Card,
  CardBody,
  Flex,
  Heading,
  Icon,
  LayoutProps,
} from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import colors from "../style/colors";

const ClickableCard: React.FC<{
  onClick?: () => void;
  h?: LayoutProps["h"];
  children: React.ReactNode;
}> = ({ onClick, h, children }) => {
  //TODO: Remove hooks for hover. CSS _hover doesn't work.
  const [mouseHover, setMouseHover] = useState(false);
  return (
    <Card
      paddingX={1}
      marginY={2}
      bgColor={colors.gray[900]}
      borderRadius="lg"
      justifyContent="center"
      border="1px solid"
      borderColor={mouseHover && onClick ? colors.gray[600] : colors.gray[700]}
      onMouseEnter={() => {
        setMouseHover(true);
      }}
      onMouseLeave={() => {
        setMouseHover(false);
      }}
      cursor={onClick ? "pointer" : undefined}
      h={h}
    >
      <CardBody onClick={onClick}>{children}</CardBody>
    </Card>
  );
};

export const SettingsCard: React.FC<{
  left: string;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ left, onClick, children }) => {
  return (
    <ClickableCard onClick={onClick} h="66px">
      <Flex alignItems="center" h="100%">
        <Flex justifyContent="space-between" alignItems="center" w="100%">
          <Heading size="sm">{left}</Heading>
          {children}
        </Flex>
      </Flex>
    </ClickableCard>
  );
};

export const SettingsCardWithDrawerIcon: React.FC<{
  left: string;
  onClick?: () => void;
  children?: React.ReactNode;
}> = ({ left, onClick, children }) => {
  return (
    <SettingsCard left={left} onClick={onClick}>
      <Icon
        as={AiOutlineRight}
        color={colors.gray[600]}
        _hover={{
          color: colors.gray[300],
        }}
      />
      {children}
    </SettingsCard>
  );
};

export default ClickableCard;
