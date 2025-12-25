import { z } from 'zod';

export const insertUserSchema = z.object({
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  email: z.email(),
  password_hash: z.string().min(60).max(255),
})

export const updateUserSchema = z.object({
  first_name: z.string().min(1).max(50).optional(),
  last_name: z.string().min(1).max(50).optional(),
  email: z.email().optional(),
  password_hash: z.string().min(60).max(255).optional(),
})

export const userIdSchema = z.uuidv7();