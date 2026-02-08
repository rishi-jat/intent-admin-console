/**
 * @file DeploymentTable.tsx
 * @description Displays deployment information in a tabular format
 *
 * This component renders a list of deployments with status indicators,
 * service names, timestamps, and other relevant deployment metadata.
 */

"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod";
import {
  deploymentSchema,
  type Deployment,
  type DeploymentStatus,
} from "./types";

// -----------------------------------------------------------------------------
// Schema Definition
// -----------------------------------------------------------------------------

export const deploymentTableSchema = z.object({
  deployments: z
    .array(deploymentSchema)
    .describe("Array of deployments to display"),
  title: z.string().optional().describe("Optional table title"),
  showEnvironment: z
    .boolean()
    .optional()
    .describe("Whether to show the environment column"),
});

export type DeploymentTableProps = z.infer<typeof deploymentTableSchema>;

// -----------------------------------------------------------------------------
// Status Badge Component
// -----------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  DeploymentStatus,
  { label: string; className: string }
> = {
  success: {
    label: "Success",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  },
};

function StatusBadge({ status }: { status: DeploymentStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

// -----------------------------------------------------------------------------
// Environment Badge Component
// -----------------------------------------------------------------------------

const ENVIRONMENT_CONFIG: Record<
  Deployment["environment"],
  { className: string }
> = {
  production: {
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
  staging: {
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  },
  development: {
    className: "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
  },
};

function EnvironmentBadge({ environment }: { environment: Deployment["environment"] }) {
  const config = ENVIRONMENT_CONFIG[environment];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize",
        config.className
      )}
    >
      {environment}
    </span>
  );
}

// -----------------------------------------------------------------------------
// Utility Functions
// -----------------------------------------------------------------------------

function formatTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

function formatDuration(seconds: number | undefined): string {
  if (seconds === undefined) return "-";
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const DeploymentTable = React.forwardRef<
  HTMLDivElement,
  DeploymentTableProps
>(({ deployments, title, showEnvironment = true }, ref) => {
  if (!deployments || deployments.length === 0) {
    return (
      <div
        ref={ref}
        className="border border-border rounded-lg p-6 text-center text-muted-foreground"
      >
        No deployments found.
      </div>
    );
  }

  return (
    <div ref={ref} className="border border-border rounded-lg overflow-hidden">
      {title && (
        <div className="bg-muted/50 px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Service
              </th>
              {showEnvironment && (
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Environment
                </th>
              )}
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Version
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Deployed
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Duration
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                By
              </th>
            </tr>
          </thead>
          <tbody>
            {deployments.map((deployment) => (
              <tr
                key={deployment.id}
                className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">
                    {deployment.serviceName}
                  </div>
                  {deployment.commitHash && (
                    <div className="text-xs text-muted-foreground font-mono">
                      {deployment.commitHash.slice(0, 7)}
                    </div>
                  )}
                </td>
                {showEnvironment && (
                  <td className="px-4 py-3">
                    <EnvironmentBadge environment={deployment.environment} />
                  </td>
                )}
                <td className="px-4 py-3">
                  <StatusBadge status={deployment.status} />
                  {deployment.errorMessage && (
                    <div className="text-xs text-red-600 dark:text-red-400 mt-1 max-w-xs truncate">
                      {deployment.errorMessage}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-muted-foreground">
                  {deployment.version}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatTimestamp(deployment.timestamp)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDuration(deployment.duration)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {deployment.deployedBy}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

DeploymentTable.displayName = "DeploymentTable";
