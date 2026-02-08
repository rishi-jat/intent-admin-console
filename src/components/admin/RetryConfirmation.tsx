/**
 * @file RetryConfirmation.tsx
 * @description Confirmation component showing deployment retry outcome
 *
 * This component demonstrates a complete action → outcome loop:
 * 1. User requested retry (intent)
 * 2. Tool executed (retryDeployment)
 * 3. UI updates to show result (this component)
 *
 * The UI visibly changes because of intent + action, not text.
 */

"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod";

// -----------------------------------------------------------------------------
// Schema Definition
// -----------------------------------------------------------------------------

export const retryConfirmationSchema = z.object({
  success: z.boolean().describe("Whether the retry was successful"),
  deploymentId: z.string().describe("The deployment ID that was retried"),
  serviceName: z.string().describe("Name of the service"),
  previousStatus: z.enum(["failed", "cancelled"]).describe("Status before retry"),
  newStatus: z.literal("in_progress").describe("New status after retry"),
  message: z.string().describe("Confirmation message"),
  estimatedDuration: z.number().describe("Estimated time in seconds"),
});

export type RetryConfirmationProps = z.infer<typeof retryConfirmationSchema>;

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const RetryConfirmation = React.forwardRef<
  HTMLDivElement,
  RetryConfirmationProps
>(
  (
    {
      success,
      deploymentId,
      serviceName,
      previousStatus,
      newStatus,
      message,
      estimatedDuration,
    },
    ref
  ) => {
    // Simulate progress for visual feedback
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
      if (!success) return;

      // Animate progress bar
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }, [success]);

    if (!success) {
      return (
        <div
          ref={ref}
          className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20"
        >
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <span className="text-lg">❌</span>
            <span className="font-medium">Retry Failed</span>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
            {message}
          </p>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className="border border-green-200 dark:border-green-800 rounded-lg overflow-hidden bg-green-50 dark:bg-green-900/20"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-green-200 dark:border-green-800 bg-green-100/50 dark:bg-green-900/30">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔄</span>
            <span className="font-semibold text-green-800 dark:text-green-300">
              Deployment Retry Initiated
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status change visualization */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium",
                  "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                  "line-through opacity-60"
                )}
              >
                {previousStatus}
              </span>
              <span className="text-gray-400">→</span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium",
                  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                  "animate-pulse"
                )}
              >
                {newStatus}
              </span>
            </div>
          </div>

          {/* Service info */}
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Service: </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {serviceName}
            </span>
            <span className="text-gray-400 dark:text-gray-500 font-mono text-xs ml-2">
              ({deploymentId})
            </span>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Deploying...</span>
              <span>~{Math.round(estimatedDuration / 60)} min</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Message */}
          <p className="text-sm text-green-700 dark:text-green-400">
            ✓ {message}
          </p>
        </div>
      </div>
    );
  }
);

RetryConfirmation.displayName = "RetryConfirmation";
