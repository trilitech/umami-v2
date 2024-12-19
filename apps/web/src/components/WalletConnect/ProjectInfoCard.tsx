import { Avatar, Box, Card, Link, Text } from "@chakra-ui/react";
import { type SignClientTypes } from "@walletconnect/types";

type Props = {
  metadata: SignClientTypes.Metadata;
  intention?: string;
};

/**
 * dApp project info card. Contains verification info to help user decide if the dApp is safe to connect.
 */
export const ProjectInfoCard = ({ metadata, intention }: Props) => {
  const { icons, name, url } = metadata;

  return (
    <Box textAlign="center">
      <Box>
        <Avatar marginX="auto" size="lg" src={icons[0]} />
      </Box>
      <Box marginTop="16px">
        <Card data-testid="session-info-card-text">
          <Text as="span" fontWeight="bold">
            {name}
          </Text>
          <Text size="md">wants to {intention ?? "connect"}</Text>
        </Card>
      </Box>
      <Box marginTop="16px">
        <Link
          verticalAlign="middle"
          marginLeft="8px"
          data-testid="session-info-card-url"
          href={url}
          isExternal
        >
          {url}
        </Link>
      </Box>
    </Box>
  );
};
