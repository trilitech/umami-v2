import { Card, CardBody, CardProps, Flex, Heading } from "@chakra-ui/react";
import colors from "../style/colors";
import ChevronRightIcon from "../assets/icons/ChevronRight";
import { PropsWithChildren } from "react";

const ClickableCard: React.FC<
  PropsWithChildren<
    {
      onClick?: () => void;
      isSelected: boolean;
    } & CardProps
  >
> = ({ onClick, children, isSelected, ...props }) => {
  return (
    <Card
      height="66px"
      padding="24px"
      marginBottom="10px"
      bgColor={colors.gray[900]}
      borderRadius="lg"
      border="1px solid"
      borderColor={isSelected ? ` ${colors.orangeL}` : "transparent"}
      _hover={{ border: `1px solid ${colors.gray[500]}`, bg: colors.gray[800] }}
      justifyContent="center"
      cursor={onClick ? "pointer" : undefined}
      onClick={onClick}
      {...props}
    >
      <CardBody padding={0}>{children}</CardBody>
    </Card>
  );
};

export const SettingsCard: React.FC<{
  left: string;
  onClick?: () => void;
  children: React.ReactNode;
  isSelected: boolean;
}> = ({ left, onClick, isSelected, children }) => {
  return (
    <ClickableCard onClick={onClick} isSelected={isSelected}>
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
  isSelected: boolean;
  onClick?: () => void;
}> = ({ left, isSelected, onClick }) => {
  return (
    <SettingsCard left={left} onClick={onClick} isSelected={isSelected}>
      <ChevronRightIcon />
    </SettingsCard>
  );
};

export default ClickableCard;
