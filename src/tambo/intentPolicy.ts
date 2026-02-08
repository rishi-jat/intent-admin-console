/**
 * @file intentPolicy.ts
 * @description Intent classification policy for the admin console
 *
 * This file defines the bounded set of supported intents and maps them
 * to their corresponding UI components. All intent classification is
 * explicit and deterministic - no hidden magic.
 *
 * SUPPORTED INTENT DOMAINS:
 * 1. Deployment monitoring - viewing deployment history and status
 * 2. Deployment failures - viewing and acting on failed deployments
 * 3. Operational approvals - reviewing and processing approval requests
 * 4. System health overview - monitoring service health status
 */

/**
 * Enum of supported intent categories.
 * This is an explicit, bounded list - anything outside triggers fallback.
 */
export enum IntentCategory {
  DEPLOYMENT_MONITORING = "deployment_monitoring",
  DEPLOYMENT_FAILURES = "deployment_failures",
  OPERATIONAL_APPROVALS = "operational_approvals",
  SYSTEM_HEALTH = "system_health",
  UNSUPPORTED = "unsupported",
}

/**
 * Mapping of intent categories to primary components.
 * Each intent category has a well-defined component response.
 */
export const INTENT_COMPONENT_MAP: Record<IntentCategory, string[]> = {
  [IntentCategory.DEPLOYMENT_MONITORING]: ["DeploymentTable"],
  [IntentCategory.DEPLOYMENT_FAILURES]: ["DeploymentTable", "ActionPanel"],
  [IntentCategory.OPERATIONAL_APPROVALS]: ["ApprovalQueue"],
  [IntentCategory.SYSTEM_HEALTH]: ["SystemStatusSummary"],
  [IntentCategory.UNSUPPORTED]: ["FallbackIntent"],
};

/**
 * Intent classification hints for the AI.
 * These descriptions help the model understand which category applies.
 */
export const INTENT_DESCRIPTIONS: Record<IntentCategory, string> = {
  [IntentCategory.DEPLOYMENT_MONITORING]:
    "User wants to view deployment history, recent deployments, or deployment status across environments.",
  [IntentCategory.DEPLOYMENT_FAILURES]:
    "User wants to view failed deployments, deployment errors, or needs to take action on broken deployments.",
  [IntentCategory.OPERATIONAL_APPROVALS]:
    "User wants to view pending approvals, process approval requests, or review what needs authorization.",
  [IntentCategory.SYSTEM_HEALTH]:
    "User wants to see system health, service status, uptime, or overall operational health.",
  [IntentCategory.UNSUPPORTED]:
    "The user's request does not match any supported admin console operation.",
};

/**
 * Example queries for each intent category.
 * Used for documentation and potentially for few-shot prompting.
 */
export const INTENT_EXAMPLES: Record<IntentCategory, string[]> = {
  [IntentCategory.DEPLOYMENT_MONITORING]: [
    "Show me recent deployments",
    "What deployed to production today?",
    "Show staging deployments",
    "List all deployments from this week",
    "What's the deployment history for api-gateway?",
  ],
  [IntentCategory.DEPLOYMENT_FAILURES]: [
    "Show failed deployments",
    "What deployments failed today?",
    "Show me deployment errors",
    "Why did the last deployment fail?",
    "List broken deployments",
  ],
  [IntentCategory.OPERATIONAL_APPROVALS]: [
    "Show pending approvals",
    "What needs my approval?",
    "Show the approval queue",
    "Any critical approvals waiting?",
    "List deployment approvals",
  ],
  [IntentCategory.SYSTEM_HEALTH]: [
    "Show system status",
    "How are our services doing?",
    "Show health overview",
    "Any services down?",
    "Check service health",
  ],
  [IntentCategory.UNSUPPORTED]: [
    "Book a meeting",
    "Send an email",
    "Create a new user",
    "What's the weather?",
  ],
};

/**
 * System prompt context for intent-driven behavior.
 * This is provided to the AI to ensure correct component selection.
 */
export const INTENT_SYSTEM_PROMPT = `
You are an internal admin console assistant. You help operations teams monitor deployments, manage approvals, and check system health.

IMPORTANT: You must respond with UI COMPONENTS, not text explanations.

SUPPORTED OPERATIONS (respond with appropriate components):

1. DEPLOYMENT MONITORING
   - User asks about deployments, deployment history, or what was deployed
   - Respond with: DeploymentTable component
   - Use the getDeployments tool to fetch data

2. DEPLOYMENT FAILURES  
   - User asks about failed deployments or deployment errors
   - Respond with: DeploymentTable (filtered to failed) AND ActionPanel
   - Use the getFailedDeployments tool to fetch data
   - Use getDeploymentActions to get available actions

3. OPERATIONAL APPROVALS
   - User asks about approvals, pending requests, or what needs authorization
   - Respond with: ApprovalQueue component
   - Use the getPendingApprovals tool to fetch data

4. SYSTEM HEALTH
   - User asks about service health, status, or uptime
   - Respond with: SystemStatusSummary component
   - Use the getSystemHealth tool to fetch data

UNSUPPORTED REQUESTS:
- If the user asks for something outside these four categories
- Respond with: FallbackIntent component
- Include the user's original query and suggest valid alternatives

RULES:
- Always use tools to fetch data before rendering components
- Never make up data - only use what tools return
- Props must match component schemas exactly
- Prefer showing UI over explaining in text
`;
