import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

import type { Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        // custom errors here
        code: error.code,
      },
    };
  },
});

export const { router } = t;
export const publicProcedure = t.procedure;

/*
// Example of an authenticated procedure
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

  export const middleware = t.middleware;
  export const mergeRouters = t.mergeRouters;
*/
