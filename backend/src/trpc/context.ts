import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

import { db } from '../db';

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  // const token = req.headers.authorization?.split(' ')[1];
  // const userId = await verifyToken(token);

  return {
    db,
    req,
    res,
    // userId: undefined as string | undefined,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
