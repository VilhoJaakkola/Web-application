import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '..';
import { hashPassword } from '../../utils/hash';
import { updateUserSchema, userIdSchema, insertUserSchema } from '../../db/schemas';
import type { User, NewUser, UserUpdate } from '../../db/types';
import { type SafeUser, sanitizeUser, sanitizeUsers } from '../../utils/user';

export const usersRouter = router({
  getAll: publicProcedure.query(async ({ ctx }): Promise<SafeUser[]> => {
    return sanitizeUsers(await ctx.db.selectFrom('users').selectAll().execute());
  }),

  getById: publicProcedure.input(userIdSchema).query(async ({ ctx, input }): Promise<SafeUser> => {
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
    return sanitizeUser(user);
  }),

  create: publicProcedure
    .input(insertUserSchema)
    .mutation(async ({ ctx, input }): Promise<SafeUser> => {
      const password_hash = await hashPassword(input.password);
      const newUser: NewUser = {
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
        password_hash,
      };

      const user = await ctx.db
        .insertInto('users')
        .values(newUser)
        .returningAll()
        .executeTakeFirstOrThrow();

      return sanitizeUser(user);
    }),

  update: publicProcedure
    .input(
      z.object({
        id: userIdSchema,
        data: updateUserSchema,
      }),
    )
    .mutation(async ({ ctx, input }): Promise<SafeUser> => {
      const { password, ...restData } = input.data;

      const userUpdate: UserUpdate = password
        ? {
            ...restData,
            password_hash: await hashPassword(password),
          }
        : restData;

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
      return sanitizeUser(updatedUser);
    }),

  delete: publicProcedure
    .input(userIdSchema)
    .mutation(async ({ ctx, input }): Promise<SafeUser> => {
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

      return sanitizeUser(result);
    }),
});
