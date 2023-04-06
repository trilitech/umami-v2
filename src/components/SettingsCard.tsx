import { Card, CardBody, Flex, Heading } from "@chakra-ui/react";
import colors from "../style/colors";

export const SettingsCard: React.FC<{
  about: string;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ about, onClick, children }) => {
  return (
    <Card
      paddingX={1}
      marginY={2}
      bgColor={colors.gray[900]}
      borderRadius="lg"
      justifyContent="center"
      border="1px solid"
      borderColor={colors.gray[700]}
      cursor={onClick ? "pointer" : undefined}
      _hover={{
        _borderColor: onClick ? colors.gray[600] : colors.gray[700],
      }}
      h="66px"
    >
      <CardBody alignContent="center" overflow={"hidden"} onClick={onClick}>
        <Flex alignItems="center" h="100%">
          <Flex justifyContent="space-between" alignItems="center" w="100%">
            <Heading size="sm">{about}</Heading>
            {children}
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};
