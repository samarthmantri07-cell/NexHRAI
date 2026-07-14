import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import type { RegisterInput, LoginInput } from '../validators/auth.validator';

const DEFAULT_ROLE_NAME = 'Employee';

// ─── Private Helpers ────────────────────────────────────────────────────────

/**
 * Ensures the default role exists in the database and returns its id.
 */
const ensureDefaultRole = async (): Promise<{ id: string; name: string }> => {
  const role = await prisma.role.upsert({
    where: { name: DEFAULT_ROLE_NAME },
    update: {},
    create: {
      name: DEFAULT_ROLE_NAME,
      description: 'Default role for registered users',
    },
  });
  return role;
};

// ─── Public Auth Service ─────────────────────────────────────────────────────

export const registerUser = async (data: RegisterInput) => {
  // Check if email is already taken
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    const error = new Error('An account with this email already exists.');
    (error as any).statusCode = 409;
    throw error;
  }

  const role = await ensureDefaultRole();
  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      roleId: role.id,
    },
    include: { role: true },
  });

  const token = signToken({
    userId: user.id,
    email: user.email,
    roleId: user.roleId,
    roleName: user.role.name,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role.name,
    },
  };
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: { role: true },
  });

  if (!user) {
    const error = new Error('Invalid email or password.');
    (error as any).statusCode = 401;
    throw error;
  }

  const isPasswordValid = await comparePassword(data.password, user.passwordHash);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password.');
    (error as any).statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('Your account has been deactivated. Contact support.');
    (error as any).statusCode = 403;
    throw error;
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    roleId: user.roleId,
    roleName: user.role.name,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role.name,
    },
  };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isActive: true,
      createdAt: true,
      role: { select: { name: true } },
    },
  });

  if (!user) {
    const error = new Error('User not found.');
    (error as any).statusCode = 404;
    throw error;
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role.name,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
};
