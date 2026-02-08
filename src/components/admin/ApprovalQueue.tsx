/**
 * @file ApprovalQueue.tsx
 * @description Displays pending approvals with approve/reject actions
 *
 * This component renders a queue of pending approval requests with
 * contextual information and action buttons for processing.
 */

"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod";
import { approvalSchema, type Approval, type ApprovalType } from "./types";

// -----------------------------------------------------------------------------
// Schema Definition
// -----------------------------------------------------------------------------

export const approvalQueueSchema = z.object({
  approvals: z.array(approvalSchema).describe("Array of pending approvals"),
  title: z.string().optional().describe("Optional queue title"),
  showType: z.boolean().optional().describe("Whether to show approval type badges"),
});

export type ApprovalQueueProps = z.infer<typeof approvalQueueSchema>;

// -----------------------------------------------------------------------------
// Type Badge Configuration
// -----------------------------------------------------------------------------

const TYPE_CONFIG: Record<ApprovalType, { label: string; className: string }> = {
  deployment: {
    label: "Deployment",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  access_request: {
    label: "Access Request",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
  configuration_change: {
    label: "Config Change",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  },
  infrastructure: {
    label: "Infrastructure",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
};

// -----------------------------------------------------------------------------
// Priority Badge Configuration
// -----------------------------------------------------------------------------

const PRIORITY_CONFIG: Record<
  Approval["priority"],
  { className: string; icon: string }
> = {
  low: {
    className: "text-gray-500",
    icon: "○",
  },
  medium: {
    className: "text-yellow-500",
    icon: "◐",
  },
  high: {
    className: "text-orange-500",
    icon: "●",
  },
  critical: {
    className: "text-red-500",
    icon: "◉",
  },
};

// -----------------------------------------------------------------------------
// Utility Functions
// -----------------------------------------------------------------------------

function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return isoString;
  }
}

// -----------------------------------------------------------------------------
// Approval Card Component
// -----------------------------------------------------------------------------

interface ApprovalCardProps {
  approval: Approval;
  showType: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  state: "idle" | "approving" | "rejecting" | "approved" | "rejected";
}

function ApprovalCard({
  approval,
  showType,
  onApprove,
  onReject,
  state,
}: ApprovalCardProps) {
  const priorityConfig = PRIORITY_CONFIG[approval.priority];
  const typeConfig = TYPE_CONFIG[approval.type];

  const isProcessing = state === "approving" || state === "rejecting";
  const isProcessed = state === "approved" || state === "rejected";

  return (
    <div
      className={cn(
        "border border-border rounded-lg p-4 bg-card transition-all",
        isProcessed && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Header with type and priority */}
          <div className="flex items-center gap-2 mb-2">
            {showType && (
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                  typeConfig.className
                )}
              >
                {typeConfig.label}
              </span>
            )}
            <span
              className={cn("text-sm font-medium", priorityConfig.className)}
              title={`Priority: ${approval.priority}`}
            >
              {priorityConfig.icon} {approval.priority}
            </span>
          </div>

          {/* Title and description */}
          <h4 className="font-medium text-foreground truncate">
            {approval.title}
          </h4>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {approval.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span>
              Requested by{" "}
              <span className="font-medium">{approval.requestedBy}</span>
            </span>
            <span>{formatRelativeTime(approval.requestedAt)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          {!isProcessed ? (
            <>
              <button
                type="button"
                onClick={() => onApprove(approval.id)}
                disabled={isProcessing}
                className={cn(
                  "px-3 py-1.5 rounded text-sm font-medium transition-colors",
                  "bg-green-600 text-white hover:bg-green-700",
                  "dark:bg-green-500 dark:hover:bg-green-600",
                  "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
                  isProcessing && "opacity-50 cursor-not-allowed"
                )}
              >
                {state === "approving" ? "..." : "Approve"}
              </button>
              <button
                type="button"
                onClick={() => onReject(approval.id)}
                disabled={isProcessing}
                className={cn(
                  "px-3 py-1.5 rounded text-sm font-medium transition-colors",
                  "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  "dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
                  "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
                  isProcessing && "opacity-50 cursor-not-allowed"
                )}
              >
                {state === "rejecting" ? "..." : "Reject"}
              </button>
            </>
          ) : (
            <span
              className={cn(
                "px-3 py-1.5 rounded text-sm font-medium text-center",
                state === "approved"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              )}
            >
              {state === "approved" ? "Approved" : "Rejected"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const ApprovalQueue = React.forwardRef<
  HTMLDivElement,
  ApprovalQueueProps
>(({ approvals, title, showType = true }, ref) => {
  const [approvalStates, setApprovalStates] = React.useState<
    Record<string, "idle" | "approving" | "rejecting" | "approved" | "rejected">
  >({});

  const handleApprove = React.useCallback((id: string) => {
    setApprovalStates((prev) => ({ ...prev, [id]: "approving" }));

    // Simulate API call
    setTimeout(() => {
      setApprovalStates((prev) => ({ ...prev, [id]: "approved" }));
      console.log("[ApprovalQueue] Approved:", id);
    }, 500);
  }, []);

  const handleReject = React.useCallback((id: string) => {
    setApprovalStates((prev) => ({ ...prev, [id]: "rejecting" }));

    // Simulate API call
    setTimeout(() => {
      setApprovalStates((prev) => ({ ...prev, [id]: "rejected" }));
      console.log("[ApprovalQueue] Rejected:", id);
    }, 500);
  }, []);

  if (!approvals || approvals.length === 0) {
    return (
      <div
        ref={ref}
        className="border border-border rounded-lg p-6 text-center"
      >
        <div className="text-muted-foreground">
          No pending approvals.
        </div>
        <p className="text-sm text-muted-foreground/60 mt-1">
          All approval requests have been processed.
        </p>
      </div>
    );
  }

  const pendingCount = approvals.filter(
    (a) => !["approved", "rejected"].includes(approvalStates[a.id] || "idle")
  ).length;

  return (
    <div ref={ref} className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">
          {title || "Pending Approvals"}
        </h3>
        <span className="text-sm text-muted-foreground">
          {pendingCount} pending
        </span>
      </div>

      {/* Approval cards */}
      <div className="space-y-3">
        {approvals.map((approval) => (
          <ApprovalCard
            key={approval.id}
            approval={approval}
            showType={showType}
            onApprove={handleApprove}
            onReject={handleReject}
            state={approvalStates[approval.id] || "idle"}
          />
        ))}
      </div>
    </div>
  );
});

ApprovalQueue.displayName = "ApprovalQueue";
