import { Flex, Grid, GridItem } from "@chakra-ui/layout";
import { Box, Text, Heading, Center } from "@chakra-ui/react";
import React from "react";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import ClickableCard, { SettingsCard } from "../../components/ClickableCard";
import { navigateToExternalLink } from "../../utils/helpers";
import ExternalLinkIcon from "../../assets/icons/ExternalLink";

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
        <HelpCard
          title="Learn More"
          onClick={() => {
            navigateToExternalLink("https://medium.com/umamiwallet");
          }}
        >
          <HelpLinkRow
            about="Browse Articles"
            onClickIcon={() => {
              navigateToExternalLink("https://medium.com/umamiwallet");
            }}
          />
        </HelpCard>

        <HelpCard
          title="Questions?"
          onClick={() => {
            navigateToExternalLink("https://github.com/trilitech/umami-v1/wiki");
          }}
        >
          <HelpLinkRow
            about="Browse FAQs"
            onClickIcon={() => {
              navigateToExternalLink("https://github.com/trilitech/umami-v1/wiki");
            }}
          />
        </HelpCard>

        <Box w="550px" data-testid="help-card" mb="20px">
          <Heading size="lg" mb="16px">
            Need Help?
          </Heading>
          <SettingsCard
            left="Contact our Support Team"
            onClick={() => navigateToExternalLink("mailto:umami-support@trili.tech")}
            isSelected={false}
          >
            <Center>
              <Text size="sm" color={colors.gray[300]}>
                umami-support@trili.tech
              </Text>
              <ExternalLinkIcon ml="4px" />
            </Center>
          </SettingsCard>
          <SettingsCard
            isSelected={false}
            left="Get in touch with the Community"
            onClick={() =>
              navigateToExternalLink(
                "https://join.slack.com/t/tezos-dev/shared_invite/zt-1ur1ymxrp-G_X_bFHrvWXwoeiy53J8lg"
              )
            }
          >
            <Center>
              <Text size="sm" color={colors.gray[300]}>
                Slack #Umami
              </Text>
              <ExternalLinkIcon ml="4px" />
            </Center>
          </SettingsCard>
        </Box>

        <HelpCard
          title="Terms of Use"
          onClick={() => {
            navigateToExternalLink("https://umamiwallet.com/tos.html");
          }}
        >
          <HelpLinkRow
            about="Read Terms of Service"
            onClickIcon={() => {
              navigateToExternalLink("https://umamiwallet.com/tos.html");
            }}
          />
        </HelpCard>
      </GridItem>
    </Grid>
  );
}

const HelpLinkRow: React.FC<{
  about: string;
  onClickIcon: () => void;
  linkDescription?: string;
}> = ({ about, onClickIcon, linkDescription }) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Heading size="sm">{about}</Heading>

      <Flex alignItems="center">
        {linkDescription && (
          <Text
            size="sm"
            color={colors.gray[400]}
            _hover={{
              color: colors.gray[100],
              cursor: "pointer",
            }}
            onClick={onClickIcon}
          >
            {linkDescription}
          </Text>
        )}
        <ExternalLinkIcon />
      </Flex>
    </Flex>
  );
};

const HelpCard: React.FC<{
  title: string;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ title, onClick, children }) => {
  return (
    <Box marginY="10px" data-testid="help-card">
      <Flex>
        <Box w="550px">
          <Heading size="lg" mb="16px">
            {title}
          </Heading>
          <ClickableCard onClick={onClick} isSelected={false}>
            {children}
          </ClickableCard>
        </Box>
      </Flex>
    </Box>
  );
};
