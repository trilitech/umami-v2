import { z } from "zod";

export const parsePeerInfo = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  publicKey: z.string(),
  version: z.string(),
  icon: z.string().optional(),
  relayServer: z.string().optional(),
}).parse;
