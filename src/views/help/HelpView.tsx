import { Flex, Grid, GridItem } from "@chakra-ui/layout";
import { Box, Text, Heading } from "@chakra-ui/react";
import React from "react";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import ClickableCard from "../../components/ClickableCard";
import ExternalLinkIcon from "../../assets/icons/ExternalLink";
import { Link } from "react-router-dom";

export default function HelpView() {
  return (
    <Grid
      h="100%"
      templateAreas={`
                  "header header"
                  "main main"
                  "main main"
                  `}
      gridTemplateRows="0fr 1fr 1fr"
      gridTemplateColumns="1fr 1fr"
      gap="1"
    >
      <GridItem area="header">
        <TopBar title="Help" />
      </GridItem>
      <GridItem area="main" mt={1}>
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

        <HelpCard title="Terms of Use">
          <HelpLinkRow
            about="Read Terms of Service"
            externalLink="https://umamiwallet.com/tos.html"
          />
        </HelpCard>
      </GridItem>
    </Grid>
  );
}

const HelpLinkRow: React.FC<{
  about: string;
  externalLink: string;
  linkDescription?: string;
}> = ({ about, externalLink, linkDescription }) => {
  return (
    <Link to={externalLink} target="_blank" rel="noopener noreferrer">
      <ClickableCard isSelected={false} cursor="pointer">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="sm">{about}</Heading>

          <Flex alignItems="center">
            {linkDescription && (
              <Text size="sm" mr="4px" color={colors.gray[400]}>
                {linkDescription}
              </Text>
            )}
            <ExternalLinkIcon />
          </Flex>
        </Flex>
      </ClickableCard>
    </Link>
  );
};

const HelpCard: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <Box marginY="10px" data-testid="help-card">
      <Flex>
        <Box w="550px">
          <Heading size="lg" mb="16px">
            {title}
          </Heading>
          {children}
        </Box>
      </Flex>
    </Box>
  );
};
