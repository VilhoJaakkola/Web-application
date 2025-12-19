import { z } from 'zod';
import { router, publicProcedure } from '..';
import type { NewUser } from '../../db/types';
import { TRPCError } from '@trpc/server';

export const usersRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.selectFrom('users').selectAll().execute();
  }),

  getById: publicProcedure.input(z.uuidv7()).query(async ({ ctx, input }) => {
    const user = await ctx.db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', input)
      .executeTakeFirst();

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }
    return user;
  }),

  create: publicProcedure
    .input(
      z.object({
        first_name: z.string().min(1),
        last_name: z.string().min(1),
        email: z.email(),
        password_hash: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newUser: NewUser = {
        ...input,
        password_hash: input.password_hash, // Hashing should be done before calling this
      };
      return await ctx.db
        .insertInto('users')
        .values(newUser)
        .returningAll()
        .executeTakeFirstOrThrow();
    }),
});
