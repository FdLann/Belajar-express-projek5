import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const findById = (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const findByEmail = (email) => {
  return prisma.user.findUnique({ where: { email } });
};

export const create = (data) => {
  return prisma.user.create({ data });
};

export const update = (id, data) => {
  return prisma.user.update({ where: { id }, data });
};
export const remove = (id) => {
  return prisma.user.delete({ where: { id } });
};

// Khusus refresh token
export const updateRefreshToken = (id, token) =>
  prisma.user.update({
    where: { id },
    data: { refreshToken: token },
  });

export const findByRefreshToken = (token) =>
  prisma.user.findFirst({
    where: { refreshToken: token },
  });
