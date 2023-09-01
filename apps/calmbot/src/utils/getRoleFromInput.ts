import { Role, RoleManager } from "discord.js";

type InputTypes = "ROLE_ID" | "ROLE_MENTION";

export default (roles: RoleManager["cache"], input: string, allowedInputTypes: InputTypes[] = ["ROLE_ID", "ROLE_MENTION"]): Role | undefined => {
  let id = input;
  if (allowedInputTypes.includes("ROLE_MENTION") && id.startsWith("<@&") && id.endsWith(">")) id = id.slice(3, -1);
  return roles.get(id);
};
