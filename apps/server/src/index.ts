import express from 'express';
import { getConfig } from './passkey/registration';
import cors from 'cors';
import { RegistrationResponseJSON, verifyBody } from './passkey/types';
import { verify } from './passkey/verification';

const app = express();
const router = express.Router()
app.use('/api', router);
router.use(express.json());
router.use(cors())
const port = 3000;

router.post('/register', async (req, res) => {
  const userName = req.body?.userName as string;
  console.log(req.body);
  if (!userName) {
    res.status(400).send('userName is required');
    return;
  }
  const config = await getConfig(userName);
  res.json(config);
});
router.post('/verify-registration', async (req, res) => {
  const response = req.body as verifyBody;
  const verified = await verify(response);
  res.json({verified});
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});