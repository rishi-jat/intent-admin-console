/**
 * @file FallbackIntent.tsx
 * @description Fallback component for unsupported or ambiguous intents
 *
 * Rendered when the user's intent cannot be mapped to a supported operation.
 * Displays helpful information about what actions ARE supported.
 */

"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod";

// -----------------------------------------------------------------------------
// Schema Definition
// -----------------------------------------------------------------------------

export const fallbackIntentSchema = z.object({
  userQuery: z.string().describe("The original user query that triggered the fallback"),
  reason: z
    .enum(["unsupported", "ambiguous", "error"])
    .optional()
    .describe("Why the fallback was triggered"),
  suggestedActions: z
    .array(z.string())
    .optional()
    .describe("List of suggested valid actions the user can try"),
});

export type FallbackIntentProps = z.infer<typeof fallbackIntentSchema>;

// -----------------------------------------------------------------------------
// Supported Intents (Explicit List)
// -----------------------------------------------------------------------------

const SUPPORTED_INTENTS = [
  {
    category: "Deployment Monitoring",
    examples: [
      "Show me recent deployments",
      "What deployed today?",
      "Show production deployments",
    ],
  },
  {
    category: "Deployment Failures",
    examples: [
      "Show failed deployments",
      "What deployments failed today?",
      "Show me deployment errors",
    ],
  },
  {
    category: "Operational Approvals",
    examples: [
      "Show pending approvals",
      "What needs my approval?",
      "Show approval queue",
    ],
  },
  {
    category: "System Health",
    examples: [
      "Show system status",
      "How are our services doing?",
      "Show health overview",
    ],
  },
];

// -----------------------------------------------------------------------------
// Reason Configuration
// -----------------------------------------------------------------------------

const REASON_CONFIG: Record<
  NonNullable<FallbackIntentProps["reason"]>,
  { title: string; description: string; icon: string }
> = {
  unsupported: {
    title: "Unsupported Request",
    description: "This action is not supported by the admin console.",
    icon: "⚠️",
  },
  ambiguous: {
    title: "Unclear Request",
    description: "I couldn't determine what you're asking for. Please try a more specific request.",
    icon: "❓",
  },
  error: {
    title: "Something Went Wrong",
    description: "An error occurred while processing your request.",
    icon: "❌",
  },
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const FallbackIntent = React.forwardRef<
  HTMLDivElement,
  FallbackIntentProps
>(({ userQuery, reason = "unsupported", suggestedActions }, ref) => {
  const reasonConfig = REASON_CONFIG[reason];

  return (
    <div
      ref={ref}
      className="border border-border rounded-lg overflow-hidden bg-card"
    >
      {/* Header */}
      <div className="bg-muted/30 px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-lg">{reasonConfig.icon}</span>
          <h3 className="font-semibold text-foreground">{reasonConfig.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {reasonConfig.description}
        </p>
      </div>

      {/* User query display */}
      <div className="px-4 py-3 border-b border-border bg-muted/10">
        <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          Your Request
        </div>
        <div className="text-foreground font-medium">
          "{userQuery}"
        </div>
      </div>

      {/* Suggested actions if provided */}
      {suggestedActions && suggestedActions.length > 0 && (
        <div className="px-4 py-3 border-b border-border">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Did you mean?
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedActions.map((action, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm",
                  "bg-blue-100 text-blue-800 hover:bg-blue-200",
                  "dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50",
                  "transition-colors cursor-pointer"
                )}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Supported intents */}
      <div className="px-4 py-4">
        <div className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
          What I Can Help With
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUPPORTED_INTENTS.map((intent) => (
            <div key={intent.category}>
              <h4 className="font-medium text-foreground text-sm mb-1">
                {intent.category}
              </h4>
              <ul className="space-y-0.5">
                {intent.examples.map((example, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-start gap-1.5"
                  >
                    <span className="text-blue-500 mt-0.5">→</span>
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

FallbackIntent.displayName = "FallbackIntent";
