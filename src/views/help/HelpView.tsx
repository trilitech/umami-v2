import { Flex, Grid, GridItem } from "@chakra-ui/layout";
import { Box, Text, Divider, Heading, Icon } from "@chakra-ui/react";
import { FiExternalLink } from "react-icons/fi";
import React from "react";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import ClickableCard from "../../components/ClickableCard";
import { navigateToExternalLink } from "../../utils/helpers";

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

        <HelpCard title="Need Help?">
          <Box>
            <Flex justifyContent="space-between" alignItems="center">
              <Heading size="sm">Contact our Support Team</Heading>
              <Flex
                alignItems="center"
                color={colors.gray[400]}
                _hover={{
                  color: colors.gray[300],
                }}
                cursor="pointer"
                onClick={() => navigateToExternalLink("mailto:umami-support@trili.tech")}
              >
                <Text size="sm">umami-support@trili.tech</Text>
                <Icon as={FiExternalLink} ml={2} />
              </Flex>
            </Flex>

            <Box marginY={4}>
              <Divider orientation="horizontal" size="lg" />
            </Box>

            <Flex justifyContent="space-between" alignItems="center">
              <Heading size="sm">Get in touch with the Community</Heading>

              <Flex
                alignItems="center"
                color={colors.gray[400]}
                _hover={{
                  color: colors.gray[300],
                }}
                cursor="pointer"
                onClick={() =>
                  navigateToExternalLink(
                    "https://join.slack.com/t/tezos-dev/shared_invite/zt-1ur1ymxrp-G_X_bFHrvWXwoeiy53J8lg"
                  )
                }
              >
                <Text size="sm">Slack #Umami</Text>
                <Icon as={FiExternalLink} ml={2} />
              </Flex>
            </Flex>
          </Box>
        </HelpCard>

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
        <Icon
          cursor="pointer"
          color={colors.gray[600]}
          as={FiExternalLink}
          _hover={{
            color: colors.gray[300],
          }}
          onClick={onClickIcon}
          ml={2}
        />
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
    <Box marginY={2} data-testid="help-card">
      <Flex>
        <Box w="550px">
          <Heading size="lg">{title}</Heading>
          <ClickableCard onClick={onClick}>{children}</ClickableCard>
        </Box>
      </Flex>
    </Box>
  );
};
