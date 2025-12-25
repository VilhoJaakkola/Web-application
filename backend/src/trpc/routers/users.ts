import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '..';
import type { User, NewUser, UserUpdate } from '../../db/types';
import {
  insertUserSchema,
  updateUserSchema,
  userIdSchema,
} from '../../db/schemas';

export const usersRouter = router({
  getAll: publicProcedure.query(async ({ ctx }): Promise<User[]> => {
    return await ctx.db.selectFrom('users').selectAll().execute();
  }),

  getById: publicProcedure
    .input(z.uuidv7())
    .query(async ({ ctx, input }): Promise<User> => {
      const user: User | undefined = await ctx.db
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
    .input(insertUserSchema)
    .mutation(async ({ ctx, input }): Promise<User> => {
      const newUser: NewUser = {
        ...input // Hashing should be done before calling this
      };

      return await ctx.db
        .insertInto('users')
        .values(newUser)
        .returningAll()
        .executeTakeFirstOrThrow();
    }),

  update: publicProcedure
    .input(
      z.object({
        id: userIdSchema,
        data: updateUserSchema,
      }),
    )
    .mutation(async ({ ctx, input }): Promise<User> => {
      const userUpdate: UserUpdate = input.data;

      const updatedUser = await ctx.db
        .updateTable('users')
        .set(userUpdate)
        .where('id', '=', input.id)
        .returningAll()
        .executeTakeFirst();

      if (!updatedUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found for update',
        });
      }
      return updatedUser;
    }),

  delete: publicProcedure
    .input(z.uuidv7())
    .mutation(async ({ ctx, input }): Promise<User> => {
      const result = await ctx.db
        .deleteFrom('users')
        .where('id', '=', input)
        .returningAll()
        .executeTakeFirst();

      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found for deletion',
        });
      }

      return result;
    }),
});
