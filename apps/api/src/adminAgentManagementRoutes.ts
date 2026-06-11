import type { Express } from "express";
import { registerBuiltinAdminAgentRoutes } from "./adminBuiltinAgentRoutes.js";
import { registerAdminAgentExtrasRoutes } from "./adminAgentExtrasRoutes.js";

export function registerAdminAgentManagementRoutes(app: Express) {
  registerBuiltinAdminAgentRoutes(app);
  registerAdminAgentExtrasRoutes(app);
}
