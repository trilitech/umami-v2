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
      <Center w="100%" mt="200px">
        <Box>
          <Heading textAlign="center" mb={3}>
            Ooops, something went wrong!
          </Heading>

          <Button variant="primary" onClick={onRefresh} mr={2}>
            Refresh the page
          </Button>
          <Button mr={2} variant="secondary" onClick={onBackup}>
            Download Backup
          </Button>
          <Button mr={2} variant="warning" onClick={onOffboard}>
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
