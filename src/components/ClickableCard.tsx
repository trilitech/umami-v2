import { Card, CardBody, CardProps, Flex, Heading } from "@chakra-ui/react";
import colors from "../style/colors";
import { PropsWithChildren } from "react";
import { ChevronRightIcon } from "../assets/icons";

export const ClickableCard: React.FC<
  PropsWithChildren<
    {
      onClick?: () => void;
      isSelected: boolean;
    } & CardProps
  >
> = ({ onClick, children, isSelected, ...props }) => {
  return (
    <Card
      justifyContent="center"
      height="66px"
      marginBottom="10px"
      padding="24px"
      border="1px solid"
      borderColor={isSelected ? ` ${colors.orangeL}` : "transparent"}
      borderRadius="lg"
      _hover={{ border: `1px solid ${colors.gray[500]}`, bg: colors.gray[800] }}
      cursor={onClick ? "pointer" : undefined}
      backgroundColor={colors.gray[900]}
      onClick={onClick}
      {...props}
    >
      <CardBody padding={0}>{children}</CardBody>
    </Card>
  );
};

export const SettingsCardWithDrawerIcon: React.FC<{
  left: string;
  isSelected: boolean;
  onClick?: () => void;
}> = ({ left, isSelected, onClick }) => {
  return (
    <ClickableCard isSelected={isSelected} onClick={onClick}>
      <Flex alignItems="center" height="100%">
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          <Heading size="sm">{left}</Heading>
          <ChevronRightIcon />
        </Flex>
      </Flex>
    </ClickableCard>
  );
};
