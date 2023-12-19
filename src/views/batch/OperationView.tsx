import { AspectRatio, Flex, Heading, Image, Link, Tooltip } from "@chakra-ui/react";

import { tokenTitle } from "./BatchView";
import { BakerIcon, OutgoingArrow } from "../../assets/icons";
import colors from "../../style/colors";
import { Operation } from "../../types/Operation";
import { thumbnailUri, tokenNameSafe, tokenUri } from "../../types/Token";
import { prettyTezAmount } from "../../utils/format";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { useGetToken } from "../../utils/hooks/tokensHooks";
import { getIPFSurl } from "../../utils/token/utils";

export const OperationView = ({ operation }: { operation: Operation }) => {
  const getToken = useGetToken();
  const network = useSelectedNetwork();

  switch (operation.type) {
    case "tez":
      return (
        <Flex>
          <OutgoingArrow marginRight="8px" />
          <Heading size="sm">{prettyTezAmount(operation.amount)}</Heading>
        </Flex>
      );
    case "fa1.2":
    case "fa2": {
      const token = getToken(operation.contract.pkh, operation.tokenId);
      if (token?.type === "nft") {
        return (
          <Flex>
            <OutgoingArrow marginRight="8px" />
            {Number(operation.amount) > 1 && (
              <>
                <Heading color={colors.gray[450]} size="sm">
                  x{operation.amount}
                </Heading>
                &nbsp;
              </>
            )}
            <Heading size="sm">
              <Tooltip
                padding="8px"
                background={colors.gray[700]}
                border="1px solid"
                borderColor={colors.gray[500]}
                borderRadius="8px"
                label={
                  <AspectRatio width="170px" height="170px" ratio={1}>
                    <Image src={getIPFSurl(thumbnailUri(token))} />
                  </AspectRatio>
                }
              >
                <Link data-testid="link" href={tokenUri(token, network)}>
                  {tokenNameSafe(token)}
                </Link>
              </Tooltip>
            </Heading>
          </Flex>
        );
      }

      return (
        <Flex>
          <OutgoingArrow marginRight="8px" />
          <Heading size="sm">
            <Link data-testid="link" href={token ? tokenUri(token, network) : undefined}>
              {tokenTitle(token, operation.amount)}
            </Link>
          </Heading>
        </Flex>
      );
    }
    case "delegation":
      return (
        <Flex>
          <BakerIcon marginRight="8px" />
          <Heading size="sm">Delegate</Heading>
        </Flex>
      );
    case "undelegation":
      return (
        <Flex>
          <BakerIcon marginRight="8px" />
          <Heading size="sm">End Delegation</Heading>
        </Flex>
      );
    case "contract_origination":
    case "contract_call":
      throw new Error(`${operation.type} is not supported yet`);
  }
};
