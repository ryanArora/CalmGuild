import type { User as PrismaUser, Member as PrismaMember, RoleType as PrismaRoleType, ChannelType as PrismaChannelType, SkullboardMessage as PrismaSkullboardMessageType } from "@prisma/client";

export * from "./lib/database";
export * from "@prisma/client";

export type User = PrismaUser;
export type Member = PrismaMember;
export type RoleType = PrismaRoleType;
export type ChannelType = PrismaChannelType;
export type SkullboardMessage = PrismaSkullboardMessageType;
