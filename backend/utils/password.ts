import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hashes a plain-text password using bcrypt.
 */
export const hashPassword = async (plain: string): Promise<string> => {
  return bcrypt.hash(plain, SALT_ROUNDS);
};

/**
 * Compares a plain-text password with a bcrypt hash.
 */
export const comparePassword = async (
  plain: string,
  hashed: string
): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};
