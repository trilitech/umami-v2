import { Card, CardBody, Flex, Heading, LayoutProps } from "@chakra-ui/react";
import { useState } from "react";
import colors from "../style/colors";
import { ChevronRightIcon } from "@chakra-ui/icons";

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
}> = ({ left, onClick }) => {
  return (
    <SettingsCard left={left} onClick={onClick}>
      <ChevronRightIcon
        viewBox="0 0 18 18"
        height="18px"
        width="18px"
        marginTop="-3px"
        color={colors.gray[450]}
        _hover={{
          color: colors.gray[300],
        }}
      />
    </SettingsCard>
  );
};

export default ClickableCard;
