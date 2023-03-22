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
