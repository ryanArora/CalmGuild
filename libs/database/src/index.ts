import type { User as PrismaUser, RoleType as PrismaRoleType, ChannelType as PrismaChannelType } from "@prisma/client";

export * from "./lib/database";

export type User = PrismaUser;
export type RoleType = PrismaRoleType;
export type ChannelType = PrismaChannelType;
