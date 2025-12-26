import type { User } from '../db/types';

export type SafeUser = Omit<User, 'password_hash'>;

export const sanitizeUser = (user: User): SafeUser => {
  const { password_hash, ...safeUser } = user;
  return safeUser;
};

export const sanitizeUsers = (users: User[]): SafeUser[] => {
  return users.map(sanitizeUser);
};
