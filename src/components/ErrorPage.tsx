import { Box, Button, Center, Flex, Heading } from "@chakra-ui/react";
import { emailBodyTemplate } from "./TopBar";

// TODO: prepare for Beta release properly
export const ErrorPage: React.FC = () => {
  const onRefresh = () => {
    window.location.reload();
  };

  const onBackup = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(window.localStorage)
    )}`;

    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
  };

  const onOffboard = () => {
    window.localStorage.clear();
    onRefresh();
  };

  return (
    <Flex alignItems="stretch">
      <Center width="100%" marginTop="200px">
        <Box>
          <Heading marginBottom={3} textAlign="center">
            Ooops, something went wrong!
          </Heading>

          <Button marginRight={2} onClick={onRefresh}>
            Refresh the page
          </Button>
          <Button marginRight={2} onClick={onBackup} variant="secondary">
            Download Backup
          </Button>
          <Button marginRight={2} onClick={onOffboard} variant="warning">
            Offboard
          </Button>
          <Button variant="tertiary">
            <a
              href={`mailto:umami-support@trili.tech?subject=Umami V2 feedback&body=${emailBodyTemplate}`}
            >
              Report Error
            </a>
          </Button>
        </Box>
      </Center>
    </Flex>
  );
};
export default ErrorPage;
