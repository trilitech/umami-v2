import { TokenTransfer } from "@tzkt/sdk-api";
import { TezTransfer } from "../types/Operation";
import { Token } from "../types/Token";

export const fa1Token: Token = {
  id: 10897662672897,
  account: {
    address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
  },
  token: {
    id: 10897625972737,
    contract: {
      address: "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe",
    },
    tokenId: "0",
    standard: "fa1.2",
    totalSupply: "13000000",
  },
  balance: "443870",
  transfersCount: 27,
  firstLevel: 288229,
  firstTime: "2022-03-24T15:32:10Z",
  lastLevel: 1365863,
  lastTime: "2022-10-20T13:36:35Z",
};

export const fa2Token = {
  id: 10898310692865,
  account: {
    address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
  },
  token: {
    id: 10898231001089,
    contract: {
      address: "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
    },
    tokenId: "1",
    standard: "fa2",
    totalSupply: "13000000000",
    metadata: {
      name: "Klondike3",
      symbol: "KL3",
      decimals: "5",
    },
  },
  balance: "409412200",
  transfersCount: 22,
  firstLevel: 288246,
  firstTime: "2022-03-24T15:37:20Z",
  lastLevel: 1365863,
  lastTime: "2022-10-20T13:36:35Z",
};

export const nft: Token = {
  id: 10899466223618,
  account: {
    address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
  },
  token: {
    id: 10899466223617,
    contract: {
      address: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
    },
    tokenId: "3",
    standard: "fa2",
    totalSupply: "1",
    metadata: {
      name: "Tezzardz #10",
      rights: "© 2021 George Goodwin. All rights reserved.",
      symbol: "FKR",
      formats: [
        {
          uri: "ipfs://zdj7WgkxmCSgNVMFg2yR9mKgKjEH2RkzHatgHSCBYW3CQ5EJH",
          mimeType: "image/png",
        },
      ],
      creators: ["George Goodwin (@omgidrawedit)"],
      decimals: "0",
      royalties: {
        shares: {
          tz1LLPWMyZ7gKsp3WnLfemyAYW6CoZoozku5: "5",
        },
        decimals: "2",
      },
      attributes: [
        {
          name: "Background",
          value: "Purple",
        },
        {
          name: "Skin",
          value: "Orange",
        },
        {
          name: "Skin Pattern",
          value: "Heavy",
        },
        {
          name: "Clothing",
          value: "Shrine Onesie",
        },
        {
          name: "Tail Spikes",
          value: "Rainbow",
        },
        {
          name: "Headwear",
          value: "Limited Spikes",
        },
        {
          name: "Bling Level",
          value: "$",
        },
        {
          name: "Eyewear",
          value: "Gold Leaf Eye Patch",
        },
        {
          name: "Face",
          value: "Straight Tongue Sad",
        },
      ],
      displayUri: "ipfs://zdj7Wk92xWxpzGqT6sE4cx7umUyWaX2Ck8MrSEmPAR31sNWGz",
      artifactUri: "ipfs://zdj7WgkxmCSgNVMFg2yR9mKgKjEH2RkzHatgHSCBYW3CQ5EJH",
      description:
        "Tezzardz is a collection of 4,200 programmatically, randomly generated, snazzy little fukrs on the Tezos blockchain.",
      thumbnailUri: "ipfs://zb2rhXWQ9X95yxQwusNjftDSWVQYbGjFFFFBjJKQZ8uCrNcvV",
    },
  },
  balance: "0",
  transfersCount: 8,
  firstLevel: 288277,
  firstTime: "2022-03-24T15:45:30Z",
  lastLevel: 697800,
  lastTime: "2022-06-15T14:05:25Z",
};

export const response: Token[] =
  // 20230321163130
  // https://api.ghostnet.tzkt.io/v1/tokens/balances/?account=tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3

  [
    fa1Token,
    fa2Token,
    {
      id: 10898310692865,
      account: {
        address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      },
      token: {
        id: 10898231001089,
        contract: {
          address: "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
        },
        tokenId: "1",
        standard: "fa2",
        totalSupply: "13000000000",
        metadata: {
          name: "Klondike3",
          symbol: "KL3",
          decimals: "5",
        },
      },
      balance: "409412200",
      transfersCount: 22,
      firstLevel: 288246,
      firstTime: "2022-03-24T15:37:20Z",
      lastLevel: 1365863,
      lastTime: "2022-10-20T13:36:35Z",
    },
    nft,
    {
      id: 10899502923778,
      account: {
        address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      },
      token: {
        id: 10899502923777,
        contract: {
          address: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        },
        tokenId: "4",
        standard: "fa2",
        totalSupply: "1",
        metadata: {
          name: "Tezzardz #12",
          rights: "© 2021 George Goodwin. All rights reserved.",
          symbol: "FKR",
          formats: [
            {
              uri: "ipfs://zdj7WdYuKmsxyBtkkVcdLjtsfrF3caGdYz6NNuxTiJigsnm4s",
              mimeType: "image/png",
            },
          ],
          creators: ["George Goodwin (@omgidrawedit)"],
          decimals: "0",
          royalties: {
            shares: {
              tz1LLPWMyZ7gKsp3WnLfemyAYW6CoZoozku5: "5",
            },
            decimals: "2",
          },
          attributes: [
            {
              name: "Background",
              value: "Peach",
            },
            {
              name: "Skin",
              value: "Orange",
            },
            {
              name: "Skin Pattern",
              value: "Freckles",
            },
            {
              name: "Clothing",
              value: "Pink Biker",
            },
            {
              name: "Tail Spikes",
              value: "Gold",
            },
            {
              name: "Headwear",
              value: "Rare Frog Hat",
            },
            {
              name: "Face",
              value: "Tiny Face",
            },
          ],
          displayUri:
            "ipfs://zdj7WaSoswEYY5hcis4i4ZLDXpsusu8FaJNf4LfYXDoviiRem",
          artifactUri:
            "ipfs://zdj7WdYuKmsxyBtkkVcdLjtsfrF3caGdYz6NNuxTiJigsnm4s",
          description:
            "Tezzardz is a collection of 4,200 programmatically, randomly generated, snazzy little fukrs on the Tezos blockchain.",
          thumbnailUri:
            "ipfs://zb2rhbd5iDakMTQMUADUM2YdPecMzrENnMHKBosEWD9Zc4f8e",
        },
      },
      balance: "0",
      transfersCount: 2,
      firstLevel: 288278,
      firstTime: "2022-03-24T15:45:45Z",
      lastLevel: 545149,
      lastTime: "2022-05-17T10:15:45Z",
    },
    {
      id: 10899539623938,
      account: {
        address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      },
      token: {
        id: 10899539623937,
        contract: {
          address: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        },
        tokenId: "5",
        standard: "fa2",
        totalSupply: "1",
        metadata: {
          name: "Tezzardz #20",
          rights: "© 2021 George Goodwin. All rights reserved.",
          symbol: "FKR",
          formats: [
            {
              uri: "ipfs://zdj7WiGdd8mo4i8vhKwRcbYEumcpe9CjHXqcsnjBLeDAYhhxF",
              mimeType: "image/png",
            },
          ],
          creators: ["George Goodwin (@omgidrawedit)"],
          decimals: "0",
          royalties: {
            shares: {
              tz1LLPWMyZ7gKsp3WnLfemyAYW6CoZoozku5: "5",
            },
            decimals: "2",
          },
          attributes: [
            {
              name: "Background",
              value: "Pink",
            },
            {
              name: "Skin",
              value: "Red",
            },
            {
              name: "Skin Pattern",
              value: "Freckles",
            },
            {
              name: "Vest",
              value: "Pink",
            },
            {
              name: "Clothing",
              value: "Patterned Sweater",
            },
            {
              name: "Headwear",
              value: "Party Pal Hat",
            },
            {
              name: "Bling Level",
              value: "$",
            },
            {
              name: "Eyewear",
              value: "Dopey Swimming Goggles",
            },
            {
              name: "Face",
              value: "Straight Tongue Sad",
            },
          ],
          displayUri:
            "ipfs://zdj7WVwx4CX5fK5sHmXhjTm5wG9nCrzSBy83CGNXJ78fAJmba",
          artifactUri:
            "ipfs://zdj7WiGdd8mo4i8vhKwRcbYEumcpe9CjHXqcsnjBLeDAYhhxF",
          description:
            "Tezzardz is a collection of 4,200 programmatically, randomly generated, snazzy little fukrs on the Tezos blockchain.",
          thumbnailUri:
            "ipfs://zb2rhndGmg3GajqCvCwCr7ripVpxTYUfWNRJat6dsWhPSsvnu",
        },
      },
      balance: "0",
      transfersCount: 8,
      firstLevel: 288279,
      firstTime: "2022-03-24T15:46:15Z",
      lastLevel: 655300,
      lastTime: "2022-06-07T15:24:00Z",
    },
    {
      id: 41092018864129,
      account: {
        address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      },
      token: {
        id: 10899580518401,
        contract: {
          address: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        },
        tokenId: "6",
        standard: "fa2",
        totalSupply: "1",
        metadata: {
          name: "Tezzardz #24",
          rights: "© 2021 George Goodwin. All rights reserved.",
          symbol: "FKR",
          formats: [
            {
              uri: "ipfs://zdj7Wkn6y1DRrfJ3A1NEyxj1Sw2b39ZjggDPe9FEe7DGtNqoC",
              mimeType: "image/png",
            },
          ],
          creators: ["George Goodwin (@omgidrawedit)"],
          decimals: "0",
          royalties: {
            shares: {
              tz1LLPWMyZ7gKsp3WnLfemyAYW6CoZoozku5: "5",
            },
            decimals: "2",
          },
          attributes: [
            {
              name: "Background",
              value: "Pink",
            },
            {
              name: "Skin",
              value: "White",
            },
            {
              name: "Skin Pattern",
              value: "Bolt",
            },
            {
              name: "Clothing",
              value: "Rainbow Onesie",
            },
            {
              name: "Headwear",
              value: "Backwards Cap",
            },
            {
              name: "Bling Level",
              value: "$$$",
            },
            {
              name: "Face",
              value: "Bent Tongue Feisty",
            },
          ],
          displayUri:
            "ipfs://zdj7WWXMC8RpzC6RkR2DXtD2zcfLc2QWu6tu7f6vnkeeUvSoh",
          artifactUri:
            "ipfs://zdj7Wkn6y1DRrfJ3A1NEyxj1Sw2b39ZjggDPe9FEe7DGtNqoC",
          description:
            "Tezzardz is a collection of 4,200 programmatically, randomly generated, snazzy little fukrs on the Tezos blockchain.",
          thumbnailUri:
            "ipfs://zb2rhfbacgmTnG13DiCvjs6J21hzMeAueYVWg37C5owThnpfQ",
        },
      },
      balance: "1",
      transfersCount: 15,
      firstLevel: 698784,
      firstTime: "2022-06-15T19:04:00Z",
      lastLevel: 1221385,
      lastTime: "2022-09-23T12:56:05Z",
    },
    {
      id: 41096922005505,
      account: {
        address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      },
      token: {
        id: 10899657064449,
        contract: {
          address: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        },
        tokenId: "8",
        standard: "fa2",
        totalSupply: "1",
        metadata: {
          name: "Tezzardz #28",
          rights: "© 2021 George Goodwin. All rights reserved.",
          symbol: "FKR",
          formats: [
            {
              uri: "ipfs://zdj7WhrR9jH5yGtKdnQqkMPNftsFNQ4yzukV9CDMud5WAknzD",
              mimeType: "image/png",
            },
          ],
          creators: ["George Goodwin (@omgidrawedit)"],
          decimals: "0",
          royalties: {
            shares: {
              tz1LLPWMyZ7gKsp3WnLfemyAYW6CoZoozku5: "5",
            },
            decimals: "2",
          },
          attributes: [
            {
              name: "Background",
              value: "Yellow",
            },
            {
              name: "Skin",
              value: "Purple",
            },
            {
              name: "Skin Pattern",
              value: "Bolt",
            },
            {
              name: "Clothing",
              value: "Meditation Tee",
            },
            {
              name: "Headwear",
              value: "Hunting Hat",
            },
            {
              name: "Bling Level",
              value: "$",
            },
            {
              name: "Face",
              value: "Straight Tongue Sad",
            },
          ],
          displayUri:
            "ipfs://zdj7Wc5siFbHn8EMrfGYiJrfe5fjqGrbJSvgjfr4oR4Rf9juV",
          artifactUri:
            "ipfs://zdj7WhrR9jH5yGtKdnQqkMPNftsFNQ4yzukV9CDMud5WAknzD",
          description:
            "Tezzardz is a collection of 4,200 programmatically, randomly generated, snazzy little fukrs on the Tezos blockchain.",
          thumbnailUri:
            "ipfs://zb2rhge6ZsiMugSjXsye6eB4mUMafv9C9GyF3PsDCcqSnsVkD",
        },
      },
      balance: "0",
      transfersCount: 4,
      firstLevel: 698871,
      firstTime: "2022-06-15T19:28:15Z",
      lastLevel: 805353,
      lastTime: "2022-07-06T14:14:00Z",
    },
    {
      id: 67550405722113,
      account: {
        address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      },
      token: {
        id: 67550012506113,
        contract: {
          address: "KT1P16Zn5i578uZhThHpcPtAhVuq7ZVsdnRn",
        },
        tokenId: "47",
        standard: "fa2",
        totalSupply: "1",
        metadata: {
          date: "2021-04-25T01:33:53.451Z",
          name: "Ronald Reagan (L)",
          tags: ["PixelPotus", "collectibles"],
          type: "Digital Collectable Pixelated POTUS",
          rarity: "Legendary",
          symbol: "POTUS40-L",
          creators: ["PixelPotus"],
          decimals: "0",
          language: "en",
          displayUri:
            "ipfs://QmYd7UqZiHtpR3Qc7XnC7NWUt1qxCN9aiwEf9aGF9iybBB/display/5040.png",
          artifactUri:
            "ipfs://QmYd7UqZiHtpR3Qc7XnC7NWUt1qxCN9aiwEf9aGF9iybBB/full/5040.png",
          description: "The 40th POTUS (Legendary)",
          externalUri: "https://www.pixelpotus.com/potus/5040",
          thumbnailUri:
            "ipfs://QmYd7UqZiHtpR3Qc7XnC7NWUt1qxCN9aiwEf9aGF9iybBB/thumbs/5040.png",
          isBooleanAmount: false,
        },
      },
      balance: "1",
      transfersCount: 1,
      firstLevel: 1333809,
      firstTime: "2022-10-14T15:05:20Z",
      lastLevel: 1333809,
      lastTime: "2022-10-14T15:05:20Z",
    },
    {
      id: 82694091309057,
      account: {
        address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      },
      token: {
        id: 82690241986561,
        contract: {
          address: "KT1RifpSrfjPnKJFp89igVUccvpnWtsre2wD",
        },
        tokenId: "2",
        standard: "fa2",
        totalSupply: "160",
        metadata: {
          name: "Tezos Meet & Greet Access Token",
          formats: [
            {
              uri: "ipfs://QmXfLqzV28TfSpps1UFZo94NMsyYdnrxDNffdQsYPMr53t/image.png",
              fileName: "Umami NFT.png",
              fileSize: "51567",
              mimeType: "image/png",
            },
          ],
          decimals: "0",
          attributes: [],
          displayUri:
            "ipfs://QmXfLqzV28TfSpps1UFZo94NMsyYdnrxDNffdQsYPMr53t/image.png",
          artifactUri:
            "ipfs://QmXfLqzV28TfSpps1UFZo94NMsyYdnrxDNffdQsYPMr53t/image.png",
          description:
            "Access token to the Tezos Meet & Greet in Paris Dec 14, 2022",
        },
      },
      balance: "1",
      transfersCount: 1,
      firstLevel: 1652402,
      firstTime: "2022-12-12T16:14:15Z",
      lastLevel: 1652402,
      lastTime: "2022-12-12T16:14:15Z",
    },
    {
      id: 82696637251585,
      account: {
        address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      },
      token: {
        id: 82687681363969,
        contract: {
          address: "KT1K1LMeToxBX4tPPAZKMR8hCQgw3hpLaoti",
        },
        tokenId: "2",
        standard: "fa2",
        totalSupply: "200",
        metadata: {
          name: "Tezos Meet & Greet Access Token",
          formats: [
            {
              uri: "ipfs://QmReoHBVcKAaHFi5n2ADiAJfaNiFhqxfJsRWGYe8ocozpT/image.png",
              fileName: "fileName",
              fileSize: "46202",
              mimeType: "image/png",
            },
          ],
          decimals: "0",
          attributes: [],
          displayUri:
            "ipfs://QmReoHBVcKAaHFi5n2ADiAJfaNiFhqxfJsRWGYe8ocozpT/image.png",
          artifactUri:
            "ipfs://QmReoHBVcKAaHFi5n2ADiAJfaNiFhqxfJsRWGYe8ocozpT/image.png",
          description:
            "Access token to the Tezos Meet & Greet in Paris Dec 14, 2022",
        },
      },
      balance: "1",
      transfersCount: 1,
      firstLevel: 1652454,
      firstTime: "2022-12-12T16:27:35Z",
      lastLevel: 1652454,
      lastTime: "2022-12-12T16:27:35Z",
    },
    {
      id: 82700882935809,
      account: {
        address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      },
      token: {
        id: 82700684754945,
        contract: {
          address: "KT1K1LMeToxBX4tPPAZKMR8hCQgw3hpLaoti",
        },
        tokenId: "4",
        standard: "fa2",
        totalSupply: "300",
        metadata: {
          name: "Tezos Meet & Greet Access Token",
          formats: [
            {
              uri: "ipfs://QmXfLqzV28TfSpps1UFZo94NMsyYdnrxDNffdQsYPMr53t/image.png",
              fileName: "fileName",
              fileSize: "51567",
              mimeType: "image/png",
            },
          ],
          decimals: "0",
          attributes: [
            {
              name: "alt_text",
              value:
                "Access token to the Tezos Meet & Greet in Paris Dec 14, 2022",
            },
          ],
          displayUri:
            "ipfs://QmXfLqzV28TfSpps1UFZo94NMsyYdnrxDNffdQsYPMr53t/image.png",
          artifactUri:
            "ipfs://QmXfLqzV28TfSpps1UFZo94NMsyYdnrxDNffdQsYPMr53t/image.png",
          description:
            "Access token to the Tezos Meet & Greet in Paris Dec 14, 2022",
        },
      },
      balance: "1",
      transfersCount: 1,
      firstLevel: 1652541,
      firstTime: "2022-12-12T16:49:40Z",
      lastLevel: 1652541,
      lastTime: "2022-12-12T16:49:40Z",
    },
    {
      id: 82705170563073,
      account: {
        address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      },
      token: {
        id: 82704303390721,
        contract: {
          address: "KT18f225bFCeTt1AHLT5n7gTf3a8wv7iyEYC",
        },
        tokenId: "2",
        standard: "fa2",
        totalSupply: "210",
        metadata: {
          name: "Tezos Meet & Greet Access Token",
          formats: [
            {
              uri: "ipfs://QmXfLqzV28TfSpps1UFZo94NMsyYdnrxDNffdQsYPMr53t/image.png",
              fileName: "Umami NFT.png",
              fileSize: "51567",
              mimeType: "image/png",
            },
          ],
          decimals: "0",
          attributes: [
            {
              name: "alt_text",
              value:
                "Access token to the Tezos Meet & Greet in Paris Dec 14, 2022",
            },
          ],
          displayUri:
            "ipfs://QmXfLqzV28TfSpps1UFZo94NMsyYdnrxDNffdQsYPMr53t/image.png",
          artifactUri:
            "ipfs://QmXfLqzV28TfSpps1UFZo94NMsyYdnrxDNffdQsYPMr53t/image.png",
          description:
            "Access token to the Tezos Meet & Greet in Paris Dec 14, 2022",
        },
      },
      balance: "1",
      transfersCount: 1,
      firstLevel: 1652615,
      firstTime: "2022-12-12T17:08:30Z",
      lastLevel: 1652615,
      lastTime: "2022-12-12T17:08:30Z",
    },
    {
      id: 100437210431489,
      account: {
        address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      },
      token: {
        id: 99966347378689,
        contract: {
          address: "KT1QhxBa4fep4vgyiB4MtjjqMdo21QHj2haG",
        },
        tokenId: "2",
        standard: "fa2",
        totalSupply: "50",
        metadata: {
          name: "Paris Tezos Meetup Access Token",
          formats: [
            {
              uri: "ipfs://bafybeicet3ixylrqrn3mrxlbqiusznrsubr5qxyu7y3d64ewyvwohwa25a/image.png",
              fileName: "fileName",
              fileSize: "107195",
              mimeType: "image/png",
            },
          ],
          decimals: "0",
          attributes: [
            {
              name: "alt_text",
              value:
                "This token will give you access to the event held at Nomadic Labs in Paris, 2 March 2023. Show this token in your Umami wallet for us to scan at the entry point.",
            },
          ],
          displayUri:
            "ipfs://bafybeicet3ixylrqrn3mrxlbqiusznrsubr5qxyu7y3d64ewyvwohwa25a/image.png",
          artifactUri:
            "ipfs://bafybeicet3ixylrqrn3mrxlbqiusznrsubr5qxyu7y3d64ewyvwohwa25a/image.png",
          description:
            "This token will give you access to the event held at Nomadic Labs in Paris, 2 March 2023. Show this token in your Umami wallet for us to scan at the entry point.",
        },
      },
      balance: "1",
      transfersCount: 1,
      firstLevel: 2002439,
      firstTime: "2023-02-17T10:31:25Z",
      lastLevel: 2002439,
      lastTime: "2023-02-17T10:31:25Z",
    },
  ];

export const getTransacionsResult: TezTransfer[] = [
  {
    type: "transaction",
    id: 109810172297216,
    level: 2214204,
    timestamp: "2023-03-27T10:36:40Z",
    block: "BKyZ7dksWdf6sFcnWnwvS5FgQ8JgEMFxg3SsL1bWR3FBz5mSAX3",
    hash: "oo3Moa2XToLeCjiVhQFHWe3aJkFtqbbW2GKvG9Zvb5aZLs6tHWZ",
    counter: 10304021,
    sender: {
      address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
    },
    gasLimit: 1101,
    gasUsed: 1001,
    storageLimit: 0,
    storageUsed: 0,
    bakerFee: 403,
    storageFee: 0,
    allocationFee: 0,
    target: {
      address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
    },
    amount: 6410000,
    status: "applied",
    hasInternals: false,
  },
  {
    type: "transaction",
    id: 109783351820288,
    level: 2213611,
    timestamp: "2023-03-27T08:47:30Z",
    block: "BM4xPHaLWYYw2KLwQrpUYjMYf1eN1mqfjtCEYUCgFpuyAd6u5cH",
    hash: "ooZCfnsMgXvxni6umn999MKfpT6zmVJpDzZmmCCh6AZ89gvUHGM",
    counter: 134162,
    sender: {
      address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
    },
    gasLimit: 1101,
    gasUsed: 1001,
    storageLimit: 0,
    storageUsed: 0,
    bakerFee: 402,
    storageFee: 0,
    allocationFee: 0,
    target: {
      address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
    },
    amount: 2400000,
    status: "applied",
    hasInternals: false,
  },
  {
    type: "transaction",
    id: 109510819577856,
    level: 2207631,
    timestamp: "2023-03-26T14:34:47Z",
    block: "BKiv7G5finLJJLkP3T97vPnk95ZVrLLFURVzTeM6RqoSMKFq9N8",
    hash: "op9pGAxiJtPcv37KRnLWhYBDx2RRhTiBeTZNsKQAQ1Pxn8AsbUC",
    counter: 10304020,
    sender: {
      address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
    },
    gasLimit: 3656,
    gasUsed: 3556,
    storageLimit: 67,
    storageUsed: 67,
    bakerFee: 771,
    storageFee: 16750,
    allocationFee: 0,
    target: {
      address: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
    },
    targetCodeHash: 1095391981,
    amount: 0,
    parameter: {
      entrypoint: "transfer",
      value: [
        {
          txs: [
            {
              to_: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
              amount: "1",
              token_id: "6",
            },
          ],
          from_: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        },
      ],
    },
    status: "applied",
    hasInternals: false,
    tokenTransfersCount: 1,
  },
];

export const getTokenTransactionsResult: TokenTransfer[] = [
  {
    id: 109855847219201,
    level: 2215201,
    timestamp: "2023-03-27T13:30:37Z",
    token: {
      id: 10897625972737,
      contract: {
        address: "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe",
      },
      tokenId: "0",
      standard: "fa1.2",
      totalSupply: "13000000",
    },
    from: {
      address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
    },
    to: {
      address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
    },
    amount: "27400",
    transactionId: 109855847219200,
  },
  {
    id: 109855493849090,
    level: 2215193,
    timestamp: "2023-03-27T13:29:22Z",
    token: {
      id: 10898231001089,
      contract: {
        address: "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
      },
      tokenId: "1",
      standard: "fa2",
      totalSupply: "13000000000",
      metadata: {
        name: "Klondike3",
        symbol: "KL3",
        decimals: "5",
      },
    },
    from: {
      address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
    },
    to: {
      address: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
    },
    amount: "451000",
    transactionId: 109855493849088,
  },
  {
    id: 109855131041793,
    level: 2215185,
    timestamp: "2023-03-27T13:27:13Z",
    token: {
      id: 10898231001089,
      contract: {
        address: "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
      },
      tokenId: "1",
      standard: "fa2",
      totalSupply: "13000000000",
      metadata: {
        name: "Klondike3",
        symbol: "KL3",
        decimals: "5",
      },
    },
    from: {
      address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
    },
    to: {
      address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
    },
    amount: "716850",
    transactionId: 109855131041792,
  },
  {
    id: 109854457856001,
    level: 2215172,
    timestamp: "2023-03-27T13:24:48Z",
    token: {
      id: 10899580518401,
      contract: {
        address: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
      },
      tokenId: "6",
      standard: "fa2",
      totalSupply: "1",
      metadata: {
        name: "Tezzardz #24",
        rights: "© 2021 George Goodwin. All rights reserved.",
        symbol: "FKR",
        formats: [
          {
            uri: "ipfs://zdj7Wkn6y1DRrfJ3A1NEyxj1Sw2b39ZjggDPe9FEe7DGtNqoC",
            mimeType: "image/png",
          },
        ],
        creators: ["George Goodwin (@omgidrawedit)"],
        decimals: "0",
        royalties: {
          shares: {
            tz1LLPWMyZ7gKsp3WnLfemyAYW6CoZoozku5: "5",
          },
          decimals: "2",
        },
        attributes: [
          {
            name: "Background",
            value: "Pink",
          },
          {
            name: "Skin",
            value: "White",
          },
          {
            name: "Skin Pattern",
            value: "Bolt",
          },
          {
            name: "Clothing",
            value: "Rainbow Onesie",
          },
          {
            name: "Headwear",
            value: "Backwards Cap",
          },
          {
            name: "Bling Level",
            value: "$$$",
          },
          {
            name: "Face",
            value: "Bent Tongue Feisty",
          },
        ],
        displayUri: "ipfs://zdj7WWXMC8RpzC6RkR2DXtD2zcfLc2QWu6tu7f6vnkeeUvSoh",
        artifactUri: "ipfs://zdj7Wkn6y1DRrfJ3A1NEyxj1Sw2b39ZjggDPe9FEe7DGtNqoC",
        description:
          "Tezzardz is a collection of 4,200 programmatically, randomly generated, snazzy little fukrs on the Tezos blockchain.",
        thumbnailUri:
          "ipfs://zb2rhfbacgmTnG13DiCvjs6J21hzMeAueYVWg37C5owThnpfQ",
      },
    },
    from: {
      address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
    },
    to: {
      address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
    },
    amount: "1",
    transactionId: 109854457856000,
  },
  {
    id: 109817445220353,
    level: 2214369,
    timestamp: "2023-03-27T11:06:40Z",
    token: {
      id: 10899580518401,
      contract: {
        address: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
      },
      tokenId: "6",
      standard: "fa2",
      totalSupply: "1",
      metadata: {
        name: "Tezzardz #24",
        rights: "© 2021 George Goodwin. All rights reserved.",
        symbol: "FKR",
        formats: [
          {
            uri: "ipfs://zdj7Wkn6y1DRrfJ3A1NEyxj1Sw2b39ZjggDPe9FEe7DGtNqoC",
            mimeType: "image/png",
          },
        ],
        creators: ["George Goodwin (@omgidrawedit)"],
        decimals: "0",
        royalties: {
          shares: {
            tz1LLPWMyZ7gKsp3WnLfemyAYW6CoZoozku5: "5",
          },
          decimals: "2",
        },
        attributes: [
          {
            name: "Background",
            value: "Pink",
          },
          {
            name: "Skin",
            value: "White",
          },
          {
            name: "Skin Pattern",
            value: "Bolt",
          },
          {
            name: "Clothing",
            value: "Rainbow Onesie",
          },
          {
            name: "Headwear",
            value: "Backwards Cap",
          },
          {
            name: "Bling Level",
            value: "$$$",
          },
          {
            name: "Face",
            value: "Bent Tongue Feisty",
          },
        ],
        displayUri: "ipfs://zdj7WWXMC8RpzC6RkR2DXtD2zcfLc2QWu6tu7f6vnkeeUvSoh",
        artifactUri: "ipfs://zdj7Wkn6y1DRrfJ3A1NEyxj1Sw2b39ZjggDPe9FEe7DGtNqoC",
        description:
          "Tezzardz is a collection of 4,200 programmatically, randomly generated, snazzy little fukrs on the Tezos blockchain.",
        thumbnailUri:
          "ipfs://zb2rhfbacgmTnG13DiCvjs6J21hzMeAueYVWg37C5owThnpfQ",
      },
    },
    from: {
      address: "tz1W5iRhKWPoLviqExtDDKJqCcPRLBWMhg6S",
    },
    to: {
      address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
    },
    amount: "1",
    transactionId: 109817445220352,
  },
  {
    id: 109511935262721,
    level: 2207656,
    timestamp: "2023-03-26T14:38:48Z",
    token: {
      id: 10898194300929,
      contract: {
        address: "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
      },
      tokenId: "0",
      standard: "fa2",
      totalSupply: "13000000000",
      metadata: {
        name: "Klondike2",
        symbol: "KL2",
        decimals: "5",
      },
    },
    from: {
      address: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
    },
    to: {
      address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
    },
    amount: "210000",
    transactionId: 109511935262720,
  },
  {
    id: 109510819577858,
    level: 2207631,
    timestamp: "2023-03-26T14:34:47Z",
    token: {
      id: 10899580518401,
      contract: {
        address: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
      },
      tokenId: "6",
      standard: "fa2",
      totalSupply: "1",
      metadata: {
        name: "Tezzardz #24",
        rights: "© 2021 George Goodwin. All rights reserved.",
        symbol: "FKR",
        formats: [
          {
            uri: "ipfs://zdj7Wkn6y1DRrfJ3A1NEyxj1Sw2b39ZjggDPe9FEe7DGtNqoC",
            mimeType: "image/png",
          },
        ],
        creators: ["George Goodwin (@omgidrawedit)"],
        decimals: "0",
        royalties: {
          shares: {
            tz1LLPWMyZ7gKsp3WnLfemyAYW6CoZoozku5: "5",
          },
          decimals: "2",
        },
        attributes: [
          {
            name: "Background",
            value: "Pink",
          },
          {
            name: "Skin",
            value: "White",
          },
          {
            name: "Skin Pattern",
            value: "Bolt",
          },
          {
            name: "Clothing",
            value: "Rainbow Onesie",
          },
          {
            name: "Headwear",
            value: "Backwards Cap",
          },
          {
            name: "Bling Level",
            value: "$$$",
          },
          {
            name: "Face",
            value: "Bent Tongue Feisty",
          },
        ],
        displayUri: "ipfs://zdj7WWXMC8RpzC6RkR2DXtD2zcfLc2QWu6tu7f6vnkeeUvSoh",
        artifactUri: "ipfs://zdj7Wkn6y1DRrfJ3A1NEyxj1Sw2b39ZjggDPe9FEe7DGtNqoC",
        description:
          "Tezzardz is a collection of 4,200 programmatically, randomly generated, snazzy little fukrs on the Tezos blockchain.",
        thumbnailUri:
          "ipfs://zb2rhfbacgmTnG13DiCvjs6J21hzMeAueYVWg37C5owThnpfQ",
      },
    },
    from: {
      address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
    },
    to: {
      address: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
    },
    amount: "1",
    transactionId: 109510819577856,
  },
];

export const ghostMultisigContracts = [
  {
    id: 533705,
    type: "contract",
    address: "KT1Mqvf7bnYe4Ty2n7ZbGkdbebCd4WoTJUUp",
    kind: "smart_contract",
    balance: 0,
    creator: { address: "tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3" },
    numContracts: 0,
    activeTokensCount: 0,
    tokensCount: 0,
    tokenBalancesCount: 0,
    tokenTransfersCount: 0,
    numDelegations: 0,
    numOriginations: 1,
    numTransactions: 0,
    numReveals: 0,
    numMigrations: 0,
    transferTicketCount: 0,
    increasePaidStorageCount: 0,
    eventsCount: 0,
    firstActivity: 1636117,
    firstActivityTime: "2022-12-09T16:49:25Z",
    lastActivity: 1636117,
    lastActivityTime: "2022-12-09T16:49:25Z",
    storage: {
      owner: "tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3",
      signers: [
        "tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3",
        "tz1dyX3B1CFYa2DfdFLyPtiJCfQRUgPVME6E",
      ],
      metadata: 216412,
      threshold: "1",
      last_op_id: "0",
      pending_ops: 216411,
    },
    typeHash: 1963879877,
    codeHash: -1890025422,
  },
  {
    id: 536908,
    type: "contract",
    address: "KT1VwWbTMRN5uX4bfxCcpJnPP6iAhboqhGZr",
    kind: "smart_contract",
    balance: 0,
    creator: { address: "tz1dyX3B1CFYa2DfdFLyPtiJCfQRUgPVME6E" },
    numContracts: 0,
    activeTokensCount: 0,
    tokensCount: 0,
    tokenBalancesCount: 0,
    tokenTransfersCount: 0,
    numDelegations: 0,
    numOriginations: 1,
    numTransactions: 0,
    numReveals: 0,
    numMigrations: 0,
    transferTicketCount: 0,
    increasePaidStorageCount: 0,
    eventsCount: 0,
    firstActivity: 1667087,
    firstActivityTime: "2022-12-15T16:49:45Z",
    lastActivity: 1667087,
    lastActivityTime: "2022-12-15T16:49:45Z",
    storage: {
      owner: "tz1dyX3B1CFYa2DfdFLyPtiJCfQRUgPVME6E",
      signers: [
        "tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3",
        "tz1VTfGqp34NypRQJmjNiPrCTG5TRonevsmf",
        "tz1g2pCYFonfHXqjNCJNnGRy6MamDPdon4oS",
      ],
      metadata: 219459,
      threshold: "2",
      last_op_id: "0",
      pending_ops: 219458,
    },
    typeHash: 1963879877,
    codeHash: -1890025422,
  },
  {
    id: 537023,
    type: "contract",
    address: "KT1Vdhz4izz7LASWU4tTLu3GBsvhJ8ULSi3G",
    kind: "smart_contract",
    balance: 0,
    creator: { address: "tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3" },
    numContracts: 0,
    activeTokensCount: 0,
    tokensCount: 0,
    tokenBalancesCount: 0,
    tokenTransfersCount: 0,
    numDelegations: 0,
    numOriginations: 1,
    numTransactions: 0,
    numReveals: 0,
    numMigrations: 0,
    transferTicketCount: 0,
    increasePaidStorageCount: 0,
    eventsCount: 0,
    firstActivity: 1668011,
    firstActivityTime: "2022-12-15T21:21:20Z",
    lastActivity: 1668011,
    lastActivityTime: "2022-12-15T21:21:20Z",
    storage: {
      owner: "tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3",
      signers: [
        "tz1RVPjF88wjiZ7JhxvmLPRm6TTR9MHPAFPd",
        "tz1ajzeMEzKxM9H4keBxoD1JSQy3iGRoHPg5",
      ],
      metadata: 219536,
      threshold: "1",
      last_op_id: "0",
      pending_ops: 219535,
    },
    typeHash: 1963879877,
    codeHash: -1890025422,
  },
];
