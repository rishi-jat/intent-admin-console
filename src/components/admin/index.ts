/**
 * @file index.ts
 * @description Central export file for admin components
 */

// Components
export { ActionPanel, actionPanelSchema } from "./ActionPanel";
export { ApprovalQueue, approvalQueueSchema } from "./ApprovalQueue";
export { DeploymentTable, deploymentTableSchema } from "./DeploymentTable";
export { FallbackIntent, fallbackIntentSchema } from "./FallbackIntent";
export { IntentDebugBanner } from "./IntentDebugBanner";
export { RetryConfirmation, retryConfirmationSchema } from "./RetryConfirmation";
export { SystemStatusSummary, systemStatusSummarySchema } from "./SystemStatusSummary";

// Types
export type {
  Action,
  Approval,
  ApprovalType,
  Deployment,
  DeploymentStatus,
  HealthStatus,
  SystemHealth,
} from "./types";

// Schemas (for external validation if needed)
export {
  actionSchema,
  approvalSchema,
  approvalTypeSchema,
  deploymentSchema,
  deploymentStatusSchema,
  healthStatusSchema,
  systemHealthSchema,
} from "./types";
