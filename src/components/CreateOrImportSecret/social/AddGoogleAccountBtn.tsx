import { GoogleAuth } from "../../../GoogleAuth";
import { getPkAndPkhFromSk } from "../../../utils/tezos";

const AddGoogleAccountBtn = ({
  onSubmit,
}: {
  onSubmit: (pk: string, pkh: string) => void;
}) => {
  return (
    <GoogleAuth
      width="100%"
      onReceiveSk={async (sk) => {
        const { pk, pkh } = await getPkAndPkhFromSk(sk);
        onSubmit(pk, pkh);
      }}
    />
  );
};

export default AddGoogleAccountBtn;
