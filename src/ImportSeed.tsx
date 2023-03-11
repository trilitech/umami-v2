import "./App.css";
// @ts-ignore
// import crypto from "crypto-browserify";
// window.Buffer = Buffer;
import { restoreAccount } from "./utils/restoreAccounts";

const seedPhrase =
  "glory city income swallow act garment novel fringe bread chaos club dolphin when live penalty mirror donate razor dad eyebrow powder trumpet bunker wine";

const restore = async () => {
  console.log(await restoreAccount(seedPhrase));
};

function ImportSeed() {
  return (
    <div>
      <p>Enter seed phrase</p>
      <textarea />
      <br />
      <button onClick={(_) => restore()} title="Restore accounts">
        "Restore accounts"
      </button>
    </div>
  );
}

export default ImportSeed;
