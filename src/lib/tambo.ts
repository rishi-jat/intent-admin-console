/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * INTENT-DRIVEN ADMIN CONSOLE
 * ---------------------------
 * This configuration registers admin console components and tools for:
 * 1. Deployment monitoring
 * 2. Deployment failures
 * 3. Operational approvals
 * 4. System health overview
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { adminComponents } from "@/tambo/components";
import {
  getDeployments,
  getDeploymentsInputSchema,
  getFailedDeployments,
  getFailedDeploymentsInputSchema,
  getPendingApprovals,
  getPendingApprovalsInputSchema,
  getSystemHealth,
  getSystemHealthInputSchema,
  getDeploymentActions,
  getDeploymentActionsInputSchema,
  retryDeployment,
  retryDeploymentInputSchema,
} from "@/tambo/tools";
import {
  deploymentSchema,
  approvalSchema,
  systemHealthSchema,
  actionSchema,
} from "@/components/admin";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * tools
 *
 * Admin console tools for fetching deployment, approval, and system health data.
 * Each tool has explicit input/output schemas for type safety.
 */
export const tools: TamboTool[] = [
  {
    name: "getDeployments",
    description:
      "Fetch deployment history with optional filtering by status and environment. Returns an array of deployments sorted by timestamp (most recent first).",
    tool: getDeployments,
    inputSchema: getDeploymentsInputSchema,
    outputSchema: z.array(deploymentSchema),
  },
  {
    name: "getFailedDeployments",
    description:
      "Fetch only failed deployments. Use this when the user specifically asks about deployment failures or errors. Returns failed deployments sorted by timestamp.",
    tool: getFailedDeployments,
    inputSchema: getFailedDeploymentsInputSchema,
    outputSchema: z.array(deploymentSchema),
  },
  {
    name: "getPendingApprovals",
    description:
      "Fetch pending approval requests with optional filtering by type and priority. Returns approvals sorted by priority (critical first) then by timestamp.",
    tool: getPendingApprovals,
    inputSchema: getPendingApprovalsInputSchema,
    outputSchema: z.array(approvalSchema),
  },
  {
    name: "getSystemHealth",
    description:
      "Fetch current health status of all services. Returns health data including uptime, latency, and error rates for each service.",
    tool: getSystemHealth,
    inputSchema: getSystemHealthInputSchema,
    outputSchema: z.array(systemHealthSchema),
  },
  {
    name: "getDeploymentActions",
    description:
      "Get available actions for a specific deployment based on its current status. Use this when showing the ActionPanel alongside deployments.",
    tool: getDeploymentActions,
    inputSchema: getDeploymentActionsInputSchema,
    outputSchema: z.object({
      deploymentId: z.string(),
      serviceName: z.string(),
      actions: z.array(actionSchema),
    }),
  },
  {
    name: "retryDeployment",
    description:
      "Retry a failed deployment. Use this when the user wants to retry a specific failed deployment. Returns the new status and confirmation message.",
    tool: retryDeployment,
    inputSchema: retryDeploymentInputSchema,
    outputSchema: z.object({
      success: z.boolean(),
      deploymentId: z.string(),
      serviceName: z.string(),
      previousStatus: z.enum(["failed", "cancelled"]),
      newStatus: z.literal("in_progress"),
      message: z.string(),
      estimatedDuration: z.number(),
      retryTimestamp: z.string(),
    }),
  },
];

/**
 * components
 *
 * Admin console UI components for deployment monitoring, approvals, and system health.
 * All components are imported from the centralized admin components registry.
 */
export const components: TamboComponent[] = adminComponents;
