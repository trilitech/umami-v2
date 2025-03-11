import express from 'express';
import { getRegistrationOptions, verifyRegistration } from './passkey/registration';
import cors from 'cors';
import { RegistrationResponseJSON, verifyBody } from './passkey/types';
import { getAuthenticationOptions, verifyAuthentication } from './passkey/authentication';
import { AuthenticationResponseJSON } from '@simplewebauthn/server';
import {db} from './passkey/db';
const app = express();
const router = express.Router()
app.use('/api', router);
router.use(express.json());
router.use(cors())
const port = 3000;

router.post('/generate-registration-options', async (req, res) => {
  try {
    const userName = req.body?.userName as string;
    if (!userName) {
      res.status(400).send('userName is required');
      return;
    }
    const options = await getRegistrationOptions(userName);
    res.json(options);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

router.post('/verify-registration', async (req, res) => {
  try {
  const response = req.body as verifyBody;
  const {verified, publicKey } = await verifyRegistration(response);
    res.json({verified, publicKey});
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

router.post('/generate-authentication-options', async (req, res) => {
  try {
    const userName = req.body?.userName as string;
    if (!userName) {
      res.status(400).send('userName is required');
      return;
    }
    const options = await getAuthenticationOptions(userName);
    res.json(options);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

router.post('/verify-authentication', async (req, res) => {
  try {
    const response = req.body as AuthenticationResponseJSON;
    const { verified, publicKey, passkeyId, passkeyPublicKey} = await verifyAuthentication(123, response);
    res.json({ verified, publicKey, passkeyId, passkeyPublicKey });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});