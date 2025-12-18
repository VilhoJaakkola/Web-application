import { z } from 'zod';
import { router, publicProcedure } from '../db/trpc';
import { id } from 'zod/v4/locales';

export const usersRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.selectFrom('users').selectAll().execute();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', input.id)
        .executeTakeFirst();
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insertInto('users')
        .values(input)
        .returningAll()
        .executeTakeFirst();
    }),
});
