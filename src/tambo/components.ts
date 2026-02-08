/**
 * @file components.ts
 * @description Central registry of Tambo-controlled admin components
 *
 * This file exports all admin console components with their Zod schemas
 * for registration with the TamboProvider.
 */

import type { TamboComponent } from "@tambo-ai/react";

// Component imports
import {
  ActionPanel,
  actionPanelSchema,
  ApprovalQueue,
  approvalQueueSchema,
  DeploymentTable,
  deploymentTableSchema,
  FallbackIntent,
  fallbackIntentSchema,
  RetryConfirmation,
  retryConfirmationSchema,
  SystemStatusSummary,
  systemStatusSummarySchema,
} from "@/components/admin";

/**
 * Admin console components registered for Tambo AI control.
 *
 * Each component includes:
 * - name: Unique identifier used by the AI
 * - description: Helps the AI understand when to use the component
 * - component: The React component reference
 * - propsSchema: Zod schema for prop validation
 */
export const adminComponents: TamboComponent[] = [
  {
    name: "DeploymentTable",
    description: `Displays a table of deployments with status badges, service names, versions, timestamps, and deployment metadata.

WHEN TO USE:
- User asks about deployments, deployment history, or what was deployed
- User asks about recent deployments or deployments to a specific environment
- User asks about failed deployments or deployment errors (combine with ActionPanel)

PROPS:
- deployments: Array of deployment objects (fetch using getDeployments or getFailedDeployments tool)
- title: Optional title for the table
- showEnvironment: Whether to show environment column (default: true)

EXAMPLE QUERIES:
- "Show me recent deployments"
- "What deployed to production?"
- "Show failed deployments" (also render ActionPanel)`,
    component: DeploymentTable,
    propsSchema: deploymentTableSchema,
  },
  {
    name: "ActionPanel",
    description: `A contextual action panel that displays available actions for a deployment or resource.

WHEN TO USE:
- Always render alongside DeploymentTable when showing FAILED deployments
- When user needs to take action on a deployment (retry, view logs, acknowledge)
- Only for failed or in-progress deployments that need attention

PROPS:
- title: Panel title describing the context
- description: Additional context or instructions
- actions: Array of action objects (fetch using getDeploymentActions tool)
- targetId: ID of the target deployment
- targetName: Display name of the target deployment

DO NOT use when just showing deployment history without failures.`,
    component: ActionPanel,
    propsSchema: actionPanelSchema,
  },
  {
    name: "ApprovalQueue",
    description: `Displays a queue of pending approval requests with approve/reject actions.

WHEN TO USE:
- User asks about approvals, pending requests, or what needs authorization
- User asks what needs their review or sign-off
- User asks about approval queue or pending items

PROPS:
- approvals: Array of approval objects (fetch using getPendingApprovals tool)
- title: Optional queue title
- showType: Whether to show approval type badges (default: true)

EXAMPLE QUERIES:
- "Show pending approvals"
- "What needs my approval?"
- "Show approval queue"
- "Any critical approvals waiting?"`,
    component: ApprovalQueue,
    propsSchema: approvalQueueSchema,
  },
  {
    name: "SystemStatusSummary",
    description: `Shows a high-level system health overview with status indicators for each service.

WHEN TO USE:
- User asks about system health, service status, or uptime
- User asks about operational health or if any services are down
- User asks how services are doing

PROPS:
- services: Array of health objects (fetch using getSystemHealth tool)
- title: Optional summary title
- showMetrics: Whether to show detailed metrics (default: true)

EXAMPLE QUERIES:
- "Show system status"
- "How are our services doing?"
- "Any services down?"
- "Show health overview"`,
    component: SystemStatusSummary,
    propsSchema: systemStatusSummarySchema,
  },
  {
    name: "FallbackIntent",
    description: `Displayed when the user's request cannot be mapped to a supported operation.

WHEN TO USE:
- The request is clearly outside the supported domains
- Supported domains are ONLY: deployment monitoring, deployment failures, operational approvals, system health
- Examples of unsupported: booking meetings, sending emails, creating users, weather, general questions

PROPS:
- userQuery: The original user query that triggered the fallback
- reason: "unsupported" | "ambiguous" | "error"
- suggestedActions: Optional list of suggested valid actions

ALWAYS show this for requests like: "book a meeting", "send email", "what's the weather", etc.`,
    component: FallbackIntent,
    propsSchema: fallbackIntentSchema,
  },
  {
    name: "RetryConfirmation",
    description: `Shows the result of a deployment retry action with visible status change.

WHEN TO USE:
- After calling the retryDeployment tool
- When the user has requested to retry a failed deployment
- To show the action → outcome loop

PROPS (from retryDeployment tool output):
- success: Whether the retry was successful
- deploymentId: The deployment ID that was retried
- serviceName: Name of the service
- previousStatus: Status before retry (failed/cancelled)
- newStatus: New status after retry (in_progress)
- message: Confirmation message
- estimatedDuration: Estimated time in seconds

This component DEMONSTRATES the action → outcome loop:
User intent ("retry deployment X") → Tool (retryDeployment) → UI update (this component)`,
    component: RetryConfirmation,
    propsSchema: retryConfirmationSchema,
  },
];
