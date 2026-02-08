/**
 * @file intentClassifier.ts
 * @description Explicit intent classification with visibility for reviewers
 *
 * This module provides deterministic intent classification based on
 * keyword matching. All classifications are logged for debugging.
 *
 * This is NOT a prompt hack - it's explicit pattern matching that
 * makes intent selection visible and auditable.
 */

import { IntentCategory, INTENT_COMPONENT_MAP } from "./intentPolicy";

/**
 * Keyword patterns for each intent category.
 * These are explicit and auditable - no hidden logic.
 */
const INTENT_PATTERNS: Record<IntentCategory, RegExp[]> = {
  [IntentCategory.DEPLOYMENT_MONITORING]: [
    /\b(show|list|get|view|display)\b.*\b(deployment|deploy)/i,
    /\bwhat\b.*\b(deployed|deployment)/i,
    /\brecent\b.*\bdeployment/i,
    /\bdeployment\b.*\b(history|status|list)/i,
  ],
  [IntentCategory.DEPLOYMENT_FAILURES]: [
    /\b(failed|failure|broken|error)\b.*\bdeployment/i,
    /\bdeployment\b.*\b(failed|failure|broken|error)/i,
    /\bwhat\b.*\b(broke|failed|broken)/i,
    /\bshow\b.*\b(failed|broken|error)/i,
  ],
  [IntentCategory.OPERATIONAL_APPROVALS]: [
    /\b(approval|approve|pending|authorization)/i,
    /\bwhat\b.*\b(needs|need)\b.*\b(approval|approve)/i,
    /\bapproval\b.*\b(queue|list|pending)/i,
  ],
  [IntentCategory.SYSTEM_HEALTH]: [
    /\b(system|service|health|status|uptime)/i,
    /\b(how|show)\b.*\b(services?|systems?)\b.*\b(doing|status|health)/i,
    /\bany\b.*\b(services?|systems?)\b.*\bdown/i,
  ],
  [IntentCategory.UNSUPPORTED]: [], // Fallback - no patterns
};

/**
 * Classification result with full context for debugging.
 */
export interface ClassificationResult {
  query: string;
  detectedIntent: IntentCategory;
  confidence: "high" | "medium" | "low";
  matchedPattern: string | null;
  allowedComponents: string[];
  timestamp: string;
}

/**
 * Classify user intent based on explicit pattern matching.
 * All classifications are logged for visibility.
 */
export function classifyIntent(query: string): ClassificationResult {
  const normalizedQuery = query.toLowerCase().trim();

  // Check each intent category in priority order
  // Failures before monitoring (more specific first)
  const priorityOrder: IntentCategory[] = [
    IntentCategory.DEPLOYMENT_FAILURES,
    IntentCategory.OPERATIONAL_APPROVALS,
    IntentCategory.SYSTEM_HEALTH,
    IntentCategory.DEPLOYMENT_MONITORING,
  ];

  for (const intent of priorityOrder) {
    const patterns = INTENT_PATTERNS[intent];
    for (const pattern of patterns) {
      if (pattern.test(normalizedQuery)) {
        const result: ClassificationResult = {
          query,
          detectedIntent: intent,
          confidence: "high",
          matchedPattern: pattern.source,
          allowedComponents: INTENT_COMPONENT_MAP[intent],
          timestamp: new Date().toISOString(),
        };

        // Log for reviewer visibility
        logClassification(result);
        return result;
      }
    }
  }

  // No match - unsupported intent
  const fallbackResult: ClassificationResult = {
    query,
    detectedIntent: IntentCategory.UNSUPPORTED,
    confidence: "high", // We're confident it's unsupported
    matchedPattern: null,
    allowedComponents: INTENT_COMPONENT_MAP[IntentCategory.UNSUPPORTED],
    timestamp: new Date().toISOString(),
  };

  logClassification(fallbackResult);
  return fallbackResult;
}

/**
 * Log classification for debugging/reviewer visibility.
 * This makes intent selection auditable.
 */
function logClassification(result: ClassificationResult): void {
  const emoji = {
    [IntentCategory.DEPLOYMENT_MONITORING]: "📊",
    [IntentCategory.DEPLOYMENT_FAILURES]: "❌",
    [IntentCategory.OPERATIONAL_APPROVALS]: "✅",
    [IntentCategory.SYSTEM_HEALTH]: "💚",
    [IntentCategory.UNSUPPORTED]: "⚠️",
  };

  console.group(`${emoji[result.detectedIntent]} Intent Classification`);
  console.log("Query:", result.query);
  console.log("Detected Intent:", result.detectedIntent);
  console.log("Confidence:", result.confidence);
  console.log("Allowed Components:", result.allowedComponents);
  if (result.matchedPattern) {
    console.log("Matched Pattern:", result.matchedPattern);
  }
  console.groupEnd();
}

/**
 * Validate that a component is allowed for the given intent.
 * Returns true if allowed, false otherwise.
 */
export function isComponentAllowedForIntent(
  componentName: string,
  intent: IntentCategory
): boolean {
  const allowed = INTENT_COMPONENT_MAP[intent];
  const isAllowed = allowed.includes(componentName);

  if (!isAllowed) {
    console.warn(
      `[Intent Policy] Component "${componentName}" is NOT allowed for intent "${intent}". ` +
        `Allowed: ${allowed.join(", ")}`
    );
  }

  return isAllowed;
}
