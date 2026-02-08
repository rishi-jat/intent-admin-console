/**
 * @file ActionPanel.tsx
 * @description Contextual action panel for deployment operations
 *
 * Renders action buttons for operations like retry, view logs, acknowledge,
 * and other contextual actions based on the current deployment state.
 */

"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod";
import { actionSchema, type Action } from "./types";

// -----------------------------------------------------------------------------
// Schema Definition
// -----------------------------------------------------------------------------

export const actionPanelSchema = z.object({
  title: z.string().describe("Panel title describing the context"),
  description: z.string().optional().describe("Additional context or instructions"),
  actions: z.array(actionSchema).describe("Available actions"),
  targetId: z.string().optional().describe("ID of the target resource (deployment, approval, etc.)"),
  targetName: z.string().optional().describe("Display name of the target resource"),
});

export type ActionPanelProps = z.infer<typeof actionPanelSchema>;

// -----------------------------------------------------------------------------
// Action Button Styles
// -----------------------------------------------------------------------------

const ACTION_STYLES: Record<Action["type"], string> = {
  primary: cn(
    "bg-blue-600 text-white hover:bg-blue-700",
    "dark:bg-blue-500 dark:hover:bg-blue-600"
  ),
  secondary: cn(
    "bg-gray-100 text-gray-900 hover:bg-gray-200",
    "dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
  ),
  danger: cn(
    "bg-red-600 text-white hover:bg-red-700",
    "dark:bg-red-500 dark:hover:bg-red-600"
  ),
  warning: cn(
    "bg-yellow-500 text-white hover:bg-yellow-600",
    "dark:bg-yellow-600 dark:hover:bg-yellow-700"
  ),
};

// -----------------------------------------------------------------------------
// Action Button Component
// -----------------------------------------------------------------------------

interface ActionButtonProps {
  action: Action;
  onAction: (actionId: string) => void;
}

function ActionButton({ action, onAction }: ActionButtonProps) {
  const handleClick = React.useCallback(() => {
    if (!action.disabled) {
      onAction(action.id);
    }
  }, [action.id, action.disabled, onAction]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={action.disabled}
      title={action.tooltip}
      className={cn(
        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        ACTION_STYLES[action.type],
        action.disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {action.label}
    </button>
  );
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const ActionPanel = React.forwardRef<HTMLDivElement, ActionPanelProps>(
  ({ title, description, actions, targetId, targetName }, ref) => {
    // Track action states for visual feedback
    const [actionStates, setActionStates] = React.useState<
      Record<string, "idle" | "pending" | "success" | "error">
    >({});

    const handleAction = React.useCallback(
      (actionId: string) => {
        // Set pending state
        setActionStates((prev) => ({ ...prev, [actionId]: "pending" }));

        // Simulate action execution (in production, this would call actual APIs)
        // For now, we show success after a brief delay
        setTimeout(() => {
          setActionStates((prev) => ({ ...prev, [actionId]: "success" }));

          // Reset to idle after showing success
          setTimeout(() => {
            setActionStates((prev) => ({ ...prev, [actionId]: "idle" }));
          }, 2000);
        }, 500);

        // Log the action for debugging/demo purposes
        console.log("[ActionPanel] Action triggered:", {
          actionId,
          targetId,
          targetName,
        });
      },
      [targetId, targetName]
    );

    if (!actions || actions.length === 0) {
      return (
        <div
          ref={ref}
          className="border border-border rounded-lg p-4 text-center text-muted-foreground"
        >
          No actions available.
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className="border border-border rounded-lg overflow-hidden bg-card"
      >
        <div className="px-4 py-3 bg-muted/30 border-b border-border">
          <h3 className="font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          {targetName && (
            <p className="text-sm text-muted-foreground mt-1">
              Target:{" "}
              <span className="font-medium text-foreground">{targetName}</span>
              {targetId && (
                <span className="font-mono text-xs ml-2">({targetId})</span>
              )}
            </p>
          )}
        </div>

        <div className="p-4">
          <div className="flex flex-wrap gap-3">
            {actions.map((action) => {
              const state = actionStates[action.id] || "idle";
              
              return (
                <div key={action.id} className="relative">
                  <ActionButton action={action} onAction={handleAction} />
                  {state === "pending" && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                    </span>
                  )}
                  {state === "success" && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-white text-xs">
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

ActionPanel.displayName = "ActionPanel";
