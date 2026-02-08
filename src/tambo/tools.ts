/**
 * @file tools.ts
 * @description Mock data tools for the admin console
 *
 * These tools provide deterministic mock data for testing and development.
 * In production, these would be replaced with actual API calls.
 *
 * All tools have explicit input/output schemas for type safety.
 */

import type { Approval, Deployment, SystemHealth } from "@/components/admin";
import { z } from "zod";

// -----------------------------------------------------------------------------
// Mock Data Generation Helpers
// -----------------------------------------------------------------------------

function generateTimestamp(hoursAgo: number): string {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
}

function generateCommitHash(): string {
  return Math.random().toString(16).substring(2, 10);
}

// -----------------------------------------------------------------------------
// Mock Deployment Data
// -----------------------------------------------------------------------------

const MOCK_DEPLOYMENTS: Deployment[] = [
  {
    id: "dep-001",
    serviceName: "api-gateway",
    environment: "production",
    status: "success",
    version: "v2.4.1",
    timestamp: generateTimestamp(1),
    deployedBy: "deploy-bot",
    commitHash: generateCommitHash(),
    duration: 142,
  },
  {
    id: "dep-002",
    serviceName: "user-service",
    environment: "production",
    status: "failed",
    version: "v1.8.0",
    timestamp: generateTimestamp(2),
    deployedBy: "alice.chen",
    commitHash: generateCommitHash(),
    duration: 89,
    errorMessage: "Health check failed after deployment",
  },
  {
    id: "dep-003",
    serviceName: "payment-processor",
    environment: "staging",
    status: "success",
    version: "v3.1.0",
    timestamp: generateTimestamp(3),
    deployedBy: "bob.smith",
    commitHash: generateCommitHash(),
    duration: 256,
  },
  {
    id: "dep-004",
    serviceName: "notification-service",
    environment: "production",
    status: "in_progress",
    version: "v1.2.5",
    timestamp: generateTimestamp(0.1),
    deployedBy: "deploy-bot",
    commitHash: generateCommitHash(),
  },
  {
    id: "dep-005",
    serviceName: "analytics-engine",
    environment: "development",
    status: "success",
    version: "v0.9.2",
    timestamp: generateTimestamp(5),
    deployedBy: "carol.davis",
    commitHash: generateCommitHash(),
    duration: 178,
  },
  {
    id: "dep-006",
    serviceName: "auth-service",
    environment: "production",
    status: "failed",
    version: "v2.0.0",
    timestamp: generateTimestamp(6),
    deployedBy: "deploy-bot",
    commitHash: generateCommitHash(),
    duration: 45,
    errorMessage: "Database migration failed: constraint violation",
  },
  {
    id: "dep-007",
    serviceName: "search-service",
    environment: "staging",
    status: "pending",
    version: "v1.5.0",
    timestamp: generateTimestamp(0.5),
    deployedBy: "dan.evans",
    commitHash: generateCommitHash(),
  },
  {
    id: "dep-008",
    serviceName: "cdn-manager",
    environment: "production",
    status: "success",
    version: "v4.2.1",
    timestamp: generateTimestamp(8),
    deployedBy: "eve.foster",
    commitHash: generateCommitHash(),
    duration: 312,
  },
];

// -----------------------------------------------------------------------------
// Mock Approval Data
// -----------------------------------------------------------------------------

const MOCK_APPROVALS: Approval[] = [
  {
    id: "apr-001",
    type: "deployment",
    title: "Deploy payment-processor v3.2.0 to production",
    description:
      "Release includes new fraud detection algorithms and performance optimizations for high-volume transactions.",
    requestedBy: "alice.chen",
    requestedAt: generateTimestamp(0.5),
    priority: "high",
  },
  {
    id: "apr-002",
    type: "access_request",
    title: "Production database read access for Bob Smith",
    description:
      "Requesting read-only access to production database for debugging customer issue #4521.",
    requestedBy: "bob.smith",
    requestedAt: generateTimestamp(2),
    priority: "medium",
  },
  {
    id: "apr-003",
    type: "configuration_change",
    title: "Increase API rate limit for enterprise tier",
    description:
      "Customer Acme Corp requires higher API rate limits. Proposed: 10,000 req/min (from 5,000).",
    requestedBy: "carol.davis",
    requestedAt: generateTimestamp(4),
    priority: "low",
  },
  {
    id: "apr-004",
    type: "infrastructure",
    title: "Scale up Kubernetes cluster nodes",
    description:
      "Traffic projections for upcoming product launch require additional compute capacity.",
    requestedBy: "dan.evans",
    requestedAt: generateTimestamp(1),
    priority: "critical",
  },
  {
    id: "apr-005",
    type: "deployment",
    title: "Emergency hotfix for auth-service",
    description:
      "Critical security patch addressing CVE-2024-XXXX. All affected endpoints need immediate update.",
    requestedBy: "security-team",
    requestedAt: generateTimestamp(0.2),
    priority: "critical",
  },
];

// -----------------------------------------------------------------------------
// Mock System Health Data
// -----------------------------------------------------------------------------

const MOCK_SYSTEM_HEALTH: SystemHealth[] = [
  {
    service: "API Gateway",
    status: "healthy",
    uptime: 99.98,
    latency: 45,
    errorRate: 0.02,
    lastChecked: generateTimestamp(0.01),
  },
  {
    service: "User Service",
    status: "degraded",
    uptime: 99.5,
    latency: 250,
    errorRate: 2.1,
    lastChecked: generateTimestamp(0.01),
  },
  {
    service: "Payment Processor",
    status: "healthy",
    uptime: 99.99,
    latency: 120,
    errorRate: 0.01,
    lastChecked: generateTimestamp(0.01),
  },
  {
    service: "Notification Service",
    status: "healthy",
    uptime: 99.95,
    latency: 80,
    errorRate: 0.05,
    lastChecked: generateTimestamp(0.01),
  },
  {
    service: "Auth Service",
    status: "down",
    uptime: 95.2,
    latency: undefined,
    errorRate: 100,
    lastChecked: generateTimestamp(0.01),
  },
  {
    service: "Search Service",
    status: "healthy",
    uptime: 99.9,
    latency: 65,
    errorRate: 0.1,
    lastChecked: generateTimestamp(0.01),
  },
  {
    service: "Analytics Engine",
    status: "healthy",
    uptime: 99.85,
    latency: 180,
    errorRate: 0.15,
    lastChecked: generateTimestamp(0.01),
  },
  {
    service: "CDN Manager",
    status: "healthy",
    uptime: 99.999,
    latency: 12,
    errorRate: 0.001,
    lastChecked: generateTimestamp(0.01),
  },
];

// -----------------------------------------------------------------------------
// Tool: Get Deployments
// -----------------------------------------------------------------------------

export const getDeploymentsInputSchema = z.object({
  status: z
    .enum(["success", "failed", "in_progress", "pending", "cancelled", "all"])
    .optional()
    .describe("Filter by deployment status. Default: all"),
  environment: z
    .enum(["production", "staging", "development", "all"])
    .optional()
    .describe("Filter by environment. Default: all"),
  limit: z
    .number()
    .min(1)
    .max(50)
    .optional()
    .describe("Maximum number of deployments to return. Default: 10"),
});

export type GetDeploymentsInput = z.infer<typeof getDeploymentsInputSchema>;

export async function getDeployments(
  input: GetDeploymentsInput
): Promise<Deployment[]> {
  const { status = "all", environment = "all", limit = 10 } = input;

  let filtered = [...MOCK_DEPLOYMENTS];

  if (status !== "all") {
    filtered = filtered.filter((d) => d.status === status);
  }

  if (environment !== "all") {
    filtered = filtered.filter((d) => d.environment === environment);
  }

  // Sort by timestamp descending (most recent first)
  filtered.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return filtered.slice(0, limit);
}

// -----------------------------------------------------------------------------
// Tool: Get Failed Deployments
// -----------------------------------------------------------------------------

export const getFailedDeploymentsInputSchema = z.object({
  environment: z
    .enum(["production", "staging", "development", "all"])
    .optional()
    .describe("Filter by environment. Default: all"),
  limit: z
    .number()
    .min(1)
    .max(50)
    .optional()
    .describe("Maximum number of deployments to return. Default: 10"),
});

export type GetFailedDeploymentsInput = z.infer<typeof getFailedDeploymentsInputSchema>;

export async function getFailedDeployments(
  input: GetFailedDeploymentsInput
): Promise<Deployment[]> {
  const { environment = "all", limit = 10 } = input;

  let filtered = MOCK_DEPLOYMENTS.filter((d) => d.status === "failed");

  if (environment !== "all") {
    filtered = filtered.filter((d) => d.environment === environment);
  }

  // Sort by timestamp descending
  filtered.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return filtered.slice(0, limit);
}

// -----------------------------------------------------------------------------
// Tool: Get Pending Approvals
// -----------------------------------------------------------------------------

export const getPendingApprovalsInputSchema = z.object({
  type: z
    .enum(["deployment", "access_request", "configuration_change", "infrastructure", "all"])
    .optional()
    .describe("Filter by approval type. Default: all"),
  priority: z
    .enum(["low", "medium", "high", "critical", "all"])
    .optional()
    .describe("Filter by priority. Default: all"),
  limit: z
    .number()
    .min(1)
    .max(50)
    .optional()
    .describe("Maximum number of approvals to return. Default: 20"),
});

export type GetPendingApprovalsInput = z.infer<typeof getPendingApprovalsInputSchema>;

export async function getPendingApprovals(
  input: GetPendingApprovalsInput
): Promise<Approval[]> {
  const { type = "all", priority = "all", limit = 20 } = input;

  let filtered = [...MOCK_APPROVALS];

  if (type !== "all") {
    filtered = filtered.filter((a) => a.type === type);
  }

  if (priority !== "all") {
    filtered = filtered.filter((a) => a.priority === priority);
  }

  // Sort by priority (critical first) then by timestamp
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  filtered.sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
  });

  return filtered.slice(0, limit);
}

// -----------------------------------------------------------------------------
// Tool: Get System Health
// -----------------------------------------------------------------------------

export const getSystemHealthInputSchema = z.object({
  status: z
    .enum(["healthy", "degraded", "down", "all"])
    .optional()
    .describe("Filter by health status. Default: all"),
});

export type GetSystemHealthInput = z.infer<typeof getSystemHealthInputSchema>;

export async function getSystemHealth(
  input: GetSystemHealthInput
): Promise<SystemHealth[]> {
  const { status = "all" } = input;

  if (status === "all") {
    return [...MOCK_SYSTEM_HEALTH];
  }

  return MOCK_SYSTEM_HEALTH.filter((s) => s.status === status);
}

// -----------------------------------------------------------------------------
// Tool: Get Deployment Actions
// -----------------------------------------------------------------------------

export const getDeploymentActionsInputSchema = z.object({
  deploymentId: z.string().describe("The deployment ID to get actions for"),
  deploymentStatus: z
    .enum(["success", "failed", "in_progress", "pending", "cancelled"])
    .describe("Current status of the deployment"),
});

export type GetDeploymentActionsInput = z.infer<typeof getDeploymentActionsInputSchema>;

export async function getDeploymentActions(input: GetDeploymentActionsInput) {
  const { deploymentId, deploymentStatus } = input;

  // Find the deployment
  const deployment = MOCK_DEPLOYMENTS.find((d) => d.id === deploymentId);

  // Define available actions based on status
  const actionsMap: Record<typeof deploymentStatus, { id: string; label: string; type: "primary" | "secondary" | "danger" | "warning" }[]> = {
    success: [
      { id: "view-logs", label: "View Logs", type: "secondary" },
      { id: "rollback", label: "Rollback", type: "warning" },
    ],
    failed: [
      { id: "view-logs", label: "View Logs", type: "secondary" },
      { id: "retry", label: "Retry Deployment", type: "primary" },
      { id: "acknowledge", label: "Acknowledge", type: "secondary" },
    ],
    in_progress: [
      { id: "view-logs", label: "View Logs", type: "secondary" },
      { id: "cancel", label: "Cancel", type: "danger" },
    ],
    pending: [
      { id: "start", label: "Start Deployment", type: "primary" },
      { id: "cancel", label: "Cancel", type: "danger" },
    ],
    cancelled: [
      { id: "view-logs", label: "View Logs", type: "secondary" },
      { id: "retry", label: "Retry Deployment", type: "primary" },
    ],
  };

  return {
    deploymentId,
    serviceName: deployment?.serviceName ?? "Unknown Service",
    actions: actionsMap[deploymentStatus] ?? [],
  };
}

// -----------------------------------------------------------------------------
// Tool: Retry Deployment (Action with visible outcome)
// -----------------------------------------------------------------------------

export const retryDeploymentInputSchema = z.object({
  deploymentId: z.string().describe("The ID of the failed deployment to retry"),
});

export type RetryDeploymentInput = z.infer<typeof retryDeploymentInputSchema>;

/**
 * Result of a retry operation with explicit status.
 */
export interface RetryDeploymentResult {
  success: boolean;
  deploymentId: string;
  serviceName: string;
  previousStatus: "failed" | "cancelled";
  newStatus: "in_progress";
  message: string;
  estimatedDuration: number; // seconds
  retryTimestamp: string;
}

/**
 * Retry a failed deployment.
 * This is a MOCK implementation that returns a deterministic result.
 *
 * The key requirement: calling this tool produces a visible state change
 * that the UI can reflect (failed → in_progress).
 */
export async function retryDeployment(
  input: RetryDeploymentInput
): Promise<RetryDeploymentResult> {
  const { deploymentId } = input;

  // Find the deployment
  const deployment = MOCK_DEPLOYMENTS.find((d) => d.id === deploymentId);

  if (!deployment) {
    return {
      success: false,
      deploymentId,
      serviceName: "Unknown",
      previousStatus: "failed",
      newStatus: "in_progress",
      message: `Deployment ${deploymentId} not found`,
      estimatedDuration: 0,
      retryTimestamp: new Date().toISOString(),
    };
  }

  // Log for visibility
  console.group("🔄 Retry Deployment Action");
  console.log("Deployment ID:", deploymentId);
  console.log("Service:", deployment.serviceName);
  console.log("Previous Status:", deployment.status);
  console.log("New Status: in_progress");
  console.groupEnd();

  // Return successful retry result
  // In a real system, this would trigger an actual deployment
  return {
    success: true,
    deploymentId,
    serviceName: deployment.serviceName,
    previousStatus: deployment.status as "failed" | "cancelled",
    newStatus: "in_progress",
    message: `Retry initiated for ${deployment.serviceName}. Deployment is now in progress.`,
    estimatedDuration: 120, // 2 minutes
    retryTimestamp: new Date().toISOString(),
  };
}
