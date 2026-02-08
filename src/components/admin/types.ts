/**
 * @file types.ts
 * @description Shared types and schemas for admin console components
 *
 * All component props are validated with Zod schemas to ensure type safety
 * and prevent malformed data from being rendered.
 */

import { z } from "zod";

// -----------------------------------------------------------------------------
// Deployment Types
// -----------------------------------------------------------------------------

export const deploymentStatusSchema = z.enum([
  "success",
  "failed",
  "in_progress",
  "pending",
  "cancelled",
]);

export type DeploymentStatus = z.infer<typeof deploymentStatusSchema>;

export const deploymentSchema = z.object({
  id: z.string().describe("Unique deployment identifier"),
  serviceName: z.string().describe("Name of the deployed service"),
  environment: z
    .enum(["production", "staging", "development"])
    .describe("Deployment environment"),
  status: deploymentStatusSchema.describe("Current deployment status"),
  version: z.string().describe("Deployed version (e.g., v1.2.3)"),
  timestamp: z.string().describe("ISO 8601 timestamp of deployment"),
  deployedBy: z.string().describe("User or system that initiated deployment"),
  commitHash: z.string().optional().describe("Git commit hash if available"),
  duration: z.number().optional().describe("Deployment duration in seconds"),
  errorMessage: z.string().optional().describe("Error message if failed"),
});

export type Deployment = z.infer<typeof deploymentSchema>;

// -----------------------------------------------------------------------------
// Approval Types
// -----------------------------------------------------------------------------

export const approvalTypeSchema = z.enum([
  "deployment",
  "access_request",
  "configuration_change",
  "infrastructure",
]);

export type ApprovalType = z.infer<typeof approvalTypeSchema>;

export const approvalSchema = z.object({
  id: z.string().describe("Unique approval request identifier"),
  type: approvalTypeSchema.describe("Type of approval request"),
  title: z.string().describe("Brief description of the request"),
  description: z.string().describe("Detailed description"),
  requestedBy: z.string().describe("User who made the request"),
  requestedAt: z.string().describe("ISO 8601 timestamp of request"),
  priority: z.enum(["low", "medium", "high", "critical"]).describe("Request priority"),
});

export type Approval = z.infer<typeof approvalSchema>;

// -----------------------------------------------------------------------------
// System Health Types
// -----------------------------------------------------------------------------

export const healthStatusSchema = z.enum(["healthy", "degraded", "down", "unknown"]);

export type HealthStatus = z.infer<typeof healthStatusSchema>;

export const systemHealthSchema = z.object({
  service: z.string().describe("Service name"),
  status: healthStatusSchema.describe("Current health status"),
  uptime: z.number().describe("Uptime percentage (0-100)"),
  latency: z.number().optional().describe("Average latency in milliseconds"),
  errorRate: z.number().optional().describe("Error rate percentage"),
  lastChecked: z.string().describe("ISO 8601 timestamp of last health check"),
});

export type SystemHealth = z.infer<typeof systemHealthSchema>;

// -----------------------------------------------------------------------------
// Action Types
// -----------------------------------------------------------------------------

export const actionSchema = z.object({
  id: z.string().describe("Unique action identifier"),
  label: z.string().describe("Display label for the action"),
  type: z
    .enum(["primary", "secondary", "danger", "warning"])
    .describe("Visual styling type"),
  disabled: z.boolean().optional().describe("Whether action is disabled"),
  tooltip: z.string().optional().describe("Tooltip text for the action"),
});

export type Action = z.infer<typeof actionSchema>;
