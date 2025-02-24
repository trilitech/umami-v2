import { ethers } from "ethers";
import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';


const ETHERLINK_RPC_URL = "https://node.ghostnet.etherlink.com";
const etherlinkProvider = new ethers.JsonRpcProvider(ETHERLINK_RPC_URL);

const TEZOS_RPC_URL = "https://ghostnet.tezos.marigold.dev";
const tezosToolkit = new TezosToolkit(TEZOS_RPC_URL);
const beaconWallet = new BeaconWallet({ name: "Etherlink Bridge" });
tezosToolkit.setWalletProvider(beaconWallet);

const testFetchRPC = async () => {
  console.log("🔍 Fetch test started...");
  try {
    const response = await fetch(ETHERLINK_RPC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 1,
      }),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    console.log("✅ Fetch success! Block Number:", parseInt(data.result, 16));
  } catch (error) {
    console.error("❌ Fetch failed:", error);
  }
};

const checkNetwork = async () => {
  console.log("🔍 Checking Etherlink network connection...");
  try {
    const network = await etherlinkProvider.getNetwork();
    console.log("✅ Connected to Etherlink network:", network);
  } catch (error) {
    console.error("❌ Network detection failed:", error);
  }
};

export const getLatestBlock = async () => {
  console.log("🔍 Fetching latest block...");
  try {
    const blockNumber = await etherlinkProvider.getBlockNumber();
    console.log("✅ Latest Block:", blockNumber);
    return blockNumber;
  } catch (error) {
    console.error("❌ Block fetch failed:", error);
    return null;
  }
};

export const bridgeXTZToEtherlink = async (amountXTZ: string, etherlinkAddress: string) => {
  try {
    console.log(`🔄 Bridging ${amountXTZ} XTZ from Tezos to Etherlink...`);

    await beaconWallet.requestPermissions({ network: { type: 'ghostnet' as unknown as any } });

    const operation = await tezosToolkit.wallet
      .transfer({
        to: etherlinkAddress,
        amount: parseFloat(amountXTZ),
      })
      .send();

    console.log("🔗 Bridge transaction sent! Waiting for confirmation...");
    await operation.confirmation();
    console.log("✅ XTZ successfully bridged to Etherlink!");

    return operation.opHash;
  } catch (error) {
    console.error("❌ Bridging XTZ to Etherlink failed:", error);
    return null;
  }
};

export const sendEtherlinkFunds = async (
  privateKey: string,
  recipient: string,
  amountXTZ: string
): Promise<string | null> => {
  try {
    console.log("🔍 Preparing transaction on Etherlink...");

    const wallet = new ethers.Wallet(privateKey, etherlinkProvider);
    console.log("wallet", wallet);

    const tx = await wallet.sendTransaction({
      to: recipient,
      value: ethers.parseEther(amountXTZ),
    });

    console.log("🔗 Transaction sent! Waiting for confirmation...");
    await tx.wait();

    console.log("✅ Transaction confirmed! Hash:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("❌ Transaction failed:", error);
    return null;
  }
};

export const generateEtherlinkWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  console.log("🆕 Etherlink Wallet Created!");
  console.log("🔹 Address:", wallet.address);
  console.log("🔑 Private Key:", wallet.privateKey);
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
};

console.log("🚀 Running Etherlink Tests...");
testFetchRPC();
checkNetwork();
getLatestBlock();
