import { Box, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import type React from "react";
import { Link } from "react-router-dom";

import { ExternalLinkIcon } from "../../assets/icons";
import { ClickableCard } from "../../components/ClickableCard";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";

export const HelpView = () => (
  <Grid
    gridGap="1"
    gridTemplateRows="0fr 1fr 1fr"
    gridTemplateColumns="1fr 1fr"
    gridTemplateAreas={`
                  "header header"
                  "main main"
                  "main main"
                  `}
    height="100%"
  >
    <GridItem gridArea="header">
      <TopBar title="Help" />
    </GridItem>
    <GridItem gridArea="main" marginTop={1}>
      <HelpCard title="Learn More">
        <HelpLinkRow about="Browse Articles" externalLink="https://medium.com/umamiwallet" />
      </HelpCard>

      <HelpCard title="Need Help?">
        <HelpLinkRow
          about="Contact our Support Team"
          externalLink="mailto:umami-support@trili.tech"
          linkDescription="umami-support@trili.tech"
        />

        <HelpLinkRow
          about="Get in touch with the Community"
          externalLink="https://join.slack.com/t/tezos-dev/shared_invite/zt-1ur1ymxrp-G_X_bFHrvWXwoeiy53J8lg"
          linkDescription="Slack #Umami"
        />
      </HelpCard>

      <HelpCard title="Terms">
        <HelpLinkRow
          about="Read Terms of Service"
          externalLink="https://umamiwallet.com/tos.html"
        />
        <HelpLinkRow
          about="Read Privacy Policy"
          externalLink="https://umamiwallet.com/privacypolicy.html"
        />
      </HelpCard>
    </GridItem>
  </Grid>
);

const HelpLinkRow: React.FC<{
  about: string;
  externalLink: string;
  linkDescription?: string;
}> = ({ about, externalLink, linkDescription }) => (
  <Link rel="noopener noreferrer" target="_blank" to={externalLink}>
    <ClickableCard cursor="pointer" isSelected={false}>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading size="sm">{about}</Heading>

        <Flex alignItems="center">
          {linkDescription && (
            <Text marginRight="4px" color={colors.gray[400]} size="sm">
              {linkDescription}
            </Text>
          )}
          <ExternalLinkIcon />
        </Flex>
      </Flex>
    </ClickableCard>
  </Link>
);

const HelpCard: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <Box data-testid="help-card" marginY="10px">
    <Flex>
      <Box width="550px">
        <Heading marginBottom="16px" size="lg">
          {title}
        </Heading>
        {children}
      </Box>
    </Flex>
  </Box>
);
